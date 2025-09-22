"use client";
import { useEffect, useState } from "react";
import ModuleListing from "../facultyMember/components/ModuleListing"; // Reusing the component
import { Course } from "@/types/Course";
import { useAuth } from "@/contexts/AuthContext";
import { StudentService } from "@/services/StudentService"; // You will need to create this service

// ! Student Dashboard - Main entry point for students after login
// ! Displays courses the student is enrolled in
const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!token || !user || user.role !== "STUDENT" || !user.id) {
        setError("You must be logged in as a student to view this page.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Assuming you will create a service to get courses for a student
        const courses = await StudentService.getEnrolledCourses(user.id, token);
        setEnrolledCourses(courses);
        setError(null);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Failed to load your courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [token, user]);

  return (
    <>
      <div className="text-center text-quaternary p-4">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to Your Student Dashboard
        </h1>
        <p className="mt-2 text-lg">Your enrolled courses</p>
      </div>

      <div className="flex flex-col gap-4 p-4 w-10/12 mx-auto">
        {loading ? (
          <div className="text-center p-8">Loading your courses...</div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">{error}</div>
        ) : enrolledCourses.length === 0 ? (
          <div className="text-center p-8">
            You are not enrolled in any courses yet.
          </div>
        ) : (
          enrolledCourses.map((course) => (
            <ModuleListing
              key={course.courseId}
              ModuleName={course.name}
              ModuleLink={`/student/course?id=${course.courseId}`} // Link to the student view of a course
            />
          ))
        )}
      </div>
    </>
  );
};

export default StudentDashboard;
