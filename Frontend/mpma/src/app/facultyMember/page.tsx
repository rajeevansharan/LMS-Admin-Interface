"use client";
import { useEffect, useState } from "react";
import Layout from "@/app/facultyMember/components/Layout";
import ModuleListing from "./components/ModuleListing";
import { CourseService } from "@/services/CourseService";
import { Course } from "@/types/Course";
import { useAuth } from "@/contexts/AuthContext";

// ! Faculty Member Dashboard - Main entry point for lecturers after login
// ! Displays course listings based on user role and assignments
const FacultyMember = () => {
  // ? State management for courses data, loading state, and error handling
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  // * Fetches course data on component mount and when auth state changes
  // * Handles different data fetching strategies based on user role
  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      if (!user) {
        setError("User information not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let courseData: Course[] = [];

        // * Role-based course fetching strategy
        // * Lecturers only see their assigned courses, admins see all courses
        if (user.role === "LECTURER" && user.id) {
          console.log(`Fetching courses for lecturer ID: ${user.id}`);
          courseData = await CourseService.getCoursesByLecturerId(
            user.id,
            token,
          );
          console.log(
            `Successfully fetched ${courseData.length} courses for lecturer ID: ${user.id}`,
          );
        } else {
          // For administrators or other roles, fetch all courses
          console.log(`Fetching all courses for user role: ${user.role}`);
          courseData = await CourseService.getAllCourses(token);
          console.log(`Successfully fetched ${courseData.length} courses`);
        }

        setCourses(courseData);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        if (err instanceof Error) {
          setError(`Failed to load courses: ${err.message}`);
        } else {
          setError("Failed to load courses. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, user]);

  return (
    <Layout>
      {/* Header section with personalized welcome message */}
      <div className="text-center text-quaternary p-4">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to the Faculty Member Portal
        </h1>
        {user?.role === "LECTURER" && (
          <p className="mt-2 text-lg">Showing your assigned courses</p>
        )}
      </div>

      {/* Course listings with various state handling */}
      <div className="flex flex-col gap-4 p-4 w-10/12 mx-auto">
        {loading ? (
          // Loading state
          <div className="text-center p-8">Loading courses...</div>
        ) : error ? (
          // Error state with user feedback
          <div className="text-center p-8 text-red-500">{error}</div>
        ) : courses.length === 0 ? (
          // Empty state with contextual message
          <div className="text-center p-8">
            {user?.role === "LECTURER"
              ? "You are not assigned to any courses yet."
              : "No courses found in the system."}
          </div>
        ) : (
          // Course list rendering
          courses.map((course) => (
            <ModuleListing
              key={course.courseId}
              ModuleName={course.name}
              ModuleLink={`/facultyMember/courseModule?id=${course.courseId}`}
            />
          ))
        )}
      </div>
    </Layout>
  );
};

// ! Default export for Next.js page routing
// TODO: Consider adding statistics dashboard for faculty members
export default FacultyMember;
