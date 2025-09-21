"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegCalendarAlt, FaPlus, FaSpinner, FaCheck } from "react-icons/fa";
import CalendarComponent from "./CalendarComponent";
import DailyEventsList from "./DailyEventsList";
import EventModal from "./EventModal";
import FiltersSection from "./FiltersSection";
import UpcomingEventsList from "./UpcomingEventsList";
import EventDetailView from "./EventDetailView";
import { Event, SemesterBatchInfo } from "./types/event";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyEvents, setDailyEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [selectedUpcomingEvent, setSelectedUpcomingEvent] =
    useState<Event | null>(null);
  const [selectedDailyEvent, setSelectedDailyEvent] = useState<Event | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    createdBy: "",
    type: "course",
    semesterId: "",
    batch: "",
    courseId: "",
  });
  const [editEventId, setEditEventId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    academicYear: "",
    semesterId: "",
    batch: "",
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [semesterBatchInfo, setSemesterBatchInfo] =
    useState<SemesterBatchInfo | null>(null);

  useEffect(() => {
    const fetchSemesterBatchInfo = async () => {
      try {
        const response = await axios.get<SemesterBatchInfo>(
          "http://localhost:8080/api/helper/semester-and-batch-info",
        );
        setSemesterBatchInfo(response.data);
      } catch (err) {
        console.error("Failed to fetch semester and batch info", err);
        setError("Failed to load semester and batch information.");
      }
    };

    fetchSemesterBatchInfo();
  }, []);

  const fetchFilteredEvents = async () => {
    const { academicYear, semesterId, batch } = filters;
    if (!academicYear || !semesterId || !batch) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/events/upcoming/basic/${academicYear}/${semesterId}/${batch}`,
      );
      const events = response.data.map((event: Event) => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date),
        description: event.description,
        createdBy: event.createdBy,
        eventType: event.eventType,
        semesterId: event.semesterId,
        batch: event.batch,
        courseId: event.courseId,
        courseName: event.courseName,
        semesterName: event.semesterName,
        academicYear: event.academicYear,
      }));
      setUpcomingEvents(events);
      setSelectedUpcomingEvent(null);
    } catch (err) {
      setError("Failed to fetch filtered events");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventDetails = async (
    eventId: number,
    isUpcoming: boolean = false,
  ) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/events/details/${eventId}`,
      );
      const eventDetails = response.data;
      const detailedEvent = {
        id: eventDetails.id,
        title: eventDetails.title,
        date: new Date(eventDetails.date),
        description: eventDetails.description,
        createdBy: eventDetails.createdBy,
        eventType: eventDetails.eventType,
        semesterId: eventDetails.semesterId,
        batch: eventDetails.batch,
        courseId: eventDetails.courseId,
        courseName: eventDetails.courseName,
        semesterName: eventDetails.semesterName,
        academicYear: eventDetails.academicYear,
      };

      if (isUpcoming) {
        setSelectedUpcomingEvent(detailedEvent);
      } else {
        setSelectedDailyEvent(detailedEvent);
      }
      setShowEventDetail(true);
    } catch (err) {
      setError("Failed to fetch event details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventsForDate = async () => {
    if (!selectedDate) return;
    const { academicYear, semesterId, batch } = filters;
    if (!academicYear || !semesterId || !batch) return;

    setIsLoading(true);
    setError("");
    try {
      const dateStr = selectedDate.toLocaleDateString("en-CA");
      const response = await axios.get(
        `http://localhost:8080/api/events/date/basic/${academicYear}/${semesterId}/${batch}/${dateStr}`,
      );
      setDailyEvents(
        response.data.map((event: Event) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date),
          description: event.description,
          createdBy: event.createdBy,
          eventType: event.eventType,
          semesterId: event.semesterId,
          batch: event.batch,
          courseId: event.courseId,
          courseName: event.courseName,
          semesterName: event.semesterName,
          academicYear: event.academicYear,
        })),
      );
    } catch (err) {
      setError("Failed to fetch events for selected date");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAllData = async () => {
    await fetchFilteredEvents();
    await fetchEventsForDate();
  };

  const handleConfirm = async () => {
    await refreshAllData();
    setDataLoaded(true);
  };

  const addEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.createdBy.trim()) {
      setError("Title and Created By are required.");
      return;
    }

    if (newEvent.type === "course" && !newEvent.courseId.trim()) {
      setError("Course ID is required for course events.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const dateStr = selectedDate.toISOString().slice(0, 10);
      const payload = {
        title: newEvent.title,
        description: newEvent.description,
        createdBy: newEvent.createdBy,
        date: dateStr,
        batch: newEvent.batch,
      };

      if (editEventId) {
        const url =
          newEvent.type === "course"
            ? `http://localhost:8080/api/events/course/${editEventId}`
            : `http://localhost:8080/api/events/batch/${editEventId}`;

        await axios.put(url, {
          ...payload,
          ...(newEvent.type === "course" && {
            semesterId: newEvent.semesterId,
            courseId: newEvent.courseId,
          }),
        });
      } else {
        const url =
          newEvent.type === "course"
            ? "http://localhost:8080/api/events/course"
            : "http://localhost:8080/api/events/batch";

        await axios.post(url, {
          ...payload,
          ...(newEvent.type === "course" && {
            semesterId: newEvent.semesterId,
            courseId: newEvent.courseId,
          }),
        });
      }

      setEditEventId(null);
      setNewEvent({
        title: "",
        description: "",
        createdBy: "",
        type: "course",
        semesterId: "",
        batch: "",
        courseId: "",
      });
      setShowModal(false);
      await refreshAllData();
      setShowEventDetail(false);
    } catch (err) {
      setError("Failed to save event");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setError("");
    try {
      await axios.delete(`http://localhost:8080/api/events/${id}`);
      await refreshAllData();
      setShowEventDetail(false);
    } catch (err) {
      setError("Failed to delete event");
      console.error(err);
    }
  };

  const handleEditClick = (event: Event) => {
    const eventType = event.eventType === "COURSE_EVENT" ? "course" : "batch";
    setNewEvent({
      title: event.title,
      description: event.description,
      createdBy: event.createdBy,
      type: eventType,
      semesterId: event.semesterId || "",
      batch: event.batch || "",
      courseId: event.courseId || "",
    });
    setSelectedDate(new Date(event.date));
    setEditEventId(event.id || null);
    setShowModal(true);
  };

  useEffect(() => {
    if (dataLoaded) fetchEventsForDate();
  }, [selectedDate]);

  const filteredUpcoming = upcomingEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="card bg-base-100 shadow-xl p-6 mb-6">
          <FiltersSection
            filters={filters}
            semesterBatchInfo={semesterBatchInfo}
            onFilterChange={(newFilters) => setFilters(newFilters)}
          />
          <div className="flex justify-end mt-4">
            <button
              className="btn btn-primary gap-2"
              onClick={handleConfirm}
              disabled={
                isLoading ||
                !filters.academicYear ||
                !filters.semesterId ||
                !filters.batch
              }
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <FaCheck /> Confirm
                </>
              )}
            </button>
          </div>
        </div>

        {dataLoaded && (
          <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                <FaRegCalendarAlt className="text-blue-600" />
                <span className="text-blue-600">Academic Calendar</span>
              </h1>
              <button
                className="btn btn-primary gap-2"
                onClick={() => setShowModal(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaPlus /> Add Event
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="alert alert-error mb-6">
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CalendarComponent
                selectedDate={selectedDate}
                dailyEvents={dailyEvents}
                upcomingEvents={upcomingEvents}
                onDateChange={setSelectedDate}
              />

              <div className="card bg-base-100 shadow-xl p-6">
                <DailyEventsList
                  dailyEvents={dailyEvents}
                  isLoading={isLoading}
                  selectedDate={selectedDate}
                  onViewDetails={(event) => fetchEventDetails(event.id!)}
                />

                <div className="divider my-6"></div>

                <UpcomingEventsList
                  searchTerm={searchTerm}
                  filteredUpcoming={filteredUpcoming}
                  selectedEvent={selectedUpcomingEvent}
                  onSearchChange={setSearchTerm}
                  onEventClick={(event) => fetchEventDetails(event.id!, true)}
                />
              </div>
            </div>

            {showEventDetail &&
              (selectedDailyEvent || selectedUpcomingEvent) && (
                <div className="mt-8">
                  <EventDetailView
                    event={selectedDailyEvent || selectedUpcomingEvent!}
                    onEditClick={(event) => {
                      handleEditClick(event);
                      setShowEventDetail(false);
                    }}
                    onDeleteClick={deleteEvent}
                    onClose={() => setShowEventDetail(false)}
                  />
                </div>
              )}
          </>
        )}
      </div>

      <EventModal
        showModal={showModal}
        newEvent={newEvent}
        selectedDate={selectedDate}
        editEventId={editEventId}
        error={error}
        isLoading={isLoading}
        onClose={() => {
          setShowModal(false);
          setError("");
          setNewEvent({
            title: "",
            description: "",
            createdBy: "",
            type: "course",
            semesterId: "",
            batch: "",
            courseId: "",
          });
          setEditEventId(null);
        }}
        onEventTypeChange={(type) => setNewEvent({ ...newEvent, type })}
        onTitleChange={(title) => setNewEvent({ ...newEvent, title })}
        onDescriptionChange={(description) =>
          setNewEvent({ ...newEvent, description })
        }
        onCreatedByChange={(createdBy) =>
          setNewEvent({ ...newEvent, createdBy })
        }
        onSemesterIdChange={(semesterId) =>
          setNewEvent({ ...newEvent, semesterId })
        }
        onBatchChange={(batch) => setNewEvent({ ...newEvent, batch })}
        onCourseIdChange={(courseId) => setNewEvent({ ...newEvent, courseId })}
        onDateChange={(date) => setSelectedDate(new Date(date + "T00:00:00"))}
        onSubmit={addEvent}
      />
    </main>
  );
};

export default CalendarPage;
