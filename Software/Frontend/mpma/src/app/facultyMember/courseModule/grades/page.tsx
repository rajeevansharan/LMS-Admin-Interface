"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "../../components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Activity } from "@/types/Activity";
import { CourseService } from "@/services/CourseService";
import Link from "next/link";

const GradesPage = () => {
  // --- HOOKS AND STATE ---
  // We get the courseId from the URL query parameter
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const { token } = useAuth();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (courseId && token) {
      const fetchActivities = async () => {
        setIsLoading(true);
        try {
          const data = await CourseService.getCourseActivities(courseId, token);
          setActivities(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching activities:", err);
          setError(
            err instanceof Error ? err.message : "An unknown error occurred.",
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchActivities();
    } else if (!courseId) {
      setError("Course ID is missing from the URL.");
      setIsLoading(false);
    }
  }, [courseId, token]);

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-primary border-2 border-borderColor p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Grades</h1>
            {courseId && (
              <Link
                href={`/facultyMember/courseModule/grades/view?id=${courseId}`}
                className="bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-opacity-90 transition-colors"
              >
                View Full Gradebook
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
              <p className="mt-2 text-foreground">Loading gradable items...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-foreground">
              <p>No gradable activities found for this course.</p>
            </div>
          ) : (
            // --- ACTIVITIES LIST ---
            <div className="space-y-4">
              {activities.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/facultyMember/courseModule/grades/${activity.id}?courseId=${courseId}&title=${encodeURIComponent(activity.title)}&type=${activity.type}`}
                  className="block"
                >
                  <div className="p-4 bg-tertiary rounded-lg shadow-sm hover:bg-quaternary hover:border-accent border border-transparent transition-all cursor-pointer">
                    <p className="font-semibold text-foreground">
                      {activity.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GradesPage;
