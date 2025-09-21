import React, { useEffect, useState } from "react";
import axios from "axios";

interface StudentData {
  username: string;
  name: string;
  personId: string;
  email: string;
  department: string;
  batch: string;
}

interface StudentProfileSummaryProps {
  username: string;
}

export default function StudentProfileSummary({
  username,
}: StudentProfileSummaryProps) {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudentData() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<StudentData>(
          `http://localhost:8080/api/students/username/${username}`,
        );
        setStudentData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load student data.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchStudentData();
  }, [username]);

  if (loading) return <div className="skeleton w-full h-64"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!studentData)
    return <div className="alert alert-warning">No profile found.</div>;

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">Student Profile</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Name:</span>
            <span>{studentData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Username:</span>
            <span>{studentData.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Person ID:</span>
            <span>{studentData.personId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Department:</span>
            <span>{studentData.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Batch:</span>
            <span>{studentData.batch}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{studentData.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
