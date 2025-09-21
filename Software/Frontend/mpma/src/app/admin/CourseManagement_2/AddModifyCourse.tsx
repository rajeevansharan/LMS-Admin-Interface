"use client";

import { useState } from "react";
import axios from "axios";

interface CourseFormData {
  courseId: number | null;
  name: string;
  startDate: string;
}

export default function AddModifyCourse() {
  const [formData, setFormData] = useState<CourseFormData>({
    courseId: null,
    name: "",
    startDate: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const createOrUpdateCourse = async (data: CourseFormData) => {
    const response = await axios.post("http://localhost:8080/api/courses/create", {
      ...data,
      courseId: data.courseId || undefined // Send undefined if null to let backend generate ID
    });
    return response.data;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [id]: id === "courseId" ? (value ? parseInt(value) : null) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createOrUpdateCourse(formData);
      setSuccessMessage("Course saved successfully!");
      setFormData({
        courseId: null,
        name: "",
        startDate: "",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrorMessage("Course ID already exists. Please use a different ID.");
        } else {
          setErrorMessage(
            error.response?.data?.message || error.message || "Failed to save course"
          );
        }
      } else {
        setErrorMessage("Failed to save course");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Course Information</h2>
        <p className="text-sm text-gray-500">Add or modify course details</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">{errorMessage}</div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
            Course Code
          </label>
          <input
            type="number"
            id="courseId"
            placeholder="e.g. 101"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={formData.courseId ?? ""}
            onChange={handleChange}
          />
          <p className="mt-1 text-sm text-gray-500">Unique identifier for the course (leave empty for new courses)</p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Course Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="e.g. Introduction to Computer Science"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Course"}
          </button>
        </div>
      </form>
    </div>
  );
}