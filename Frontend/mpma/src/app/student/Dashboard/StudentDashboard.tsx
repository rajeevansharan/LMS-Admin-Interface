"use client";
import React, { useState } from "react";
import StudentProfileSummary from "./StudentProfileSummary";
import AttendanceSummaryWidget from "./AttendanceSummaryWidget";
import AnalyticsTab from "./AnalyticsTab";

export default function StudentDashboard({ username, semesterId }: { username: string; semesterId: string | number }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="prose max-w-none mb-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
      </div>
      
      {!showDetails ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StudentProfileSummary username={username} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <AttendanceSummaryWidget
              username={username}
              semesterId={semesterId}
              onViewDetails={() => setShowDetails(true)}
            />
            {/* Add more dashboard widgets here */}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setShowDetails(false)}
            className="btn btn-sm btn-ghost"
          >
            ← Back to Dashboard
          </button>
          <AnalyticsTab username={username} semesterId={semesterId} />
        </div>
      )}
    </div>
  );
}