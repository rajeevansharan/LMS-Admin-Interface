import React from "react";
import { FaUser, FaRegClock, FaSpinner, FaEye } from "react-icons/fa";
import { Event } from "./types/event";

interface DailyEventsListProps {
  dailyEvents: Event[];
  isLoading: boolean;
  selectedDate: Date;
  onViewDetails: (event: Event) => void;
}

const DailyEventsList: React.FC<DailyEventsListProps> = ({
  dailyEvents,
  isLoading,
  selectedDate,
  onViewDetails,
}) => {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaRegClock className="text-accent" /> Events on{" "}
        {selectedDate.toLocaleDateString()}
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : dailyEvents.length > 0 ? (
        <ul className="space-y-4">
          {dailyEvents.map((event) => (
            <li
              key={event.id}
              className="p-4 bg-primary/10 text-neutral-800 rounded-lg"
            >
              <div className="font-semibold flex justify-between">
                {event.title}
                <button 
                  onClick={() => onViewDetails(event)}
                  className="btn btn-sm btn-ghost"
                >
                  <FaEye /> View Details
                </button>
              </div>
              {event.description && (
                <p className="mt-2 text-sm opacity-80">{event.description}</p>
              )}
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <FaUser className="mr-1" />{" "}
                <span>Created by: {event.createdBy}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-base-content opacity-60">No events for this date.</p>
      )}
    </>
  );
};

export default DailyEventsList;