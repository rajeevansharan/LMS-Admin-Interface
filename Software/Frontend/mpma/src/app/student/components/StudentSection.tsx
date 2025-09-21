"use client";
import React from "react";
// Note: This component is being reused from the facultyMember section.
import SectionContent from "@/app/facultyMember/courseModule/components/SectionContent";

// Interface for a content item
interface SectionContentItem {
  id?: number;
  title: string;
  content: string;
  fileUrl?: string;
  startDate?: string;
  durationMinutes?: number;
  location?: string;
  lecturerName?: string;
}

// Props for the student-facing section
interface StudentSectionProps {
  SectionName: string;
  SectionContents: SectionContentItem[];
  courseId?: number; // The component now correctly accepts the courseId
  onContentAction: (action: "click", contentId?: number) => void;
}

const StudentSection: React.FC<StudentSectionProps> = ({
  SectionName,
  SectionContents = [],
  courseId, // Receive the courseId prop
  onContentAction,
}) => {
  // Don't render the section if there's no content to display
  if (SectionContents.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 collapse collapse-arrow bg-base-200">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title text-xl font-medium">{SectionName}</div>
      <div className="collapse-content bg-base-100">
        {SectionContents.map((content, index) => (
          <div
            key={content.id || index}
            onClick={() => {
              // This logic correctly identifies which sections are clickable
              if (SectionName === "Assignments" || SectionName === "Quizzes") {
                onContentAction("click", content.id);
              }
            }}
            className={`
              p-2 border-b border-base-300 last:border-b-0
              ${
                SectionName === "Assignments" || SectionName === "Quizzes"
                  ? "cursor-pointer hover:bg-base-200 transition-colors rounded-md"
                  : ""
              }
            `}
          >
            <SectionContent
              id={content.id}
              title={content.title}
              content={content.content}
              fileUrl={content.fileUrl}
              courseId={courseId} // Pass the courseId down to the SectionContent component
              startDate={content.startDate}
              durationMinutes={content.durationMinutes}
              location={content.location}
              lecturerName={content.lecturerName}
              isEditable={false} // Student view is not editable
              isDeletable={false} // Student view is not deletable
              onAction={() => {}} // No action needed from here in student view
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSection;
