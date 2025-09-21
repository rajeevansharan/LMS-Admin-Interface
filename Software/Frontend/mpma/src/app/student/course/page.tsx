"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// --- Component Imports ---
import CustomButton from "@/app/facultyMember/components/CustomButton";
// CORRECTED: Import the new StudentSection component
import StudentSection from "@/app/student/components/StudentSection";

// --- Service Imports ---
import { CourseService } from "@/services/CourseService";
import { MaterialService } from "@/services/MaterialService";

// --- Type Imports ---
import { Course } from "@/types/Course";
import {
  QuizMaterial,
  AnnouncementMaterial,
  AssignmentMaterial,
} from "@/types/Material";

// Type definition for document materials fetched from the API
interface MaterialDocumentDTO {
  materialId: number;
  title: string;
  description: string;
  fileUrl: string;
  uploadDate: string;
  visible: boolean;
  creatorName: string;
}

// --- Context Imports ---
import { useAuth } from "@/contexts/AuthContext";

// Local interface for content items displayed in a section
interface SectionContentItem {
  title: string;
  content: string;
  fileUrl?: string; // For downloadable materials
  startDate?: string;
  durationMinutes?: number;
  location?: string;
  lecturerName?: string;
}

interface SectionData {
  name: string;
  contents: SectionContentItem[];
}

interface NavButton {
  label: string;
  url: string;
}

// =================================================================
// StudentCoursePage Component
// =================================================================
const StudentCoursePageComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const courseId = searchParams.get("id");

  // --- STATE MANAGEMENT ---
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !token) {
        setError("Course ID or authentication token is missing.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const courseData = await CourseService.getCourseById(
          Number(courseId),
          token,
        );
        setCourse(courseData);
      } catch (err) {
        console.error("Failed to load course data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId, token]);

  // --- UI UPDATE & DATA DERIVATION ---
  useEffect(() => {
    const setupSections = async () => {
      if (!course || !courseId || !token) return;

      // Filter materials to only show what is visible to students
      const visibleMaterials = course.materials.filter((m) => m.visible);

      const announcementMaterials = visibleMaterials.filter(
        (m): m is AnnouncementMaterial => m.type === "ANNOUNCEMENT",
      );
      const quizMaterials = visibleMaterials.filter(
        (m): m is QuizMaterial =>
          m.type === "ACTIVITY" &&
          "activityType" in m &&
          m.activityType === "QUIZ",
      );
      const assignmentMaterials = visibleMaterials.filter(
        (m): m is AssignmentMaterial =>
          m.type === "ACTIVITY" &&
          "activityType" in m &&
          m.activityType === "ASSIGNMENT",
      );

      // Fetch visible document materials with their download URLs
      let documentMaterialsContents: SectionContentItem[] = [];
      try {
        const allDocumentMaterials: MaterialDocumentDTO[] =
          await MaterialService.getMaterialsByCourse(Number(courseId), token);

        documentMaterialsContents = allDocumentMaterials
          .filter((d: MaterialDocumentDTO) => d.visible) // Only show visible documents
          .map((d: MaterialDocumentDTO) => ({
            id: d.materialId,
            title: d.title,
            content: `Uploaded on: ${new Date(
              d.uploadDate,
            ).toLocaleDateString()}`,
            fileUrl: d.fileUrl, // URL for downloading
          }));
      } catch (error) {
        console.error("Failed to fetch document materials:", error);
      }

      // Build all sections for the student view
      setSections([
        {
          name: "Announcements",
          contents: announcementMaterials.map((a) => ({
            id: a.materialId,
            title: a.title,
            content: a.description,
          })),
        },
        {
          name: "Lecture Schedule",
          contents: course.lectures.map((l) => ({
            id: l.lectureId,
            title: l.title,
            content: l.description,
            startDate: l.startDate,
            durationMinutes: l.durationMinutes,
            location: l.location,
            lecturerName: l.lecturerName,
          })),
        },
        {
          name: "Quizzes",
          contents: quizMaterials.map((q) => ({
            id: q.materialId,
            title: q.title,
            content: `Max Attempts: ${q.maxAttempts} • Marks: ${q.maxMarks}`,
          })),
        },
        {
          name: "Assignments",
          contents: assignmentMaterials.map((a) => ({
            id: a.materialId,
            title: a.title,
            content: `Due: ${
              a.endDate ? new Date(a.endDate).toLocaleString() : "Not set"
            } • Marks: ${a.maxMarks}`,
          })),
        },
        {
          name: "Course Materials",
          contents: documentMaterialsContents,
        },
      ]);
    };

    setupSections();
  }, [course, courseId, token]);

  // --- ACTION HANDLERS ---
  // Simplified for students. This handles clicks on assignments and quizzes.
  const handleContentClick = (sectionName: string, contentId?: number) => {
    if (!contentId) return;

    if (sectionName === "Assignments") {
      // TODO: Navigate to the student assignment submission page
      router.push(`/student/assignment/${contentId}?courseId=${courseId}`);
      console.log(`Navigate to assignment ${contentId}`);
    } else if (sectionName === "Quizzes") {
      // TODO: Navigate to the student quiz attempt page
      router.push(`/student/quiz/${contentId}?courseId=${courseId}`);
      console.log(`Navigate to quiz ${contentId}`);
    }
  };

  // --- RENDER LOGIC ---
  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error) return <div className="text-center p-12 text-red-500">{error}</div>;
  if (!course) return <div className="text-center p-12">Course not found.</div>;

  // Navigation buttons for students
  const getNavigationButtons = (id: string): NavButton[] => [
    { label: "Course Home", url: `/student/course?id=${id}` },
    { label: "Grades", url: `/student/grades?courseId=${id}` },
    { label: "Participants", url: `/student/participants?courseId=${id}` },
  ];

  return (
    <div>
      <div className="text-center mb-4 pt-4">
        <h1 className="text-3xl font-bold">{course.name}</h1>
        <p className="text-sm mt-1">{`Course starts on: ${new Date(course.startDate).toLocaleDateString()}`}</p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2 p-3 w-full mx-auto">
        <div className="w-11/12 mb-6">
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {getNavigationButtons(courseId!).map((button, index) => (
              <CustomButton
                key={index}
                label={button.label}
                width="w-48"
                url={button.url}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 w-10/12 mx-auto">
        {sections.map((section, index) => (
          <StudentSection
            key={index}
            SectionName={section.name}
            SectionContents={section.contents}
            // ===================== THIS IS THE ONLY CHANGE =====================
            // Pass the courseId from the page's state down to the component.
            courseId={Number(courseId)}
            // ===================================================================
            onContentAction={(action, contentId) => {
              if (action === 'click') {
                handleContentClick(section.name, contentId);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Wrapper component with Suspense for Next.js App Router
const StudentCoursePage = () => (
    <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }>
        <StudentCoursePageComponent />
    </Suspense>
);

export default StudentCoursePage;
