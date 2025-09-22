import React from "react";
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

export default function AnalyticsTab() {
  const attendanceData = {
    labels: ["CS101", "ENG102", "MATH103", "PHY104"],
    datasets: [
      {
        label: "Attendance %",
        data: [78, 89, 92, 67],
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
          color: "#374151", // dark text
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

  const hasData = attendanceData.datasets[0]?.data.length > 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Attendance Analytics</h2>
      <div className="relative h-72 w-full md:w-3/4 lg:w-1/2 mx-auto">
        {hasData ? (
          <Bar data={attendanceData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 italic">
            No attendance data available.
          </div>
        )}
      </div>
    </div>
  );
}
