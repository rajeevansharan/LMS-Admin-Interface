"use client";

import { useState } from "react";
import AddModifyCourse from "./AddModifyCourse";
import AssignLecturer from "./AssignLecturer";
import EnrollStudents from "./EnrollStudents";
import SemesterManagement from "./SemesterManagement";

type ActiveTab =
  | "addCourse"
  | "assignLecturer"
  | "enrollStudents"
  | "semesterManagement";

export default function AdminCourseManagement() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("addCourse");

  return (
    <section className="p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Course Management
        </h1>
        <p className="text-gray-600">
          Administrative panel for managing academic courses and semesters
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("addCourse")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "addCourse"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Course Details
            </button>
            <button
              onClick={() => setActiveTab("enrollStudents")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "enrollStudents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Student Enrollment
            </button>
            <button
              onClick={() => setActiveTab("semesterManagement")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "semesterManagement"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Semester Management
            </button>
          </nav>
        </div>

        <div className="p-8">
          {activeTab === "addCourse" && <AddModifyCourse />}
          {activeTab === "assignLecturer" && <AssignLecturer />}
          {activeTab === "enrollStudents" && <EnrollStudents />}
          {activeTab === "semesterManagement" && <SemesterManagement />}
        </div>
      </div>
    </section>
  );
}
