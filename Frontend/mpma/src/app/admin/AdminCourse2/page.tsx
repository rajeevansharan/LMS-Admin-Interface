// app/admin/AdminCourse2/page.tsx
import { Metadata } from "next";
import AdminCourseView from "./AdminVCourse";

export const metadata: Metadata = {
  title: "Admin Course Management",
  description: "Manage courses, assign lecturers, and enroll students.",
};

export default function Page() {
  return <AdminCourseView />;
}