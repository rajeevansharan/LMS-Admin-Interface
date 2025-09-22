"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  CourseService,
  AssignmentCreatePayload,
} from "@/services/CourseService";
import { AssignmentForm } from "../courseModule/assignment/components/AssignmentForm"; // Import the dumb form

// Define the props for our modal
interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentCreated: () => void; // A function to refresh the main page's list
}

const initialFormData: Partial<AssignmentCreatePayload> = {
  title: "",
  description: "",
  visible: true,
  maxMarks: 100,
  passMark: 50,
  weight: 1.0, // Default weight of 1.0 (100% if only one assignment)
  maxFileCount: 1,
  maxFileSize: 10,
  allowedFileTypes: ".pdf,.doc,.docx",
};

export const CreateAssignmentModal = ({
  isOpen,
  onClose,
  onAssignmentCreated,
}: CreateAssignmentModalProps) => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const { token } = useAuth();

  const [formData, setFormData] =
    useState<Partial<AssignmentCreatePayload>>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleToggleVisibility = () => {
    setFormData((prev) => ({ ...prev, visible: !prev.visible }));
  };

  const handleSubmit = async () => {
    if (!courseId || !token) {
      setError("Course ID or authentication token is missing.");
      return;
    }

    if (!formData.title || !formData.endDate || !formData.maxMarks) {
      setError("Title, Due Date, and Max Marks are required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await CourseService.createAssignment(
        courseId,
        formData as AssignmentCreatePayload,
        token,
      );
      onAssignmentCreated();
      handleClose(); // Close and reset form
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create assignment.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // A helper function to close and reset the form state
  const handleClose = () => {
    onClose();
    setFormData(initialFormData);
    setError(null);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl">
        <button
          onClick={handleClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="font-bold text-xl">Create New Assignment</h3>

        <div className="py-4">
          <AssignmentForm
            formData={formData}
            onFormChange={handleFormChange}
            onToggleVisibility={handleToggleVisibility}
          />
        </div>

        {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}

        <div className="modal-action">
          <button className="btn" onClick={handleClose} disabled={isSaving}>
            Cancel
          </button>
          <button
            className={`btn btn-primary ${isSaving ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Creating..." : "Create Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};
