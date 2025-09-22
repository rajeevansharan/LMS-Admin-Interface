import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./daisy-calendar.css";
import { Event } from "./types/event";

interface CalendarComponentProps {
  selectedDate: Date;
  dailyEvents: Event[];
  upcomingEvents: Event[];
  onDateChange: (date: Date) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  selectedDate,
  dailyEvents,
  upcomingEvents,
  onDateChange,
}) => {
  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Calendar</h2>
      <Calendar
        onChange={(value) => onDateChange(value as Date)}
        value={selectedDate}
        className="daisy-calendar"
        tileClassName={({ date }) => {
          let classes =
            "rounded-lg hover:bg-primary hover:text-white transition duration-200";
          if (isSameDay(date, selectedDate)) {
            classes += " bg-primary text-white font-semibold";
          } else if (isSameDay(date, new Date())) {
            classes += " bg-accent text-white";
          } else if (dailyEvents.some((e) => isSameDay(e.date, date))) {
            classes += " border border-primary text-primary";
          } else if (upcomingEvents.some((e) => isSameDay(e.date, date))) {
            classes += " border border-blue-300 text-blue-500";
          }
          return classes;
        }}
        tileContent={({ date }) => {
          const hasDailyEvent = dailyEvents.some((e) => isSameDay(e.date, date));
          const hasUpcomingEvent = upcomingEvents.some((e) => isSameDay(e.date, date));
          
          if (hasDailyEvent && hasUpcomingEvent) {
            return (
              <div className="flex justify-center mt-1">
                <span className="block w-2 h-2 bg-primary rounded-full mx-0.5"></span>
                <span className="block w-2 h-2 bg-blue-400 rounded-full mx-0.5"></span>
              </div>
            );
          } else if (hasDailyEvent) {
            return <span className="block w-2 h-2 bg-primary rounded-full mx-auto mt-1"></span>;
          } else if (hasUpcomingEvent) {
            return <span className="block w-2 h-2 bg-blue-400 rounded-full mx-auto mt-1"></span>;
          }
          return null;
        }}
      />
    </div>
  );
};

export default CalendarComponent;