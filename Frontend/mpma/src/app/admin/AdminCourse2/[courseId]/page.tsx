"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { BackendCourseDetails } from "../types/course";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [course, setCourse] = useState<BackendCourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courseId = params.courseId;
  const semesterId = searchParams.get("semesterId");
  const batch = searchParams.get("batch");
  const hasValidParams = courseId && semesterId && batch;

  useEffect(() => {
    const fetchCourse = async () => {
      if (!hasValidParams) {
        setError("Missing required parameters in URL");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get<BackendCourseDetails>(
          `http://localhost:8080/api/enrollments/admin/course/${courseId}/semester/${semesterId}/batch/${batch}`
        );
        console.log("Students data:", response.data.students);
        setCourse(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch course details", err);
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to load course details";
        setError(`Error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, semesterId, batch, hasValidParams]);

  if (!hasValidParams) {
    return (
      <div className="p-6">
        <div className="alert alert-error max-w-2xl mx-auto">
          <span>Invalid URL parameters.</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error max-w-2xl mx-auto">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6">
        <div className="alert alert-error max-w-2xl mx-auto">
          <span>Course not found.</span>
        </div>
      </div>
    );
  }

  const studentIds = course.students.map((s) => s.studentId);
  const uniqueIds = [...new Set(studentIds)];
  if (studentIds.length !== uniqueIds.length) {
    console.warn("Duplicate student IDs detected:", {
      totalStudents: studentIds.length,
      uniqueIds: uniqueIds.length,
    });
  }

  return (
    <div className="min-h-screen bg-base-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">
            {course.courseName}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="rounded-lg p-5 bg-blue-50 border border-blue-200 shadow">
              <p className="text-sm font-medium text-blue-600 mb-1">
                Enrollment Status
              </p>
              <p className="text-lg font-semibold text-blue-900">
                {course.enrollmentStatus}
              </p>
            </div>

            <div className="rounded-lg p-5 bg-indigo-50 border border-indigo-200 shadow">
              <p className="text-sm font-medium text-indigo-600 mb-1">
                Semester & Academic Year
              </p>
              <p className="text-lg font-semibold text-indigo-900">
                {course.semesterName} - {course.batch}
              </p>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-700">Course ID</p>
            <p className="text-lg font-semibold text-gray-900">
              {course.courseId}
            </p>
          </div>
          <div className="card bg-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-700">Semester ID</p>
            <p className="text-lg font-semibold text-gray-900">
              {course.semesterId}
            </p>
          </div>
          <div className="card bg-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-700">Total Enrolled</p>
            <p className="text-lg font-semibold text-gray-900">
              {course.enrolledStudentCount}
            </p>
          </div>
        </div>

        {/* Lecturers Section */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <FaChalkboardTeacher /> Lecturers ({course.lecturers.length})
          </h2>
          {course.lecturers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {course.lecturers.map((lecturer) => (
                <div
                  className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg shadow-sm"
                  key={`lecturer-${lecturer.lecturerId}`}
                >
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                      <span>{lecturer.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{lecturer.name}</p>
                    <p className="text-sm text-gray-600">{lecturer.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              <span>No lecturers assigned to this course.</span>
            </div>
          )}
        </div>

        {/* Students Section */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <FaUserGraduate /> Students ({course.students.length})
          </h2>
          {course.students.length > 0 ? (
            <div className="grid gap-3">
              {course.students.map((student, index) => (
                <div
                  key={`student-${student.studentId}-${student.username}-${index}`}
                  className="flex flex-col md:flex-row md:items-center justify-between bg-indigo-50 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-2 md:mb-0">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-10 h-10">
                        <span>{student.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-800">Name:</span>{" "}
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-800">
                          Student ID:
                        </span>{" "}
                        {student.studentId}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-800">Username:</span>{" "}
                    {student.username}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              <span>No students enrolled in this course.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
