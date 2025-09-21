"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  CourseService,
  AssignmentCreatePayload,
} from "@/services/CourseService";
import { AssignmentMaterial } from "@/types/Material";
import { AssignmentForm } from "../courseModule/assignment/components/AssignmentForm";

// Define the props for our modal
interface EditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentUpdated: () => void; // A function to refresh the main page's list
  assignment: AssignmentMaterial | null; // The assignment to edit
}

export const EditAssignmentModal = ({
  isOpen,
  onClose,
  onAssignmentUpdated,
  assignment,
}: EditAssignmentModalProps) => {
  const { token } = useAuth();

  const [formData, setFormData] = useState<Partial<AssignmentCreatePayload>>(
    {},
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileSettingsChanged, setFileSettingsChanged] = useState(false);
  const [originalFileSettings, setOriginalFileSettings] = useState({
    allowedFileTypes: "",
    maxFileSize: 0,
    maxFileCount: 0,
  });

  // Populate form data when assignment changes
  useEffect(() => {
    if (assignment) {
      const originalSettings = {
        allowedFileTypes: assignment.allowedFileTypes || ".pdf,.docx,.txt",
        maxFileSize: assignment.maxFileSize || 10,
        maxFileCount: assignment.maxFileCount || 1,
      };

      setOriginalFileSettings(originalSettings);
      setFileSettingsChanged(false);

      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        visible: assignment.visible !== false, // Default to true if undefined
        endDate: assignment.endDate
          ? new Date(assignment.endDate).toISOString().slice(0, 16)
          : "",
        maxMarks: assignment.maxMarks || 100,
        passMark: assignment.passMark || 50,
        weight: assignment.weight || 1.0,
        instruction: assignment.instruction || "",
        allowedFileTypes: originalSettings.allowedFileTypes,
        maxFileSize: originalSettings.maxFileSize,
        maxFileCount: originalSettings.maxFileCount,
      });
    }
  }, [assignment]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;

    // Check if file settings are being changed
    if (
      name === "allowedFileTypes" ||
      name === "maxFileSize" ||
      name === "maxFileCount"
    ) {
      // Check if any file setting has changed from original
      setFormData((prev) => {
        const updated = { ...prev, [name]: finalValue };
        const hasChanged =
          updated.allowedFileTypes !== originalFileSettings.allowedFileTypes ||
          updated.maxFileSize !== originalFileSettings.maxFileSize ||
          updated.maxFileCount !== originalFileSettings.maxFileCount;
        setFileSettingsChanged(hasChanged);
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleToggleVisibility = () => {
    setFormData((prev) => ({ ...prev, visible: !prev.visible }));
  };

  const handleSubmit = async () => {
    if (!assignment || !token) {
      setError("Assignment data or authentication token is missing.");
      return;
    }

    if (!formData.title || !formData.endDate || !formData.maxMarks) {
      setError("Title, Due Date, and Max Marks are required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await CourseService.updateAssignment(
        assignment.materialId.toString(),
        formData as AssignmentCreatePayload,
        token,
      );
      onAssignmentUpdated();
      handleClose(); // Close and reset form
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update assignment.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // A helper function to close and reset the form state
  const handleClose = () => {
    onClose();
    setFormData({});
    setError(null);
    setFileSettingsChanged(false);
  };

  if (!isOpen || !assignment) {
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
        <h3 className="font-bold text-xl">Edit Assignment</h3>

        <div className="py-4">
          <AssignmentForm
            formData={formData}
            onFormChange={handleFormChange}
            onToggleVisibility={handleToggleVisibility}
            hideFileSettings={true}
          />

          {/* File Upload Settings - Now Editable with Warning */}
          <div className="mt-6 p-4 bg-base-200 rounded-lg">
            <h4 className="font-semibold mb-2">File Upload Settings</h4>

            {fileSettingsChanged && (
              <div className="mb-4 p-3 bg-warning/20 border border-warning rounded-lg">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-warning mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-warning text-sm">
                      File Settings Changed
                    </p>
                    <p className="text-xs text-base-content/70 mt-1">
                      Changing file upload settings may affect students who have
                      already started working on this assignment. Consider the
                      impact on existing submissions before saving.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  Allowed File Types
                </label>
                <input
                  type="text"
                  name="allowedFileTypes"
                  value={formData.allowedFileTypes || ""}
                  onChange={handleFormChange}
                  placeholder=".pdf,.docx,.txt"
                  className="input input-bordered w-full text-sm"
                />
                <p className="text-xs text-base-content/50 mt-1">
                  Comma-separated file extensions
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  name="maxFileSize"
                  value={formData.maxFileSize || ""}
                  onChange={handleFormChange}
                  min="1"
                  max="100"
                  placeholder="10"
                  className="input input-bordered w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  Max Files Count
                </label>
                <input
                  type="number"
                  name="maxFileCount"
                  value={formData.maxFileCount || ""}
                  onChange={handleFormChange}
                  min="1"
                  max="10"
                  placeholder="1"
                  className="input input-bordered w-full text-sm"
                />
              </div>
            </div>
          </div>
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
            {isSaving ? "Updating..." : "Update Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};
