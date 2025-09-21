import React from "react";
import { Event } from "./types/event";
import {
  FaCalendarAlt,
  FaUser,
  FaInfoCircle,
  FaClipboard,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";

interface Props {
  event: Event;
  onEditClick: (event: Event) => void;
  onDeleteClick: (id: number) => void;
  onClose?: () => void;
}

const EventDetailView: React.FC<Props> = ({
  event,
  onEditClick,
  onDeleteClick,
  onClose,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <FaClipboard /> Event Details
        </h2>
        {onClose && (
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            Close
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div>
          <h3 className="font-semibold">Title</h3>
          <p>{event.title}</p>
        </div>
        <div>
          <h3 className="font-semibold">Date</h3>
          <p className="flex items-center gap-2">
            <FaCalendarAlt /> {new Date(event.date).toDateString()}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Created By</h3>
          <p className="flex items-center gap-2">
            <FaUser /> {event.createdBy}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Event Type</h3>
          <p>
            {event.eventType === "COURSE_EVENT"
              ? "Course Event"
              : "Batch Event"}
          </p>
        </div>
        {event.description && (
          <div className="md:col-span-2">
            <h3 className="font-semibold">Description</h3>
            <p className="flex items-start gap-2">
              <FaInfoCircle className="mt-1" /> {event.description}
            </p>
          </div>
        )}
        {event.eventType === "COURSE_EVENT" && (
          <>
            <div>
              <h3 className="font-semibold">Course</h3>
              <p>
                {event.courseName} (ID: {event.courseId})
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Semester</h3>
              <p>
                {event.semesterName} (ID: {event.semesterId})
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Academic Year</h3>
              <p>{event.academicYear}</p>
            </div>
          </>
        )}
        <div>
          <h3 className="font-semibold">Batch</h3>
          <p>{event.batch}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={() => onEditClick(event)}
          className="btn btn-primary gap-2"
        >
          <FaEdit /> Edit Event
        </button>
        <button
          onClick={() =>
            event.id !== undefined ? onDeleteClick(event.id) : null
          }
          className="btn btn-error gap-2"
        >
          <FaTrashAlt /> Delete Event
        </button>
      </div>
    </div>
  );
};

export default EventDetailView;
