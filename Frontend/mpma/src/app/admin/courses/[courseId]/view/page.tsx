"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaChalkboardTeacher } from "react-icons/fa";

interface CourseDetails {
  courseId: number;
  courseName: string;
  status: "Active" | "Completed";
  lecturers: {
    lecturerId: number;
    name: string;
    email: string;
  }[];
  startDate: string;
  endDate: string;
}

export default function CourseDetailsPage() {
  const params = useParams();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courseId = params.courseId;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/adminProfile/unassigned-courses/${courseId}`
        );
        const courseData = response.data;
        setCourse({
          ...courseData,
          lecturers: courseData.lecturers ?? [],
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch course details", err);
        setError("Failed to load course details");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

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

  return (
    <div className="min-h-screen bg-base-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">
            {course.courseName}
          </h1>
          <p className="text-gray-600 mt-2">Course ID: {course.courseId}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="rounded-lg p-5 bg-blue-50 border border-blue-200 shadow">
              <p className="text-sm font-medium text-blue-600 mb-1">Status</p>
              <p className="text-lg font-semibold text-blue-900">
                {course.status}
              </p>
            </div>

            <div className="rounded-lg p-5 bg-indigo-50 border border-indigo-200 shadow">
              <p className="text-sm font-medium text-indigo-600 mb-1">Start Date</p>
              <p className="text-lg font-semibold text-indigo-900">
                {new Date(course.startDate).toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-lg p-5 bg-indigo-50 border border-indigo-200 shadow">
              <p className="text-sm font-medium text-indigo-600 mb-1">End Date</p>
              <p className="text-lg font-semibold text-indigo-900">
                {new Date(course.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Lecturers Section */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <FaChalkboardTeacher /> Lecturers ({course.lecturers?.length ?? 0})
          </h2>
          {(course.lecturers?.length ?? 0) > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {course.lecturers.map((lecturer) => (
                <div
                  className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg shadow-sm"
                  key={lecturer.lecturerId}
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
      </div>
    </div>
  );
}
