"use client";
import React, { useState, useEffect } from "react";
import { Announcement, AnnouncementCreate } from "@/types/Announcement";

// * Interface defining props required by the AnnouncementForm
// * Controls the modal behavior and form submission handling
interface AnnouncementFormProps {
  isOpen: boolean; // Whether the form modal is visible
  onClose: () => void; // Handler for closing the form modal
  announcement?: Announcement | null; // Optional existing announcement for editing
  onSubmit: (data: AnnouncementCreate) => void; // Submission handler
}

// ! AnnouncementForm provides a modal form for creating/editing announcements
// ! Used in the course module interface for faculty members to manage announcements
const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  isOpen,
  onClose,
  announcement,
  onSubmit,
}) => {
  // ? Form state variables for user input and validation
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(true);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  // * Populates form fields when editing an existing announcement
  // * Resets form when creating a new announcement
  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title || "");
      setDescription(announcement.description || "");
      setVisible(announcement.visible);
    } else {
      // Reset form for new announcements
      setTitle("");
      setDescription("");
      setVisible(true);
    }
  }, [announcement]);

  // ? Validates form fields before submission
  // ? Returns true if all validations pass, false otherwise
  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ? Handles form submission with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        visible,
        courseId: announcement?.courseId || 0, // Will be replaced in the parent component
      });
    }
  };

  // * Early return if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* TODO: Add keyboard shortcuts for form submission (Ctrl+Enter) and escape to close */}
      <div className="bg-background p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          {announcement ? "Edit Announcement" : "Create New Announcement"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Title input field */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              className="input input-bordered w-full"
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1">{errors.title}</span>
            )}
          </div>

          {/* Description textarea */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter announcement description"
              className="textarea textarea-bordered w-full h-32"
            />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1">
                {errors.description}
              </span>
            )}
          </div>

          {/* Visibility toggle */}
          <div className="form-control mb-6">
            <label className="cursor-pointer label justify-start gap-2">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="checkbox checkbox-primary"
              />
              <span className="label-text">
                Make this announcement visible to students
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {announcement ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;
