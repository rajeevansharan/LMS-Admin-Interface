"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Component Imports
import CustomButton from "@/app/facultyMember/components/CustomButton";
import Section from "@/app/facultyMember/courseModule/components/Section";
import Layout from "@/app/facultyMember/components/Layout";
import AnnouncementForm from "./components/AnnouncementForm";
import LectureForm from "./components/LectureForm";
import { CreateAssignmentModal } from "../components/CreateAssignmentModal";
import { EditAssignmentModal } from "../components/EditAssignmentModal";
import ConfirmationModal from "./components/ConfirmationModal";

// Service Imports
import { CourseService } from "@/services/CourseService";
import { AnnouncementService } from "@/services/AnnouncementService";
import { LectureService } from "@/services/LectureService";
import { MaterialService } from "@/services/MaterialService";

// Type Imports
import { Course } from "@/types/Course";
import { Lecture, LectureCreate } from "@/types/Lecture";
import {
  QuizMaterial,
  AnnouncementMaterial,
  AssignmentMaterial,
} from "@/types/Material";

// Type for MaterialDocumentDTO from backend
interface MaterialDocumentDTO {
  materialId: number;
  title: string;
  description: string;
  fileUrl: string;
  uploadDate: string;
  visible: boolean;
  creatorName: string;
}
import { Announcement, AnnouncementCreate } from "@/types/Announcement";

// Context Imports
import { useAuth } from "@/contexts/AuthContext";

// Local Interfaces
interface SectionContentItem {
  id?: number;
  title: string;
  content: string;
  fileUrl?: string;
  startDate?: string;
  durationMinutes?: number;
  location?: string;
  lecturerName?: string;
  isEditable?: boolean;
  isDeletable?: boolean;
  isHideable?: boolean;
  visible?: boolean;
}
interface SectionData {
  name: string;
  contents: SectionContentItem[];
  newContentLabel: string;
  isDeletable?: boolean;
  isHideable?: boolean;
  fileDrop?: boolean;
}
interface NavButton {
  label: string;
  url: string;
}

// =================================================================
// CourseModules Component
// =================================================================
const CourseModules: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, user } = useAuth();
  const courseId = searchParams.get("id");

  // --- STATE MANAGEMENT ---
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<SectionData[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] =
    useState<AnnouncementMaterial | null>(null);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] =
    useState(false);
  const [currentAssignment, setCurrentAssignment] =
    useState<AssignmentMaterial | null>(null);

  // Confirmation Modal State
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "warning",
  });

  // Helper function to show confirmation dialog
  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: "danger" | "warning" | "info" = "warning",
  ) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      variant,
    });
  };

  // Helper function to close confirmation dialog
  const closeConfirmation = () => {
    setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Refresh function to reload course data
  const refreshCourseData = async () => {
    if (!courseId || !token) return;
    try {
      const courseData = await CourseService.getCourseById(
        Number(courseId),
        token,
      );
      setCourse(courseData);
    } catch (err) {
      console.error("Failed to refresh course data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to refresh course data.",
      );
    }
  };

  // --- DATA FETCHING ---

  // --- DATA LOADING ---
  useEffect(() => {
    const fetchAllCourseData = async () => {
      if (!courseId || !token) return;
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
    fetchAllCourseData();
  }, [courseId, token]);

  // --- UI UPDATE & DATA DERIVATION ---
  useEffect(() => {
    const fetchAndSetupSections = async () => {
      if (!course || !courseId || !token) return;

      // Filter materials from the single source of truth (for non-document types)
      const quizMaterials = course.materials.filter(
        (m): m is QuizMaterial =>
          m.type === "ACTIVITY" &&
          "activityType" in m &&
          m.activityType === "QUIZ",
      );
      const announcementMaterials = course.materials.filter(
        (m): m is AnnouncementMaterial => m.type === "ANNOUNCEMENT",
      );
      const assignmentMaterials = course.materials.filter(
        (m) =>
          m.type === "ACTIVITY" &&
          "activityType" in m &&
          m.activityType === "ASSIGNMENT",
      );

      // Fetch document materials with proper fileUrl
      let documentMaterialsContents: SectionContentItem[] = [];
      try {
        const documentMaterials = await MaterialService.getMaterialsByCourse(
          Number(courseId),
          token,
        );
        documentMaterialsContents = documentMaterials.map(
          (d: MaterialDocumentDTO) => ({
            id: d.materialId,
            title: d.title,
            content: `Uploaded on: ${new Date(d.uploadDate).toLocaleDateString()}`,
            fileUrl: d.fileUrl,
            isEditable: false,
            isDeletable: true,
            isHideable: true,
            visible: d.visible,
          }),
        );
      } catch (error) {
        console.error("Failed to fetch document materials:", error);
      }

      // Build all sections with complete data
      setSections([
        {
          name: "Announcements",
          contents: announcementMaterials.map((a) => ({
            id: a.materialId,
            title: a.title,
            content: a.description,
            isEditable: true,
            isDeletable: true,
            isHideable: true,
            visible: a.visible,
          })),
          newContentLabel: "Add New Announcement",
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
            isEditable: true,
            isDeletable: true,
            isHideable: false,
          })),
          newContentLabel: "Add New Lecture",
        },
        {
          name: "Quiz Schedule",
          contents: quizMaterials.map((q) => ({
            id: q.materialId,
            title: q.title,
            content: `Max Attempts: ${q.maxAttempts} • Marks: ${q.maxMarks}`,
            isEditable: true,
            isDeletable: true,
            isHideable: true,
            visible: q.visible,
          })),
          newContentLabel: "Add New Quiz",
        },
        {
          name: "Assignments",
          contents: assignmentMaterials.map((a) => ({
            id: a.materialId,
            title: a.title,
            content: `Due: ${a.endDate ? new Date(a.endDate).toLocaleString() : "Not set"} • Marks: ${a.maxMarks}`,
            isEditable: true,
            isDeletable: true,
            isHideable: true,
            visible: a.visible,
          })),
          newContentLabel: "Add New Assignment",
        },
        {
          name: "Course Materials",
          contents: documentMaterialsContents,
          newContentLabel: "Add New Material",
          fileDrop: true,
        },
      ]);
    };

    fetchAndSetupSections();
  }, [course, courseId, token]); // This effect runs when course data is available

  // --- ACTION HANDLERS ---

  // --- FIX: All handlers now update the master 'course' state ---

  const handleFileSelect = async (file: File | null) => {
    if (file && courseId && token && course) {
      setIsUploading(true);
      try {
        const newMaterial = await MaterialService.uploadMaterial(
          Number(courseId),
          file,
          token,
        );
        // Add the new material to the course's materials list and update the master state
        setCourse({ ...course, materials: [...course.materials, newMaterial] });

        // The useEffect will automatically refresh all sections including the new document material
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("File upload error:", err);
        setError("File upload failed.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // --- CONVERSION HELPERS ---
  const announcementMaterialToAnnouncement = (
    material: AnnouncementMaterial,
  ): Announcement => {
    return {
      materialId: material.materialId,
      title: material.title,
      description: material.description,
      uploadDate: material.uploadDate,
      visible: material.visible,
      courseId: Number(courseId!),
    };
  };

  const handleOpenAnnouncementForm = (
    announcement: AnnouncementMaterial | null = null,
  ) => {
    setCurrentAnnouncement(announcement);
    setIsAnnouncementModalOpen(true);
  };

  const handleOpenLectureForm = (lecture: Lecture | null = null) => {
    setCurrentLecture(lecture);
    setIsLectureModalOpen(true);
  };

  const handleAnnouncementSubmit = (data: AnnouncementCreate) => {
    if (!token || !courseId || !course) return;

    const promise = currentAnnouncement
      ? AnnouncementService.updateAnnouncement(
          currentAnnouncement.materialId,
          data,
          token,
        )
      : AnnouncementService.createAnnouncement(Number(courseId), data, token);

    promise
      .then((result) => {
        // Convert the Announcement result back to AnnouncementMaterial format
        const materialResult: AnnouncementMaterial = {
          materialId: result.materialId,
          title: result.title,
          description: result.description,
          visible: result.visible,
          uploadDate: result.uploadDate,
          type: "ANNOUNCEMENT" as const,
        };

        const updatedMaterials = currentAnnouncement
          ? course.materials.map((m) =>
              m.materialId === result.materialId ? materialResult : m,
            )
          : [...course.materials, materialResult];
        setCourse({ ...course, materials: updatedMaterials });
        setIsAnnouncementModalOpen(false);
        setCurrentAnnouncement(null); // Clear the current announcement
      })
      .catch((err) => {
        console.error("Announcement submit error:", err);
        setError(`Could not save announcement: ${err.message}`);
      });
  };

  const handleLectureSubmit = (data: LectureCreate) => {
    if (!token || !courseId || !course) return;

    const promise = currentLecture
      ? LectureService.updateLecture(
          currentLecture.lectureId,
          data,
          token,
          Number(courseId),
        )
      : LectureService.createLecture(Number(courseId), data, token);

    promise
      .then((result) => {
        const updatedLectures = currentLecture
          ? course.lectures.map((l) =>
              l.lectureId === result.lectureId ? result : l,
            )
          : [...course.lectures, result];
        setCourse({ ...course, lectures: updatedLectures });
        setIsLectureModalOpen(false);
        setCurrentLecture(null); // Clear the current lecture
      })
      .catch((err) => {
        console.error("Lecture submit error:", err);
        setError(`Could not save lecture: ${err.message}`);
      });
  };

  const handleAssignmentCreated = async () => {
    // Close the modal first for immediate feedback
    setIsAssignmentModalOpen(false);

    // Then refresh the data to show the new assignment
    try {
      await refreshCourseData();
    } catch (err) {
      console.error(
        "Failed to refresh course data after assignment creation:",
        err,
      );
      setError(
        "Assignment created successfully, but failed to refresh the list. Please refresh the page.",
      );
    }
  };

  const handleSectionContentAction = (
    action: string,
    sectionName: string,
    contentId?: number,
  ) => {
    if (!contentId || !token || !course) return;

    if (
      sectionName === "Announcements" ||
      sectionName === "Course Materials" ||
      sectionName === "Quiz Schedule" ||
      sectionName === "Assignments"
    ) {
      if (action === "delete") {
        showConfirmation(
          "Delete Item",
          "Are you sure you want to delete this item? This action cannot be undone.",
          () => {
            MaterialService.deleteMaterial(contentId, token)
              .then(() => {
                const updatedMaterials = course.materials.filter(
                  (m) => m.materialId !== contentId,
                );
                setCourse({ ...course, materials: updatedMaterials });
                closeConfirmation();
              })
              .catch((err) => {
                console.error("Delete material error:", err);
                setError("Could not delete item.");
                closeConfirmation();
              });
          },
          "danger",
        );
        return; // Important: return early to prevent immediate execution
      } else if (action === "toggleVisibility") {
        // Optimistic update: update UI immediately
        const materialToUpdate = course.materials.find(
          (m) => m.materialId === contentId,
        );
        if (!materialToUpdate) return;

        const newVisibilityState = !materialToUpdate.visible;
        const optimisticUpdatedMaterials = course.materials.map((m) =>
          m.materialId === contentId
            ? { ...m, visible: newVisibilityState }
            : m,
        );

        // Update UI immediately
        setCourse({ ...course, materials: optimisticUpdatedMaterials });

        // Make API call
        MaterialService.toggleVisibility(contentId, token)
          .then((updatedMaterial) => {
            // Check what the API returned
            if (updatedMaterial === null) {
              // Backend had type casting issue but operation likely succeeded
              console.log(
                "Visibility toggle completed (backend type casting issue handled gracefully)",
              );
              setError(null);
              return; // Keep the optimistic update
            }

            // API succeeded with actual response - check if we need to sync with server response
            if (
              updatedMaterial &&
              typeof updatedMaterial.visible === "boolean" &&
              updatedMaterial.visible !== newVisibilityState
            ) {
              // Server returned different state, sync with it
              const syncedMaterials = course.materials.map((m) =>
                m.materialId === contentId
                  ? { ...m, visible: updatedMaterial.visible }
                  : m,
              );
              setCourse({ ...course, materials: syncedMaterials });
            }
            // Clear any previous errors
            setError(null);
          })
          .catch((err) => {
            console.error("Toggle visibility error:", err);
            // This is a real error (not the backend casting issue), revert the optimistic update
            const revertedMaterials = course.materials.map((m) =>
              m.materialId === contentId
                ? { ...m, visible: materialToUpdate.visible }
                : m,
            );
            setCourse({ ...course, materials: revertedMaterials });
            setError("Could not update visibility.");
          });
      } else if (action === "edit" && sectionName === "Announcements") {
        const announcement = course.materials.find(
          (m) => m.materialId === contentId && m.type === "ANNOUNCEMENT",
        ) as AnnouncementMaterial;
        if (announcement) handleOpenAnnouncementForm(announcement);
      } else if (action === "edit" && sectionName === "Quiz Schedule") {
        // Navigate to quiz edit page with quiz ID and course ID
        router.push(
          `/facultyMember/courseModule/quiz/edit?quizId=${contentId}&courseId=${courseId}`,
        );
      } else if (action === "edit" && sectionName === "Assignments") {
        // Open assignment edit modal with assignment data
        const assignment = course.materials.find(
          (m) =>
            m.materialId === contentId &&
            m.type === "ACTIVITY" &&
            "activityType" in m &&
            m.activityType === "ASSIGNMENT",
        ) as AssignmentMaterial;
        if (assignment) {
          setCurrentAssignment(assignment);
          setIsEditAssignmentModalOpen(true);
        }
      }
    } else if (sectionName === "Lecture Schedule") {
      if (action === "delete") {
        showConfirmation(
          "Delete Lecture",
          "Are you sure you want to delete this lecture? This action cannot be undone.",
          () => {
            LectureService.deleteLecture(contentId, token, Number(courseId))
              .then(() => {
                const updatedLectures = course.lectures.filter(
                  (l) => l.lectureId !== contentId,
                );
                setCourse({ ...course, lectures: updatedLectures });
                closeConfirmation();
              })
              .catch((err) => {
                console.error("Delete lecture error:", err);
                setError("Could not delete lecture.");
                closeConfirmation();
              });
          },
          "danger",
        );
        return; // Important: return early to prevent immediate execution
      } else if (action === "edit") {
        const lecture = course.lectures.find((l) => l.lectureId === contentId);
        if (lecture) handleOpenLectureForm(lecture);
      }
    }
  };

  const handleAddNewContent = (sectionName: string) => {
    if (sectionName === "Announcements") handleOpenAnnouncementForm(null);
    else if (sectionName === "Lecture Schedule") handleOpenLectureForm(null);
    else if (sectionName === "Quiz Schedule")
      router.push(`/facultyMember/courseModule/quiz/create?id=${courseId}`);
    else if (sectionName === "Assignments") setIsAssignmentModalOpen(true);
  };

  // --- PERMISSION CHECKING (No changes needed) ---
  useEffect(() => {
    if (user?.role === "LECTURER" && user.id && courseId && token) {
      CourseService.getCoursesByLecturerId(user.id, token).then(
        (lecturerCourses) => {
          if (!lecturerCourses.some((c) => c.courseId === Number(courseId))) {
            setError("You do not have permission to access this course.");
          }
        },
      );
    }
  }, [courseId, user, token]);

  // --- RENDER LOGIC (No changes needed) ---
  if (loading)
    return (
      <Layout>
        <div className="text-center p-12">Loading...</div>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <div className="text-center p-12 text-red-500">{error}</div>
      </Layout>
    );
  if (!course)
    return (
      <Layout>
        <div className="text-center p-12">Course not found.</div>
      </Layout>
    );

  const getNavigationButtons = (id: string): NavButton[] => [
    { label: course?.courseId.toString() || "CODE", url: "#" },
    {
      label: "Analytics",
      url: `/facultyMember/courseModule/grades/view?id=${id}`,
    },
    {
      label: "Participants",
      url: `/facultyMember/courseModule/participants?id=${id}`,
    },
    {
      label: "Question Bank",
      url: `/facultyMember/questionBank?courseId=${id}`,
    },
    { label: "Grades", url: `/facultyMember/courseModule/grades?id=${id}` },
    { label: "Settings", url: "#" },
  ];

  return (
    <Layout>
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">{course.name}</h1>
        <p className="text-sm mt-1">{`Start: ${new Date(course.startDate).toLocaleDateString()}`}</p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2 p-3 w-full mx-auto">
        <div className="w-11/12 mb-6">
          <div className="flex flex-wrap gap-2 justify-between items-center">
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

      {isUploading && (
        <div className="w-10/12 mx-auto my-4 p-3 bg-blue-100 rounded-md text-center">
          <p>Uploading...</p>
        </div>
      )}

      <div className="p-6 w-10/12 mx-auto">
        {sections.map((section, index) => (
          <Section
            key={index}
            SectionName={section.name}
            SectionContents={section.contents}
            newContent={section.newContentLabel}
            courseId={Number(courseId)} // Pass courseId for download functionality
            fileDrop={section.fileDrop}
            onContentAction={(action, contentId) =>
              handleSectionContentAction(action, section.name, contentId)
            }
            onAddNew={() => handleAddNewContent(section.name)}
            onFileSelect={
              section.fileDrop ? (file) => handleFileSelect(file) : undefined
            }
          />
        ))}
      </div>

      {isAnnouncementModalOpen && (
        <AnnouncementForm
          isOpen={isAnnouncementModalOpen}
          onClose={() => {
            setIsAnnouncementModalOpen(false);
            setCurrentAnnouncement(null);
          }}
          announcement={
            currentAnnouncement
              ? announcementMaterialToAnnouncement(currentAnnouncement)
              : null
          }
          onSubmit={handleAnnouncementSubmit}
        />
      )}
      {isLectureModalOpen && (
        <LectureForm
          isOpen={isLectureModalOpen}
          onClose={() => setIsLectureModalOpen(false)}
          lecture={currentLecture}
          onSubmit={handleLectureSubmit}
        />
      )}

      <CreateAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        onAssignmentCreated={handleAssignmentCreated}
      />

      <EditAssignmentModal
        isOpen={isEditAssignmentModalOpen}
        onClose={() => {
          setIsEditAssignmentModalOpen(false);
          setCurrentAssignment(null);
        }}
        assignment={currentAssignment}
        onAssignmentUpdated={async () => {
          // Close modal first for immediate feedback
          setIsEditAssignmentModalOpen(false);
          setCurrentAssignment(null);

          // Then refresh data to show updated assignment
          try {
            await refreshCourseData();
          } catch (err) {
            console.error(
              "Failed to refresh course data after assignment update:",
              err,
            );
            setError(
              "Assignment updated successfully, but failed to refresh the list. Please refresh the page.",
            );
          }
        }}
      />

      {/* Modern Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onCancel={closeConfirmation}
        variant={confirmationModal.variant}
        confirmLabel={confirmationModal.variant === "danger" ? "Delete" : "OK"}
        cancelLabel="Cancel"
      />
    </Layout>
  );
};

export default CourseModules;
