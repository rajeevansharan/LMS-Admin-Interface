"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface AttendanceRecord {
  semesterName: string;
  courseId: number;
  courseName: string;
  academicYear: string;
  date: string;
  present: boolean;
}

interface AttendanceSummaryWidgetProps {
  username: string;
  semesterId: string | number;
  onViewDetails: () => void;
}

export default function AttendanceSummaryWidget({ username, semesterId, onViewDetails }: AttendanceSummaryWidgetProps) {
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
        console.error(err);
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

  const courseCount = Object.keys(courseAttendanceMap).length;

  const averageAttendance = courseCount > 0
    ? Math.round(
        Object.values(courseAttendanceMap).reduce(
          (sum, c) => sum + (c.presentCount / c.totalCount) * 100,
          0
        ) / courseCount
      )
    : 0;

  if (loading) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="skeleton h-8 w-3/4"></div>
          <div className="skeleton h-6 w-1/2"></div>
          <div className="skeleton h-6 w-1/2"></div>
          <div className="skeleton h-10 w-full mt-4"></div>
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
        <h2 className="card-title">Attendance Summary</h2>
        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Semester</div>
            <div className="stat-value text-lg">{attendanceRecords[0].semesterName}</div>
            <div className="stat-desc">{attendanceRecords[0].academicYear}</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Courses</div>
            <div className="stat-value text-lg">{courseCount}</div>
            <div className="stat-desc">Total Courses</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Average Attendance</div>
            <div className="stat-value text-lg">{averageAttendance}%</div>
            <div className="stat-desc">Overall</div>
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <button 
            onClick={onViewDetails}
            className="btn btn-primary"
          >
            View Detailed Analytics
          </button>
        </div>
      </div>
    </div>
  );
}