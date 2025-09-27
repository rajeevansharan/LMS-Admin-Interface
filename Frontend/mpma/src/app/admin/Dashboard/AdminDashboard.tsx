"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminCalendar from "./AdminCalendar";
import AdminCourseCard from "./AdminCourseCard";

interface SimpleCourse {
  courseId: number;
  courseName: string;
  startDate: string;
  status: "Active" | "Completed";
}

interface DashboardStatus {
  activeCourses: number;
  completedCourses: number;
  totalStudents: number;
}

const AdminDashboard = () => {
  const [unassignedCourses, setUnassignedCourses] = useState<SimpleCourse[]>([]);
  const [dashboardStatus, setDashboardStatus] = useState<DashboardStatus>({
    activeCourses: 0,
    completedCourses: 0,
    totalStudents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch dashboard status
        const statusResponse = await axios.get(
          "http://localhost:8080/api/adminProfile/adminDashboardStatus"
        );
        setDashboardStatus({
          activeCourses: statusResponse.data.activeCourses,
          completedCourses: statusResponse.data.completedCourses,
          totalStudents: statusResponse.data.totalStudents,
        });

        // Fetch unassigned courses
      /*   const coursesResponse = await axios.get(
          "http://localhost:8080/api/adminProfile/unassigned-courses"
        );
        setUnassignedCourses(coursesResponse.data); */
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const { activeCourses, completedCourses, totalStudents } = dashboardStatus;

  const completionRate =
    activeCourses + completedCourses > 0
      ? Math.round(
          (completedCourses / (activeCourses + completedCourses)) * 100
        )
      : 0;

  const stats = [
    {
      title: "Active Courses",
      value: activeCourses.toString(),
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Total Students",
      value: totalStudents.toString(),
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bg} rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <div className="flex items-end justify-between mt-2">
              <p className={`text-2xl font-semibold ${stat.text}`}>{stat.value}</p>
              <span>{/* empty to keep layout consistent */}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="space-y-5">
        {/* Calendar Card */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <AdminCalendar />
        </div>

        {/* Unassigned Courses List */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Unassigned Courses</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unassignedCourses.map((course) => (
                <AdminCourseCard 
                  key={course.courseId} 
                  courseId={course.courseId}
                  courseName={course.courseName}
                  startDate={course.startDate}
                  status={course.status}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;