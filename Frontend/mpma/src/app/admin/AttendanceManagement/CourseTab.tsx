"use client";

import React, { useState } from "react";
import {
  FaSearch,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";

interface CourseAttendance {
  courseId: number;
  courseName: string;
  semesterId: string;
  semesterName: string;
  totalEnrolled: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
}

export default function CourseTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [batch, setBatch] = useState("");
  const [courses, setCourses] = useState<CourseAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentDate = new Date().toISOString().split("T")[0];

  const fetchAttendanceData = async () => {
    if (!semesterId || !batch || !selectedDate) {
      setCourses([]);
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSubmitted(true);

      const response = await axios.get(
        `http://localhost:8080/api/attendance/semester/${semesterId}/batch/${batch}/date/${selectedDate}`
      );

      // Transform the data to get unique courses with attendance stats
      const courseMap = new Map<string, CourseAttendance>();
      
      response.data.forEach((item: CourseAttendance) => {
        const uniqueKey = `${item.courseId}-${item.semesterId}-${batch}`;
        if (!courseMap.has(uniqueKey)) {
          courseMap.set(uniqueKey, {
            courseId: item.courseId,
            courseName: item.courseName,
            semesterId: item.semesterId,
            semesterName: item.semesterName,
            totalEnrolled: item.totalEnrolled,
            presentCount: item.presentCount,
            absentCount: item.absentCount,
            attendancePercentage: item.attendancePercentage
          });
        }
      });

      setCourses(Array.from(courseMap.values()));
    } catch (err) {
      setError("Failed to fetch attendance data");
      setCourses([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAttendanceData();
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `CODE${course.courseId}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return "text-green-600";
    if (percentage >= 70) return "text-yellow-500";
    return "text-red-600";
  };

  const shouldShowTable = submitted && semesterId && batch && selectedDate;

  return (
    <div className="card bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Course-wise Attendance</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Semester ID
            </label>
            <input
              type="text"
              placeholder="e.g., S2023"
              className="input input-bordered w-full"
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Batch
            </label>
            <input
              type="text"
              placeholder="e.g., B2023"
              className="input input-bordered w-full"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={currentDate}
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading || !semesterId || !batch || !selectedDate}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Get Attendance"
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="alert alert-error mb-6">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-6">
        {shouldShowTable ? (
          <div className="flex flex-wrap gap-4 items-center">
            <p className="text-sm bg-gray-100 px-3 py-1 rounded">
              <span className="font-medium">Date:</span> {selectedDate}
            </p>
            <p className="text-sm bg-gray-100 px-3 py-1 rounded">
              <span className="font-medium">Semester:</span> {semesterId}
            </p>
            <p className="text-sm bg-gray-100 px-3 py-1 rounded">
              <span className="font-medium">Batch:</span> {batch}
            </p>
          </div>
        ) : (
          !error && (
            <div className="alert alert-warning">
              <FaExclamationTriangle />
              <span>
                Please enter Semester ID, Batch, and Date, then click Get Attendance to view records
              </span>
            </div>
          )
        )}
      </div>

      {shouldShowTable && (
        <>
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses by name or code..."
                className="input input-bordered pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="font-semibold">Semester</th>
                    <th className="font-semibold">Course Code</th>
                    <th className="font-semibold">Course Name</th>
                    <th className="font-semibold">Attendance %</th>
                    <th className="font-semibold">Present</th>
                    <th className="font-semibold">Absent</th>
                    <th className="font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course, index) => (
                    <tr key={`${course.courseId}-${course.semesterId}-${batch}-${index}`} className="hover:bg-gray-50">
                      <td>{course.semesterId}</td>
                      <td className="font-medium">CODE{course.courseId}</td>
                      <td>{course.courseName}</td>
                      <td className={`font-medium ${getAttendanceColor(course.attendancePercentage)}`}>
                        {course.attendancePercentage.toFixed(1)}%
                      </td>
                      <td>{course.presentCount}</td>
                      <td>{course.absentCount}</td>
                      <td>{course.totalEnrolled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-sm mt-4 text-gray-600">
                Showing {filteredCourses.length} course(s)
              </p>
            </div>
          ) : (
            <div className="alert alert-info">
              <FaInfoCircle />
              <span>
                {searchTerm
                  ? "No courses match your search criteria"
                  : "No attendance records found for the selected criteria"}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}