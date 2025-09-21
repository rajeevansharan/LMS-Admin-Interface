"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "../../components/Layout";
import { StudentParticipant } from "@/types/Student";
import { ParticipantsService } from "@/services/ParticipantsService";
import { useAuth } from "@/contexts/AuthContext";

const ParticipantsPage = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const { token, user } = useAuth();

  const [students, setStudents] = useState<StudentParticipant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<{
    courseId: string | null;
    hasToken: boolean;
    user: { role?: string } | null;
  }>({
    courseId: null,
    hasToken: false,
    user: null,
  });

  useEffect(() => {
    // Update debug information
    setDebug({
      courseId: courseId,
      hasToken: !!token,
      user: user,
    });

    const fetchParticipants = async () => {
      if (!courseId) {
        setError(
          "Missing course ID in URL. Please ensure you're accessing this page from a course module.",
        );
        setLoading(false);
        return;
      }

      if (!token) {
        // Try to recover by waiting a moment for token to be available
        setTimeout(async () => {
          if (token) {
            try {
              const participantsData =
                await ParticipantsService.getCourseParticipants(
                  courseId,
                  token,
                );
              setStudents(participantsData);
              setError(null);
            } catch (err) {
              console.error("Error in delayed fetch:", err);
              setError(
                "Authentication issue. Please try logging out and back in.",
              );
            } finally {
              setLoading(false);
            }
          } else {
            setError(
              "Authentication token not available. Please try logging out and back in.",
            );
            setLoading(false);
          }
        }, 1000);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching participants for course ID:", courseId);
        const participantsData =
          await ParticipantsService.getCourseParticipants(courseId, token);
        setStudents(participantsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching participants:", err);
        if (err instanceof Error) {
          setError(`Failed to load participants: ${err.message}`);
        } else {
          setError("Failed to load participants. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [courseId, token, user]);

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-primary border-2 border-borderColor p-4 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-foreground">
            Student Participants
          </h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
              <p className="mt-2 text-foreground">Loading participants...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>

              {/* Debug information - remove in production */}
              <div className="mt-4 text-xs border-t pt-2">
                <p>Debug Info:</p>
                <ul>
                  <li>Course ID: {debug.courseId || "Missing"}</li>
                  <li>Token available: {debug.hasToken ? "Yes" : "No"}</li>
                  <li>User authenticated: {debug.user ? "Yes" : "No"}</li>
                  {debug.user && <li>User role: {debug.user.role}</li>}
                </ul>
              </div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-foreground">
              <p>No participants found for this course.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-base-100 border border-borderColor">
                <thead>
                  <tr className="bg-base-200 text-foreground">
                    {[
                      "Name",
                      "Username",
                      "Email",
                      "Phone Number",
                      "Date of Birth",
                      "Address",
                      "Role",
                    ].map((header) => (
                      <th
                        key={header}
                        className="py-3 px-4 border-b border-borderColor text-left text-sm font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="bg-tertiary hover:bg-quaternary"
                    >
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        {student.username}
                      </td>
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        {student.email}
                      </td>
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        {student.phoneNumber}
                      </td>
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        {student.dateOfBirth}
                      </td>
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        {student.address}
                      </td>
                      <td className="py-3 px-4 border-b border-borderColor text-sm">
                        {student.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ParticipantsPage;
