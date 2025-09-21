"use client";

import { useState } from "react";
import axios from "axios";

interface AssignLecturerFormData {
  assignCourseId: string;
  lecturerId: string;
}

export default function AssignLecturer() {
  const [formData, setFormData] = useState<AssignLecturerFormData>({
    assignCourseId: "",
    lecturerId: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.post(
        "http://localhost:8080/api/courses/assign-lecturer",
        {
          lecturerId: formData.lecturerId,
          courseId: formData.assignCourseId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setSuccessMessage("Lecturer assigned successfully!");
      setFormData({
        assignCourseId: "",
        lecturerId: "",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Failed to assign lecturer",
        );
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Lecturer Assignment
        </h2>
        <p className="text-sm text-gray-500">Assign lecturers to courses</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="assignCourseId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course ID
          </label>
          <input
            type="text"
            id="assignCourseId"
            placeholder="Enter course ID"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            value={formData.assignCourseId}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="lecturerId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lecturer ID
          </label>
          <input
            type="text"
            id="lecturerId"
            placeholder="Enter lecturer ID"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            value={formData.lecturerId}
            onChange={handleChange}
          />
          <p className="mt-1 text-sm text-gray-500">
            You can search lecturers by name or ID
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Assigning..." : "Assign Lecturer"}
          </button>
        </div>
      </form>
    </div>
  );
}
