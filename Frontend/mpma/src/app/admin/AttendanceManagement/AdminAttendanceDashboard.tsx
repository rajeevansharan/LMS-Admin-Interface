"use client";

import React, { useState } from "react";
import Tabs from "./Tabs";
import CourseTab from "./CourseTab";
import StudentTab from "./StudentTab";

export default function AdminAttendanceDashboard() {
  const [activeTab, setActiveTab] = useState("course");

  const tabList = [
    "course",
    "student",
  ];

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Admin Attendance Management
        </h1>

        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body p-6">
            <Tabs tabs={tabList} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
              {activeTab === "course" && <CourseTab />}
              {activeTab === "student" && <StudentTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}