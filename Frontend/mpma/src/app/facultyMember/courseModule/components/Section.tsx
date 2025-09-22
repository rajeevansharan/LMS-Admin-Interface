import React, { useRef, useState } from "react";
import SectionContent from "./SectionContent";
import { SectionWrapper } from "./SectionWrapper";

// * Interface defining the structure of a content item within a section
interface SectionContentItem {
  id?: number;
  title: string;
  content: string;
  fileUrl?: string; // Prop for downloadable files
  startDate?: string;
  durationMinutes?: number;
  location?: string;
  lecturerName?: string;
  isEditable?: boolean; // Prop to show/hide Edit button
  isDeletable?: boolean;
  isHideable?: boolean;
  visible?: boolean;
}

// * Interface defining the props accepted by the Section component
interface SectionProps {
  SectionName: string;
  SectionContents: SectionContentItem[];
  newContent: string;
  courseId?: number; // Add courseId for download functionality
  isDeletable?: boolean;
  isHideable?: boolean;
  fileDrop?: boolean;
  onRemove?: () => void;
  onFileSelect?: (file: File | null) => void;
  onContentAction?: (action: string, contentId?: number) => void;
  onAddNew?: () => void;
}

const Section: React.FC<SectionProps> = ({
  SectionName,
  SectionContents = [],
  newContent,
  courseId,
  isDeletable,
  isHideable,
  fileDrop,
  onRemove,
  onFileSelect,
  onContentAction,
  onAddNew,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (onFileSelect) onFileSelect(selectedFile);
    // Reset the input value so the same file can be selected again
    if (e.target) e.target.value = "";
  };

  const handleContentAction = (action: string, contentId?: number) => {
    if (onContentAction) onContentAction(action, contentId);
  };

  const handleAddNewClick = () => {
    if (fileDrop && onFileSelect) {
      // For sections with file drop (like Course Materials), trigger file picker
      fileInputRef.current?.click();
    } else if (onAddNew) {
      // For other sections, use the regular onAddNew handler
      onAddNew();
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!fileDrop) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!fileDrop) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!fileDrop) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && onFileSelect) {
      onFileSelect(files[0]);
    }
  };

  return (
    <SectionWrapper
      sectionName={SectionName}
      isDeletable={isDeletable}
      isHideable={isHideable}
      onRemove={onRemove}
    >
      {SectionContents.map((content, index) => (
        <div key={content.id || index} className="p-2 flex">
          <div className="flex-1 text-foreground">
            {/* --- THE FIX IS HERE --- */}
            {/* We are now passing ALL props from the parent down to SectionContent */}
            <SectionContent
              id={content.id}
              title={content.title}
              content={content.content}
              fileUrl={content.fileUrl} // Pass fileUrl
              courseId={courseId} // Pass courseId for download functionality
              startDate={content.startDate}
              durationMinutes={content.durationMinutes}
              location={content.location}
              lecturerName={content.lecturerName}
              isEditable={content.isEditable} // Pass isEditable
              isDeletable={content.isDeletable}
              isHideable={content.isHideable}
              visible={content.visible}
              onAction={(action) => handleContentAction(action, content.id)}
            />
          </div>
        </div>
      ))}

      {/* Enhanced "Add New" section with file upload support */}
      <div
        className={`
          text-normal p-2 cursor-pointer rounded-md transition-colors duration-200
          ${
            fileDrop
              ? `border-2 border-dashed ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-borderColor/50 hover:border-primary/60"
                } hover:bg-quaternary`
              : "hover:bg-quaternary"
          }
        `}
        onClick={handleAddNewClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {fileDrop ? (
          <div className="text-center py-4">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {newContent}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {isDragOver
                    ? "Drop your file here"
                    : "Click to browse or drag & drop files here"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <SectionContent
            title={newContent}
            content={"Add New Content"}
            isDeletable={false}
          />
        )}
      </div>

      {/* Hidden file input */}
      {fileDrop && (
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.docx,.pptx,.txt,.zip,.jpg,.jpeg,.png"
        />
      )}
    </SectionWrapper>
  );
};

export default Section;
