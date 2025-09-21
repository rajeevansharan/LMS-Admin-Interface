"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Semester {
  semesterId: string;
  semesterName: string;
  academicYear: string;
  courses: Course[];
}

interface Course {
  courseId: number;
  name: string;
}

export default function SemesterManagement() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);
  const [formData, setFormData] = useState({
    semesterId: "",
    semesterName: "",
    academicYear: "",
    courseIds: [] as number[],
  });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/semesters");
      setSemesters(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch semester data");
      console.error("Error fetching semesters:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (semester: Semester) => {
    setCurrentSemester(semester);
    setFormData({
      semesterId: semester.semesterId,
      semesterName: semester.semesterName,
      academicYear: semester.academicYear,
      courseIds: semester.courses?.map((c) => c.courseId) || [],
    });
    setShowEditModal(true);
  };

  const handleCreateClick = () => {
    setCurrentSemester(null);
    setFormData({
      semesterId: "",
      semesterName: "",
      academicYear: "",
      courseIds: [],
    });
    setShowCreateModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const courseIds = value
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));
    setFormData((prev) => ({
      ...prev,
      courseIds,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (currentSemester) {
      // Update existing semester
      await axios.put(
        `http://localhost:8080/api/semesters/${currentSemester.semesterId}`,
        formData
      );
      toast.success("Semester updated successfully");
    } else {
      // Create new semester
      await axios.post("http://localhost:8080/api/semesters", formData);
      toast.success("Semester created successfully");
    }

    fetchSemesters();
    setShowEditModal(false);
    setShowCreateModal(false);
    setError(null);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data;

      // Handle backend error responses
      if (status === 409 && data?.type === "SemesterAlreadyExists") {
        toast.error(data.message); // "Semester with ID '...' already exists."
      } else if (status === 400 && data?.type === "CourseNotFound") {
        toast.error(data.message); // specific course not found message
      } else if (status === 500) {
        toast.error("Server error occurred. Please try again.");
      } else {
        toast.error(data?.message || "An error occurred while submitting the form.");
      } 
    } else {
      toast.error("An unexpected error occurred.");
    }

    if (process.env.NODE_ENV === "development") {
      console.error("Submit error:", err);
    }
  }
};


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Semester Management
        </h2>
        <p className="text-sm text-gray-500">
          View and manage semester details
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={handleCreateClick} className="btn btn-primary">
          Create New Semester
        </button>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Semester ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Semester Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Academic Year
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Number of Courses
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {semesters.map((semester) => (
              <tr key={semester.semesterId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {semester.semesterId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {semester.semesterName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {semester.academicYear}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {semester.courses?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEditClick(semester)}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {semesters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No semester data available</p>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && currentSemester && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Semester</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Semester ID</span>
                </label>
                <input
                  type="text"
                  name="semesterId"
                  value={formData.semesterId}
                  readOnly
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Semester Name</span>
                </label>
                <input
                  type="text"
                  name="semesterName"
                  value={formData.semesterName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Academic Year</span>
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">
                    Course ID
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.courseIds.join(", ")}
                  onChange={handleCourseIdsChange}
                  className="input input-bordered w-full"
                  placeholder="e.g. 1, 2, 3"
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create New Semester</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Semester ID</span>
                </label>
                <input
                  type="text"
                  name="semesterId"
                  value={formData.semesterId}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Semester Name</span>
                </label>
                <input
                  type="text"
                  name="semesterName"
                  value={formData.semesterName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Academic Year</span>
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">
                    Course ID
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.courseIds.join(", ")}
                  onChange={handleCourseIdsChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
              {error && (
                <div className="alert alert-error mb-4">
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
