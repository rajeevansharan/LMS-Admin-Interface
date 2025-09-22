"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "../../../components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { CourseService } from "@/services/CourseService";
import { StudentGradebook, ActivityGrade } from "@/types/Gradebook";

// --- JSPDF & AUTOTABLE IMPORTS (Corrected) ---
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // <-- THE FIX: Import autoTable as a function

// --- CHART.JS SETUP ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// --- TYPE EXTENSIONS FOR ANALYTICS ---
interface StudentGradebookWithAnalytics extends StudentGradebook {
  totalMarks: number;
  totalMaxMarks: number;
  averagePercentage: number;
}

interface ActivityStats {
  average: number;
  high: number;
  low: number;
}

// Define proper type for jsPDF with autoTable (still useful for the 'lastAutoTable' property)
interface AutoTablejsPDF extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const GradebookViewPage = () => {
  // --- HOOKS AND STATE ---
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const { token } = useAuth();

  const [gradebookData, setGradebookData] = useState<
    StudentGradebookWithAnalytics[]
  >([]);
  const [activities, setActivities] = useState<ActivityGrade[]>([]);
  const [activityStats, setActivityStats] = useState<
    Record<string, ActivityStats>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const exportableContentRef = useRef<HTMLDivElement>(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (courseId && token) {
      const fetchGradebook = async () => {
        setIsLoading(true);
        try {
          const data = await CourseService.getCourseGradebook(courseId, token);

          if (data && data.length > 0) {
            const processedData = processGradebookData(data);
            setGradebookData(processedData.studentsWithAnalytics);
            setActivities(data[0].grades);
            setActivityStats(processedData.activityStats);
          } else {
            setGradebookData([]);
            setActivities([]);
          }

          setError(null);
        } catch (err) {
          console.error("Error fetching gradebook:", err);
          setError(
            err instanceof Error ? err.message : "An unknown error occurred.",
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchGradebook();
    } else if (!courseId) {
      setError("Course ID is missing from the URL.");
      setIsLoading(false);
    }
  }, [courseId, token]);

  // --- ANALYTICS CALCULATIONS ---
  const processGradebookData = (data: StudentGradebook[]) => {
    const activityStats: Record<string, ActivityStats> = {};

    if (data.length > 0 && data[0].grades.length > 0) {
      data[0].grades.forEach((activity) => {
        const gradesForActivity = data
          .map(
            (student) =>
              student.grades.find((g) => g.activityId === activity.activityId)
                ?.marksObtained,
          )
          .filter((g) => g !== null && g !== undefined) as number[];
        if (gradesForActivity.length > 0) {
          activityStats[activity.activityId] = {
            average:
              gradesForActivity.reduce((sum, g) => sum + g, 0) /
              gradesForActivity.length,
            high: Math.max(...gradesForActivity),
            low: Math.min(...gradesForActivity),
          };
        } else {
          activityStats[activity.activityId] = { average: 0, high: 0, low: 0 };
        }
      });
    }

    const studentsWithAnalytics: StudentGradebookWithAnalytics[] = data.map(
      (student) => {
        const totalMarks = student.grades.reduce(
          (sum, g) => sum + (g.marksObtained ?? 0),
          0,
        );
        const totalMaxMarks = student.grades.reduce(
          (sum, g) => sum + g.maxMarks,
          0,
        );
        const averagePercentage =
          totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
        return { ...student, totalMarks, totalMaxMarks, averagePercentage };
      },
    );

    return { studentsWithAnalytics, activityStats };
  };

  // --- DERIVED DATA FOR CHARTS AND SUMMARY ---
  const courseAnalytics = useMemo(() => {
    if (gradebookData.length === 0) {
      return { classAverage: 0, gradeDistribution: { labels: [], data: [] } };
    }
    const totalPercentageSum = gradebookData.reduce(
      (sum, student) => sum + student.averagePercentage,
      0,
    );
    const classAverage = totalPercentageSum / gradebookData.length;

    const bins = { "90-100": 0, "80-89": 0, "70-79": 0, "60-69": 0, "<60": 0 };
    gradebookData.forEach((student) => {
      const p = student.averagePercentage;
      if (p >= 90) bins["90-100"]++;
      else if (p >= 80) bins["80-89"]++;
      else if (p >= 70) bins["70-79"]++;
      else if (p >= 60) bins["60-69"]++;
      else bins["<60"]++;
    });

    return {
      classAverage,
      gradeDistribution: {
        labels: Object.keys(bins),
        data: Object.values(bins),
      },
    };
  }, [gradebookData]);

  // --- PDF EXPORT HANDLER (Corrected) ---
  const handleExportPDF = async () => {
    if (!courseId) {
      console.error("Course ID is required for PDF export");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
    };

    // Title Section
    pdf.setFontSize(24);
    pdf.setFont("bold");
    pdf.text("Gradebook & Analytics Report", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont("normal");
    pdf.text(`Course ID: ${courseId}`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      yPosition,
      { align: "center" },
    );
    yPosition += 20;

    // Course Overview Section
    checkPageBreak(40);
    pdf.setFontSize(18);
    pdf.setFont("bold");
    pdf.text("Course Overview", 20, yPosition);
    yPosition += 15;

    const overviewData = [
      ["Number of Students", gradebookData.length.toString()],
      ["Class Average", `${courseAnalytics.classAverage.toFixed(2)}%`],
      ["Gradable Items", activities.length.toString()],
    ];

    // <-- THE FIX: Use autoTable(pdf, ...) instead of pdf.autoTable(...)
    autoTable(pdf, {
      head: [["Metric", "Value"]],
      body: overviewData,
      startY: yPosition,
      margin: { left: 20 },
      theme: "grid",
      headStyles: { fillColor: [51, 51, 51] },
      styles: { fontSize: 11 },
    });

    yPosition = (pdf as AutoTablejsPDF).lastAutoTable.finalY + 15;

    // Grade Distribution Section
    checkPageBreak(60);
    pdf.setFontSize(18);
    pdf.setFont("bold");
    pdf.text("Grade Distribution", 20, yPosition);
    yPosition += 15;

    const distributionData = courseAnalytics.gradeDistribution.labels.map(
      (label, index) => [
        label,
        courseAnalytics.gradeDistribution.data[index].toString(),
      ],
    );

    // <-- THE FIX: Use autoTable(pdf, ...)
    autoTable(pdf, {
      head: [["Grade Range", "Number of Students"]],
      body: distributionData,
      startY: yPosition,
      margin: { left: 20 },
      theme: "grid",
      headStyles: { fillColor: [51, 51, 51] },
      styles: { fontSize: 11 },
    });

    yPosition = (pdf as AutoTablejsPDF).lastAutoTable.finalY + 15;

    // Add the chart as an image
    try {
      const chartCanvas = document.querySelector("canvas") as HTMLCanvasElement;
      if (chartCanvas) {
        checkPageBreak(80);
        pdf.setFontSize(14);
        pdf.setFont("bold");
        pdf.text("Grade Distribution Chart", 20, yPosition);
        yPosition += 10;

        const chartImage = chartCanvas.toDataURL("image/png", 1.0);
        const chartWidth = 150;
        const chartHeight = 80;

        pdf.addImage(chartImage, "PNG", 20, yPosition, chartWidth, chartHeight);
        yPosition += chartHeight + 15;
      }
    } catch (error) {
      console.warn("Could not include chart in PDF:", error);
    }

    // Detailed Grades Section
    pdf.addPage();
    yPosition = 20;

    pdf.setFontSize(18);
    pdf.setFont("bold");
    pdf.text("Detailed Grades", 20, yPosition);
    yPosition += 15;

    const tableHeaders = [
      "Student Name",
      ...activities.map((a) => a.activityTitle),
      "Total Score",
      "Average (%)",
    ];
    const tableData = gradebookData.map((student) => {
      const row = [student.studentName];
      activities.forEach((activity) => {
        const grade = student.grades.find(
          (g) => g.activityId === activity.activityId,
        );
        row.push(grade?.marksObtained?.toString() ?? "-");
      });
      row.push(`${student.totalMarks} / ${student.totalMaxMarks}`);
      row.push(student.averagePercentage.toFixed(2));
      return row;
    });

    const avgRow = ["Class Average"];
    activities.forEach((activity) =>
      avgRow.push(
        activityStats[activity.activityId]?.average.toFixed(1) ?? "N/A",
      ),
    );
    avgRow.push("", "");

    const highRow = ["Highest Score"];
    activities.forEach((activity) =>
      highRow.push(
        activityStats[activity.activityId]?.high?.toString() ?? "N/A",
      ),
    );
    highRow.push("", "");

    tableData.push(avgRow, highRow);

    // <-- THE FIX: Use autoTable(pdf, ...)
    autoTable(pdf, {
      head: [tableHeaders],
      body: tableData,
      startY: yPosition,
      margin: { left: 10, right: 10 },
      theme: "grid",
      headStyles: {
        fillColor: [51, 51, 51],
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 30 },
        [tableHeaders.length - 2]: { fontStyle: "bold" },
        [tableHeaders.length - 1]: { fontStyle: "bold" },
      },
      didParseCell: function (data) {
        if (data.row.index >= gradebookData.length) {
          data.cell.styles.fillColor = [240, 240, 240];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    // Activity Statistics Summary (New Page)
    pdf.addPage();
    yPosition = 20;

    pdf.setFontSize(18);
    pdf.setFont("bold");
    pdf.text("Activity Statistics Summary", 20, yPosition);
    yPosition += 15;

    const activityStatsData = activities.map((activity) => [
      activity.activityTitle,
      activity.maxMarks.toString(),
      activityStats[activity.activityId]?.average.toFixed(1) ?? "N/A",
      activityStats[activity.activityId]?.high?.toString() ?? "N/A",
      activityStats[activity.activityId]?.low?.toString() ?? "N/A",
    ]);

    // <-- THE FIX: Use autoTable(pdf, ...)
    autoTable(pdf, {
      head: [
        [
          "Activity",
          "Max Marks",
          "Class Average",
          "Highest Score",
          "Lowest Score",
        ],
      ],
      body: activityStatsData,
      startY: yPosition,
      margin: { left: 20 },
      theme: "grid",
      headStyles: { fillColor: [51, 51, 51] },
      styles: { fontSize: 10 },
    });

    // Footer on each page
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont("normal");
      pdf.text(
        `Page ${i} of ${totalPages} | Generated from Gradebook System`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" },
      );
    }

    pdf.save(`gradebook-report-course-${courseId}.pdf`);
  };

  // --- RENDER ---
  return (
    <Layout>
      <div className="p-4 md:p-6 bg-primary">
        <div className="flex justify-between items-center mb-6 px-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Gradebook & Analytics
          </h1>
          <button
            onClick={handleExportPDF}
            disabled={isLoading || gradebookData.length === 0}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Export Report (PDF)
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            <p className="mt-4 text-lg text-gray-300">Loading Gradebook...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            <strong>Error:</strong> <span>{error}</span>
          </div>
        ) : gradebookData.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">
              No students or gradable items found for this course.
            </p>
          </div>
        ) : (
          <div
            ref={exportableContentRef}
            className="bg-gray-900 p-4 rounded-lg space-y-8"
          >
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Course Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg text-center shadow-lg">
                  <div className="text-4xl font-bold text-blue-400">
                    {gradebookData.length}
                  </div>
                  <div className="text-gray-300 mt-1">Students</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg text-center shadow-lg">
                  <div className="text-4xl font-bold text-green-400">
                    {courseAnalytics.classAverage.toFixed(2)}%
                  </div>
                  <div className="text-gray-300 mt-1">Class Average</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg text-center shadow-lg">
                  <div className="text-4xl font-bold text-purple-400">
                    {activities.length}
                  </div>
                  <div className="text-gray-300 mt-1">Gradable Items</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1">
              <h2 className="text-xl font-bold text-white mb-4">
                Grade Distribution
              </h2>

              <div className="bg-slate-800 p-4 rounded-lg shadow-lg h-96 relative">
                <Bar
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: {
                        display: true,
                        text: "Number of Students per Percentage Range",
                        color: "#F9FAFB",
                        font: { size: 16 },
                      },
                    },
                    scales: {
                      y: {
                        ticks: { stepSize: 1, color: "#D1D5DB" },
                        grid: { color: "rgba(255, 255, 255, 0.1)" },
                      },
                      x: {
                        ticks: { color: "#D1D5DB" },
                        grid: { color: "rgba(255, 255, 255, 0.1)" },
                      },
                    },
                  }}
                  data={{
                    labels: courseAnalytics.gradeDistribution.labels,
                    datasets: [
                      {
                        label: "Number of Students",
                        data: courseAnalytics.gradeDistribution.data,
                        backgroundColor: "rgba(59, 130, 246, 0.7)",
                        borderColor: "rgba(59, 130, 246, 1)",
                        borderWidth: 1,
                        borderRadius: 4,
                      },
                    ],
                  }}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Detailed Grades
              </h2>
              <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="min-w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200 sticky left-0 bg-slate-800 z-20">
                        Student Name
                      </th>
                      {activities.map((activity) => (
                        <th
                          key={activity.activityId}
                          className="py-3 px-4 text-sm font-semibold text-gray-300 whitespace-nowrap"
                        >
                          {activity.activityTitle}
                          <span className="block font-normal text-gray-400">
                            ( / {activity.maxMarks} )
                          </span>
                        </th>
                      ))}
                      <th className="py-3 px-4 text-sm font-semibold text-blue-300 whitespace-nowrap bg-blue-500/10">
                        Total Score
                      </th>
                      <th className="py-3 px-4 text-sm font-semibold text-green-300 whitespace-nowrap bg-green-500/10">
                        Average
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-900">
                    {gradebookData.map((student, index) => (
                      <tr
                        key={student.personId}
                        className={
                          index % 2 === 0
                            ? "bg-slate-800/50"
                            : "bg-slate-800/20"
                        }
                      >
                        <td
                          className="py-3 px-4 text-gray-200 font-medium sticky left-0 z-10 whitespace-nowrap"
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#1f2937" : "#171e2b",
                          }}
                        >
                          {student.studentName}
                        </td>
                        {activities.map((activityHeader) => {
                          const grade = student.grades.find(
                            (g) => g.activityId === activityHeader.activityId,
                          );
                          return (
                            <td
                              key={activityHeader.activityId}
                              className="py-3 px-4 text-center text-gray-300"
                            >
                              {grade?.marksObtained ?? (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-3 px-4 text-center font-bold text-blue-300 bg-blue-500/10">
                          {student.totalMarks} / {student.totalMaxMarks}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-green-300 bg-green-500/10">
                          {student.averagePercentage.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-950 text-white">
                    <tr className="font-semibold">
                      <td className="py-3 px-4 text-left text-sm sticky left-0 bg-slate-950 z-20">
                        Class Average
                      </td>
                      {activities.map((activity) => (
                        <td
                          key={`avg-${activity.activityId}`}
                          className="py-3 px-4 text-center text-sm"
                        >
                          {activityStats[activity.activityId]?.average.toFixed(
                            1,
                          ) ?? "N/A"}
                        </td>
                      ))}
                      <td colSpan={2} className="py-3 px-4 text-center"></td>
                    </tr>
                    <tr className="font-semibold">
                      <td className="py-3 px-4 text-left text-sm sticky left-0 bg-slate-950 z-20">
                        Highest Score
                      </td>
                      {activities.map((activity) => (
                        <td
                          key={`high-${activity.activityId}`}
                          className="py-3 px-4 text-center text-sm"
                        >
                          {activityStats[activity.activityId]?.high ?? "N/A"}
                        </td>
                      ))}
                      <td colSpan={2} className="py-3 px-4 text-center"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GradebookViewPage;
