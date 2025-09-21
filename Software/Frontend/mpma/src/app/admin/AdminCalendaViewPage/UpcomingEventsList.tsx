import React from "react";
import { FaSearch } from "react-icons/fa";
import { Event } from "./types/event";

interface UpcomingEventsListProps {
  searchTerm: string;
  filteredUpcoming: Event[];
  selectedEvent: Event | null;
  onSearchChange: (term: string) => void;
  onEventClick: (event: Event) => void;
}

const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({
  searchTerm,
  filteredUpcoming,
  selectedEvent,
  onSearchChange,
  onEventClick,
}) => {
  return (
    <>
      <div className="form-control mb-3">
        <label className="label">Search Events</label>
        <div className="flex items-center gap-2">
          <FaSearch />
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Search upcoming events"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">Upcoming Events</h3>
      {filteredUpcoming.length > 0 ? (
        <div className="flex gap-4">
          <ul className="space-y-3 max-h-64 overflow-auto pr-2 flex-1">
            {filteredUpcoming.map((event) => (
              <li
                key={event.id}
                className={`p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 ${
                  selectedEvent?.id === event.id ? "bg-blue-200" : ""
                }`}
                onClick={() => onEventClick(event)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{event.title}</span>
                  <span className="text-sm opacity-80">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-base-content opacity-60">No upcoming events.</p>
      )}
    </>
  );
};

export default UpcomingEventsList;
