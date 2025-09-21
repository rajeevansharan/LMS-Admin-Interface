import React, { useState, useEffect, useRef } from "react";
import { Lecture, LectureCreate } from "@/types/Lecture";

// * Interface defining the props for the LectureForm component
// * Controls how the lecture form behaves and integrates with parent components
interface LectureFormProps {
  isOpen: boolean; // Controls visibility of the modal dialog
  onClose: () => void; // Handler for closing the form modal
  onSubmit: (data: LectureCreate) => void; // Handler for form submission
  lecture: Lecture | null; // Existing lecture data for editing mode
}

// ! LectureForm provides a modal interface for creating and editing lectures
// ! Allows faculty members to manage lecture resources within courses
const LectureForm: React.FC<LectureFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lecture,
}) => {
  // ? State variables to track form field values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(""); // Store as YYYY-MM-DDTHH:mm
  const [durationMinutes, setDurationMinutes] = useState<number | string>("");
  const [location, setLocation] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  // * Controls the opening/closing of the dialog based on isOpen prop
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  // * Populates form fields when editing an existing lecture
  // * Resets form fields when creating a new lecture
  useEffect(() => {
    if (isOpen) {
      if (lecture) {
        setTitle(lecture.title);
        setDescription(lecture.description);
        // Format date from ISO string to datetime-local input format
        setStartDate(
          lecture.startDate ? lecture.startDate.substring(0, 16) : "",
        );
        setDurationMinutes(lecture.durationMinutes || "");
        setLocation(lecture.location);
      } else {
        // Reset form for new lecture
        setTitle("");
        setDescription("");
        setStartDate("");
        setDurationMinutes("");
        setLocation("");
      }
    }
  }, [lecture, isOpen]);

  // ? Processes form submission and prepares data for the parent component
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lectureData: LectureCreate = {
      title,
      description,
      startDate: startDate ? new Date(startDate).toISOString() : "", // Convert back to ISO string
      durationMinutes: Number(durationMinutes),
      location,
    };
    onSubmit(lectureData);
    // TODO: Consider adding validation for date format and reasonable duration values
    // Keep the dialog open until the parent explicitly closes it via isOpen prop
    // onClose(); // Let parent handle closing
  };

  // ? Handles dialog closure via backdrop or Escape key
  const handleDialogClose = () => {
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={handleDialogClose}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {lecture ? "Edit Lecture" : "Add New Lecture"}
        </h3>
        <form onSubmit={handleFormSubmit}>
          {/* Title input field */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              placeholder="Lecture Title"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description textarea */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Lecture Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Start date and time picker */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Start Date & Time</span>
            </label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          {/* Duration input */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Duration (minutes)</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 60"
              className="input input-bordered w-full"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              required
              min="1"
            />
          </div>

          {/* Location input */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Lecture Hall A"
              className="input input-bordered w-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Action buttons */}
          <div className="modal-action mt-6">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {lecture ? "Save Changes" : "Create Lecture"}
            </button>
          </div>
        </form>
      </div>
      {/* Backdrop click handler for closing the dialog */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default LectureForm;
