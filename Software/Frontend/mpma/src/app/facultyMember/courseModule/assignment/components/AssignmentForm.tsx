"use client";

import React from "react";
import { AssignmentCreatePayload } from "@/services/CourseService"; // We'll use this type

// Define the props our form will accept.
// It will take the form data and a function to handle state changes.
interface AssignmentFormProps {
  formData: Partial<AssignmentCreatePayload>;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onToggleVisibility: () => void;
  hideFileSettings?: boolean; // Optional prop to hide file upload settings section
}

export const AssignmentForm = ({
  formData,
  onFormChange,
  onToggleVisibility,
  hideFileSettings = false,
}: AssignmentFormProps) => {
  return (
    <div className="space-y-4">
      {/* --- Basic Information Section --- */}
      <h3 className="text-lg font-semibold text-foreground border-b border-borderColor pb-2">
        Assignment Details
      </h3>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={onFormChange}
          placeholder="e.g., Lab Report 1: Kinematics"
          className="input input-bordered w-full"
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description / Instructions</span>
        </label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={onFormChange}
          className="textarea textarea-bordered h-24"
          placeholder="Provide clear instructions for the assignment."
        ></textarea>
      </div>

      {/* --- Grading & Deadline Section --- */}
      <h3 className="text-lg font-semibold text-foreground border-b border-borderColor pb-2 mt-6">
        Grading & Deadline
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Due Date</span>
          </label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate || ""}
            onChange={onFormChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Max Marks</span>
          </label>
          <input
            type="number"
            name="maxMarks"
            value={formData.maxMarks || ""}
            onChange={onFormChange}
            placeholder="e.g., 100"
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Pass Mark</span>
          </label>
          <input
            type="number"
            name="passMark"
            value={formData.passMark || ""}
            onChange={onFormChange}
            placeholder="e.g., 50"
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Weight (% of final grade)</span>
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight || ""}
            onChange={onFormChange}
            placeholder="1.0 (default)"
            min="0.1"
            step="0.1"
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* --- Submission Settings Section --- */}
      {!hideFileSettings && (
        <>
          <h3 className="text-lg font-semibold text-foreground border-b border-borderColor pb-2 mt-6">
            Submission Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Allowed File Types</span>
              </label>
              <input
                type="text"
                name="allowedFileTypes"
                value={formData.allowedFileTypes || ""}
                onChange={onFormChange}
                placeholder="e.g., .pdf, .docx, .zip"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Max File Size (MB)</span>
              </label>
              <input
                type="number"
                name="maxFileSize"
                value={formData.maxFileSize || ""}
                onChange={onFormChange}
                placeholder="e.g., 10"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Max Number of Files</span>
              </label>
              <input
                type="number"
                name="maxFileCount"
                value={formData.maxFileCount || ""}
                onChange={onFormChange}
                placeholder="e.g., 1"
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </>
      )}

      {/* --- Visibility Toggle --- */}
      <div className="form-control mt-6">
        <label className="label cursor-pointer">
          <span className="label-text">Visible to Students</span>
          <input
            type="checkbox"
            checked={formData.visible || false}
            onChange={onToggleVisibility}
            className="toggle toggle-primary"
          />
        </label>
      </div>
    </div>
  );
};
