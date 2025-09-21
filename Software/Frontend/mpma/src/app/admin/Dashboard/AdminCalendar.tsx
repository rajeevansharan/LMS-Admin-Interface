"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import { FaRegCalendarAlt, FaArrowRight, FaCircle, FaSearch } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import "./daisy-calendar.css";
import Link from "next/link";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Event {
  id: string;
  date: Date;
  title: string;
  eventType: string;
  description: string;
  createdBy: string;
  batch: string;
}

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  const handleDateChange = (value: Value) => {
    if (value) {
      const date = Array.isArray(value) ? value[0] : value;
      if (date) {
        setSelectedDate(date);
        filterEventsByDate(date);
        setSelectedEvent(null);
      }
    }
  };

  const filterEventsByDate = (date: Date) => {
    const filtered = upcomingEvents.filter(event => isSameDay(event.date, date));
    setFilteredEvents(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredEvents(upcomingEvents);
      return;
    }
    const filtered = upcomingEvents.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8080/api/events/upcoming/batchWiseEvents",
        );
        const events = response.data.map((event: Event) => ({
          ...event,
          date: new Date(event.date),
        }));
        const sortedEvents = events.sort(
          (a: Event, b: Event) => a.date.getTime() - b.date.getTime(),
        );
        setUpcomingEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
      } catch (err) {
        console.error("Failed to fetch batch-wise events", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcomingEvents();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FaRegCalendarAlt className="text-blue-500" />
          Calendar Overview
        </h2>
        <Link
          href="/admin/AdminCalendaViewPage"
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          View Full Calendar <FaArrowRight className="ml-1 inline" />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Section */}
        <div className="flex-1 bg-white rounded-lg p-4 border border-gray-200">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="daisy-calendar border-0"
            tileClassName={({ date, view }) => {
              if (view !== "month") return "";
              let classes = "rounded-lg hover:bg-blue-50 transition duration-200";

              const hasEvent = upcomingEvents.some((e) =>
                isSameDay(e.date, date),
              );
              const isToday = isSameDay(date, new Date());
              const isSelected =
                selectedDate instanceof Date && isSameDay(date, selectedDate);

              if (hasEvent) {
                classes += " bg-blue-100 text-blue-700 font-semibold";
              }

              if (isToday && !isSelected) {
                classes += " ring-2 ring-blue-500";
              }

              if (isSelected) {
                classes += " bg-blue-500 text-white";
              }

              return classes;
            }}
            tileContent={({ date, view }) =>
              view === "month" &&
              upcomingEvents.some((e) => isSameDay(e.date, date)) ? (
                <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                  <FaCircle className="text-blue-500 text-xs" />
                </div>
              ) : null
            }
          />
        </div>

        {/* Upcoming Events Section */}
        <div className="flex-1 bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="pl-8 pr-4 py-1 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-2 top-2 text-gray-400 text-sm" />
            </form>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="overflow-y-auto max-h-64">
              <ul className="space-y-2">
                {filteredEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                        event.eventType === "deadline"
                          ? "bg-red-400"
                          : event.eventType === "meeting"
                            ? "bg-green-400"
                            : "bg-blue-400"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.date.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No events found</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Section */}
      {selectedEvent && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Event Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-2">
                <strong className="text-gray-700">Title:</strong> {selectedEvent.title}
              </p>
              <p className="text-sm mb-2">
                <strong className="text-gray-700">Date:</strong>{" "}
                {selectedEvent.date.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm mb-2">
                <strong className="text-gray-700">Type:</strong>{" "}
                <span className="capitalize">{selectedEvent.eventType}</span>
              </p>
            </div>
            <div>
              <p className="text-sm mb-2">
                <strong className="text-gray-700">Created By:</strong> {selectedEvent.createdBy}
              </p>
              <p className="text-sm mb-2">
                <strong className="text-gray-700">Batch:</strong> {selectedEvent.batch}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm">
              <strong className="text-gray-700">Description:</strong>{" "}
              <span className="text-gray-600">{selectedEvent.description}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;