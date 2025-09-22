"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import type { ChartOptions } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface AttendanceRecord {
  semesterName: string;
  courseId: number;
  courseName: string;
  academicYear: string;
  date: string;
  present: boolean;
}

interface AnalyticsTabProps {
  username: string;
  semesterId: string | number;
}

export default function AnalyticsTab({ username, semesterId }: AnalyticsTabProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAttendance() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<AttendanceRecord[]>(
          `http://localhost:8080/api/attendance/student/${username}/semester/${semesterId}`
        );
        setAttendanceRecords(response.data);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
  }, [username, semesterId]);

  const courseAttendanceMap = attendanceRecords.reduce((acc, record) => {
    if (!acc[record.courseId]) {
      acc[record.courseId] = {
        courseName: record.courseName,
        presentCount: 0,
        totalCount: 0,
      };
    }
    acc[record.courseId].totalCount += 1;
    if (record.present) {
      acc[record.courseId].presentCount += 1;
    }
    return acc;
  }, {} as Record<
    number,
    { courseName: string; presentCount: number; totalCount: number }
  >);

  const labels = Object.values(courseAttendanceMap).map((c) => c.courseName);
  const dataValues = Object.values(courseAttendanceMap).map(
    (c) => Math.round((c.presentCount / c.totalCount) * 100)
  );

  const attendanceData = {
    labels,
    datasets: [
      {
        label: "Attendance %",
        data: dataValues,
        backgroundColor: "#3B82F6",
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Percentage",
          font: { size: 14, weight: "bold" },
        },
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}%`,
          color: "#374151",
          font: { size: 12 },
        },
        grid: {
          color: "#E5E7EB",
        },
      },
      x: {
        title: {
          display: true,
          text: "Courses",
          font: { size: 14, weight: "bold" },
        },
        ticks: {
          color: "#374151",
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#2563EB",
        titleFont: { weight: "bold" },
        callbacks: {
          label: (tooltipItem: TooltipItem<"bar">) =>
            `${tooltipItem.raw as number}% attendance`,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="skeleton h-8 w-1/2"></div>
          <div className="skeleton h-64 w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (attendanceRecords.length === 0) {
    return <div className="alert alert-info">No attendance data available.</div>;
  }

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">Attendance Analytics</h2>
        {attendanceRecords.length > 0 && (
          <div className="text-sm">
            Semester: <span className="font-semibold">{attendanceRecords[0].semesterName}</span> | Academic Year:{" "}
            <span className="font-semibold">{attendanceRecords[0].academicYear}</span>
          </div>
        )}
        <div className="relative h-72 w-full">
          <Bar data={attendanceData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}