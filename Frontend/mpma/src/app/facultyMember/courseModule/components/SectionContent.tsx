import React from "react";
import axios from "axios"; // 1. IMPORT: Import axios directly
import { ContentHeaderWrapper } from "./ContentHeaderWrapper";

// * Interface defining props for the SectionContent component
interface SectionContentProps {
  id?: number;
  title: string;
  content: string;
  fileUrl?: string; // For downloadable materials
  courseId?: number; // Add courseId for download URL construction

  // Lecture specific fields
  startDate?: string;
  durationMinutes?: number;
  location?: string;
  lecturerName?: string;

  // --- MODIFIED: More explicit control over buttons ---
  isEditable?: boolean;
  isDeletable?: boolean;
  isHideable?: boolean;
  visible?: boolean;

  onAction?: (action: string) => void;
}

// ! SectionContent renders individual content items.
const SectionContent: React.FC<SectionContentProps> = ({
  title,
  content,
  fileUrl,
  courseId,
  startDate,
  durationMinutes,
  location,
  lecturerName,
  isEditable = false,
  isDeletable = false,
  isHideable = false,
  visible = true,
  onAction,
}) => {
  // Debug logging for fileUrl
  console.log(
    "SectionContent render - title:",
    title,
    "fileUrl:",
    fileUrl,
    "courseId:",
    courseId,
  );
  console.log(
    "SectionContent render - fileUrl type:",
    typeof fileUrl,
    "fileUrl truthy:",
    !!fileUrl,
  );
  // ? Event handlers for actions
  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    if (onAction) onAction(action);
  };

  // * Helper to format date strings
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // 2. MODIFIED FUNCTION: Handles the authenticated file download process directly
  const handleDownload = async (fileUrl: string, originalTitle: string) => {
    // === IMPORTANT: FIND YOUR TOKEN KEY ===
    // Check your browser's Local Storage (F12 -> Application -> Local Storage)
    // and replace 'token' with the correct key (e.g., 'jwt', 'userToken', etc.)
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }

    if (!courseId) {
      alert("Course ID not available for download.");
      return;
    }

    try {
      // Construct the proper download URL with courseId and fileName
      // The backend expects: /api/materials/download/{courseId}/{fileName}
      // The fileUrl contains the path like "1/abc-123.pdf" where the filename is the part after the last "/"
      const fileName = fileUrl.split("/").pop() || "download";

      // Make the API call using axios, manually adding the Authorization header
      const response = await axios.get(
        `${API_URL}/api/materials/download/${courseId}/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request
          },
          responseType: "blob", // This is critical - it tells axios to expect a file
        },
      );

      // Create a URL for the blob object from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", originalTitle);
      document.body.appendChild(link);

      // Programmatically click the link
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert(
        "Failed to download the file. Please check your connection or permissions.",
      );
    }
  };

  // 3. UPDATE JSX: Changed the link to be a button that calls handleDownload
  const titleElement = fileUrl ? (
    <a
      className="link link-hover text-info font-bold"
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        handleDownload(fileUrl, title);
      }}
      title={`Download ${title}`}
    >
      {title}
    </a>
  ) : (
    title
  );

  return (
    <ContentHeaderWrapper title={titleElement} content={content}>
      {/* Display Lecture Details */}
      {startDate && (
        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
          <p>
            <strong>Starts:</strong> {formatDateTime(startDate)}
          </p>
          {durationMinutes && (
            <p>
              <strong>Duration:</strong> {durationMinutes} minutes
            </p>
          )}
          {location && (
            <p>
              <strong>Location:</strong> {location}
            </p>
          )}
          {lecturerName && (
            <p>
              <strong>Lecturer:</strong> {lecturerName}
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {isHideable && (
          <button
            className={`btn btn-xs ${visible ? "btn-warning" : "btn-success"}`}
            onClick={(e) => handleAction(e, "toggleVisibility")}
            title={visible ? "Hide content" : "Show content"}
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
        {isEditable && (
          <button
            className="btn btn-xs btn-info"
            onClick={(e) => handleAction(e, "edit")}
            title="Edit content"
          >
            Edit
          </button>
        )}
        {isDeletable && (
          <button
            className="btn btn-xs btn-error"
            onClick={(e) => handleAction(e, "delete")}
            title="Delete content"
          >
            Delete
          </button>
        )}
      </div>
    </ContentHeaderWrapper>
  );
};

export default SectionContent;
