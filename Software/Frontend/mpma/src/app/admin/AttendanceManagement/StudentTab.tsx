import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaMinusCircle,
} from "react-icons/fa";
import axios from "axios";

interface AttendanceRecord {
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  semesterId: string;
  semesterName: string;
  date: string;
  present: boolean | null;
}

const StudentTab: React.FC = () => {
  const [studentId, setStudentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [batch, setBatch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [originalData, setOriginalData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [modifiedIndexes, setModifiedIndexes] = useState<number[]>([]);

  const currentDate = new Date().toISOString().split("T")[0];

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleFetchAttendance = async () => {
    if (!studentId || !semesterId || !batch || !selectedDate) {
      setAttendanceData([]);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get<AttendanceRecord[]>(
        `http://localhost:8080/api/attendance/student/${studentId}/semester/${semesterId}/batch/${batch}/date/${selectedDate}`,
      );

      const fetchedData = JSON.parse(JSON.stringify(response.data));
      setAttendanceData(fetchedData);
      setOriginalData(fetchedData);
      setModifiedIndexes([]);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch attendance data");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated: Toggle only between Present and Absent
  const toggleAttendance = (index: number) => {
    if (index === -1) return;

    const updated = [...attendanceData];
    const current = updated[index].present;

    // Force toggle only between true and false
    updated[index].present = current === true ? false : true;

    setAttendanceData(updated);

    if (!modifiedIndexes.includes(index)) {
      setModifiedIndexes((prev) => [...prev, index]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError("");

      for (const index of modifiedIndexes) {
        const record = attendanceData[index];
        const payload = {
          studentId: record.studentId,
          semesterId: record.semesterId,
          courseId: record.courseId,
          date: record.date,
          present: record.present,
        };

        await axios.put(
          "http://localhost:8080/api/attendance/student/quick-update",
          payload,
        );
      }

      alert("Changes saved successfully");
      setModifiedIndexes([]);
      setOriginalData(JSON.parse(JSON.stringify(attendanceData)));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to save changes");
      }
      console.error("Error saving changes:", err);
      alert("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelChanges = () => {
    const originalClone = JSON.parse(JSON.stringify(originalData));
    setAttendanceData(originalClone);
    setModifiedIndexes([]);
    setError("");
  };

  const filteredResults = attendanceData.filter((record) =>
    record.courseName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  const presentCount = filteredResults.filter(
    (record) => record.present === true,
  ).length;
  const absentCount = filteredResults.filter(
    (record) => record.present === false,
  ).length;

  const shouldShowTable =
    studentId &&
    semesterId &&
    batch &&
    selectedDate &&
    attendanceData.length > 0;

  return (
    <div className="card bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Student-wise Attendance</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Student ID
          </label>
          <input
            type="text"
            placeholder="e.g., S001"
            className="input input-bordered w-full"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Semester ID
          </label>
          <input
            type="text"
            placeholder="e.g., S2023"
            className="input input-bordered w-full"
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Batch
          </label>
          <input
            type="text"
            placeholder="e.g., B2023"
            className="input input-bordered w-full"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={currentDate}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <button
          className="btn btn-primary"
          onClick={handleFetchAttendance}
          disabled={
            !studentId || !semesterId || !batch || !selectedDate || loading
          }
        >
          Confirm
        </button>
  
      </div>

      {shouldShowTable && (
        <p className="text-sm text-indigo-600 italic mb-4">
          You can click the icons in the table to modify the{" "}
          <strong>Present</strong> status.
        </p>
      )}

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses by name..."
            className="input input-bordered pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!shouldShowTable}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8 gap-2">
          <FaSpinner className="animate-spin text-2xl text-blue-500" />
          <span>Loading attendance data...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-6 flex items-center gap-2">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-6">
        {shouldShowTable ? (
          <div className="alert alert-info text-sm">
            <span>
              Showing attendance records below. Use the icons to mark{" "}
              <strong>Present</strong> or <strong>Absent</strong>.
            </span>
          </div>
        ) : (
          <div className="alert alert-info text-sm">
            <span>
              Please enter Student ID, Semester ID, Batch, and Date, then click{" "}
              <strong>Confirm</strong> to view attendance records.
            </span>
          </div>
        )}
      </div>

      {shouldShowTable && (
        <>
          {filteredResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="font-semibold">Student ID</th>
                    <th className="font-semibold">Student Name</th>
                    <th className="font-semibold">Course</th>
                    <th className="font-semibold">Status</th>
                    <th className="font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((record) => {
                    const originalIndex = attendanceData.findIndex(
                      (item) =>
                        item.studentId === record.studentId &&
                        item.courseId === record.courseId &&
                        item.date === record.date,
                    );

                    return (
                      <tr
                        key={`${record.studentId}-${record.courseId}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="font-medium">{record.studentId}</td>
                        <td>{record.studentName}</td>
                        <td>
                          {record.courseName}
                          <br />
                          <span className="text-xs text-gray-500">
                            (Course ID: {record.courseId})
                          </span>
                        </td>
                        <td
                          className={
                            record.present === true
                              ? "text-green-600 font-medium"
                              : record.present === false
                                ? "text-red-600 font-medium"
                                : "text-gray-400 italic"
                          }
                        >
                          {record.present === true
                            ? "Present"
                            : record.present === false
                              ? "Absent"
                              : "No Value"}
                        </td>
                        <td>
                          <button
                            className="text-xl"
                            onClick={() => toggleAttendance(originalIndex)}
                            title="Toggle Attendance"
                            type="button"
                          >
                            {record.present === true ? (
                              <FaCheckCircle className="text-green-600" />
                            ) : record.present === false ? (
                              <FaTimesCircle className="text-red-600" />
                            ) : (
                              <FaMinusCircle className="text-gray-400" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <p className="text-sm mt-4 text-gray-600">
                Showing {filteredResults.length} course(s):{" "}
                <span className="text-green-600">Present: {presentCount}</span>,{" "}
                <span className="text-red-600">Absent: {absentCount}</span>
              </p>

              {modifiedIndexes.length > 0 && (
                <div className="mt-6 flex gap-4">
                  <button
                    className="btn btn-success"
                    onClick={handleSaveChanges}
                    disabled={loading}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn btn-outline btn-error"
                    onClick={handleCancelChanges}
                    disabled={loading}
                  >
                    Cancel Changes
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="alert alert-info flex items-center gap-2">
              <FaInfoCircle />
              <span>
                {debouncedSearchTerm
                  ? "No courses match your search criteria"
                  : "No attendance records found for the selected criteria"}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentTab;
