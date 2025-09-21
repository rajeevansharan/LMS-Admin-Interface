import React from "react";
import { FaSpinner } from "react-icons/fa";

interface EventModalProps {
  showModal: boolean;
  newEvent: {
    title: string;
    description: string;
    createdBy: string;
    type: string;
    semesterId: string;
    batch: string;
    courseId: string;
  };
  selectedDate: Date;
  editEventId: number | null;
  error: string;
  isLoading: boolean;
  onClose: () => void;
  onEventTypeChange: (type: string) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onCreatedByChange: (createdBy: string) => void;
  onSemesterIdChange: (semesterId: string) => void;
  onBatchChange: (batch: string) => void;
  onCourseIdChange: (courseId: string) => void;
  onDateChange: (date: string) => void;
  onSubmit: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  showModal,
  newEvent,
  selectedDate,
  editEventId,
  error,
  isLoading,
  onClose,
  onEventTypeChange,
  onTitleChange,
  onDescriptionChange,
  onCreatedByChange,
  onSemesterIdChange,
  onBatchChange,
  onCourseIdChange,
  onDateChange,
  onSubmit,
}) => {
  if (!showModal) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {editEventId ? "Edit Event" : "Add New Event"}
        </h3>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {!editEventId && (
          <div className="form-control mb-3">
            <label className="label">Event Type</label>
            <select
              className="select select-bordered"
              value={newEvent.type}
              onChange={(e) => onEventTypeChange(e.target.value)}
            >
              <option value="course">Course Event</option>
              <option value="batch">Batch Event</option>
            </select>
          </div>
        )}

        <div className="form-control mb-3">
          <label className="label">Title</label>
          <input
            type="text"
            className="input input-bordered"
            value={newEvent.title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>

        <div className="form-control mb-3">
          <label className="label">Description</label>
          <textarea
            className="textarea textarea-bordered"
            value={newEvent.description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          ></textarea>
        </div>

        <div className="form-control mb-3">
          <label className="label">Created By</label>
          <input
            type="text"
            className="input input-bordered"
            value={newEvent.createdBy}
            onChange={(e) => onCreatedByChange(e.target.value)}
          />
        </div>

        {newEvent.type === "course" && (
          <>
            <div className="form-control mb-3">
              <label className="label">Semester ID</label>
              <input
                type="text"
                className="input input-bordered"
                value={newEvent.semesterId}
                onChange={(e) => onSemesterIdChange(e.target.value)}
              />
            </div>
            <div className="form-control mb-3">
              <label className="label">Course ID</label>
              <input
                type="text"
                className="input input-bordered"
                value={newEvent.courseId}
                onChange={(e) => onCourseIdChange(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="form-control mb-3">
          <label className="label">Batch</label>
          <input
            type="text"
            className="input input-bordered"
            value={newEvent.batch}
            onChange={(e) => onBatchChange(e.target.value)}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">Event Date</label>
          <input
            type="date"
            className="input input-bordered"
            value={selectedDate.toISOString().slice(0, 10)}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        <div className="modal-action">
          <button className="btn btn-primary" onClick={onSubmit}>
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : editEventId ? (
              "Update Event"
            ) : (
              "Add Event"
            )}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default EventModal;
