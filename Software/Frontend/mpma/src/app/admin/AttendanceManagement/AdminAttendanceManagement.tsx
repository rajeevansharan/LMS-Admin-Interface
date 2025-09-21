"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Student {
  id: string;
  name: string;
}

type AttendanceStatus = "Present" | "Absent" | "";

const AdminAttendanceManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [courseInput, setCourseInput] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (courseInput.trim()) {
      const loadedStudents: Student[] = [
        { id: "ST001", name: "John Doe" },
        { id: "ST002", name: "Jane Smith" },
        { id: "ST003", name: "Alice Johnson" },
        { id: "ST004", name: "Bob Marley" },
      ];
      setStudents(loadedStudents);
      setFilteredStudents(loadedStudents);
    } else {
      setStudents([]);
      setFilteredStudents([]);
    }
    setAttendance({});
    setSelectAll(false);
    setSearchQuery("");
  }, [courseInput]);

  useEffect(() => {
    if (selectAll) {
      const updated = Object.fromEntries(
        students.map((s) => [s.id, "Present" as AttendanceStatus])
      );
      setAttendance(updated);
    }
  }, [selectAll, students]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus): void => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleClearAll = () => {
    const cleared = Object.fromEntries(
      students.map((s) => [s.id, "" as AttendanceStatus])
    );
    setAttendance(cleared);
    setSelectAll(false);
  };

  const handleSubmit = (): void => {
    if (!courseInput || filteredStudents.length === 0 || !selectedDate) return;

    const submission = {
      courseIdOrName: courseInput,
      date: selectedDate,
      records: filteredStudents.map((s) => ({
        studentId: s.id,
        status: attendance[s.id] || "Absent",
      })),
    };
    console.log("Attendance Submitted:", submission);
    toast.success("Attendance submitted successfully!");
  };

  const totalPresent = Object.values(attendance).filter((s) => s === "Present").length;
  const totalAbsent = Object.values(attendance).filter((s) => s === "Absent").length;

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Attendance Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Course ID or Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter course ID or name"
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {courseInput && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <label className="cursor-pointer label">
              <input
                type="checkbox"
                className="checkbox checkbox-primary mr-2"
                checked={selectAll}
                onChange={(e) => setSelectAll(e.target.checked)}
              />
              <span className="label-text">Mark all students as Present</span>
            </label>

            <button
              onClick={handleClearAll}
              className="btn btn-ghost btn-sm text-error"
            >
              Clear All
            </button>
          </div>
        )}

        {courseInput && (
          <div className="form-control mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or ID"
                className="input input-bordered w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {courseInput && (
          <>
            <div className="text-sm mb-4">
              <span className="font-semibold">Present:</span> {totalPresent} / {filteredStudents.length} | 
              <span className="font-semibold"> Absent:</span> {totalAbsent}
            </div>

            {filteredStudents.length === 0 ? (
              <div className="alert alert-warning">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>No students found.</span>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.id}</td>
                        <td>
                          <select
                            value={attendance[student.id] || ""}
                            onChange={(e) =>
                              handleStatusChange(
                                student.id,
                                e.target.value as AttendanceStatus
                              )
                            }
                            className="select select-bordered select-sm w-full max-w-xs"
                          >
                            <option value="">Status</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <div className="card-actions justify-end mt-6">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!courseInput || filteredStudents.length === 0 || !selectedDate}
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceManagement;