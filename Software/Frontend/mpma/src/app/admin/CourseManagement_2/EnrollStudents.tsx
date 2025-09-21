"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface ManualEnrollmentForm {
  studentId: number | null;
  courseId: number | null;
  semesterId: string;
  batch: string;
  status: "ACTIVE" | "COMPLETED";
}

export default function EnrollStudents() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState<ManualEnrollmentForm>({
    studentId: null,
    courseId: null,
    semesterId: "",
    batch: "",
    status: "ACTIVE",
  });

  const [enrolledStudent, setEnrolledStudent] =
    useState<ManualEnrollmentForm | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        id === "studentId" || id === "courseId"
          ? value
            ? parseInt(value)
            : null
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    setEnrolledStudent(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/enrollments",
        {
          studentId: formData.studentId,
          courseId: formData.courseId,
          semesterId: parseInt(formData.semesterId),
          batch: formData.batch,
          status: formData.status,
        },
      );

      setSuccessMessage("Student enrolled successfully!");
      setEnrolledStudent(response.data);
      setFormData({
        studentId: null,
        courseId: null,
        semesterId: "",
        batch: "",
        status: "ACTIVE",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data;
          if (status === 404) {
            setErrorMessage(message);
          } else if (status === 400) {
            setErrorMessage(message);
          } else {
            setErrorMessage("Enrollment failed: " + message);
          }
        } else {
          setErrorMessage(
            "Enrollment failed - please check your inputs and try again",
          );
        }
      } else {
        setErrorMessage("Enrollment failed due to an unknown error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Student Enrollment
        </h2>
        <p className="text-sm text-gray-500">Enroll a student for a course</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md shadow-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md shadow-sm">
          {errorMessage}
        </div>
      )}

      {enrolledStudent && (
        <div className="p-4 bg-blue-50 text-blue-900 rounded-md shadow-sm">
          <h3 className="font-semibold mb-2">Enrollment Details</h3>
          <ul className="text-sm space-y-1">
            <li>
              <strong>Student ID:</strong> {enrolledStudent.studentId}
            </li>
            <li>
              <strong>Course ID:</strong> {enrolledStudent.courseId}
            </li>
            <li>
              <strong>Semester ID:</strong> {enrolledStudent.semesterId}
            </li>
            <li>
              <strong>Batch:</strong> {enrolledStudent.batch}
            </li>
            <li>
              <strong>Status:</strong> {enrolledStudent.status}
            </li>
          </ul>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="studentId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Student ID
          </label>
          <input
            type="number"
            id="studentId"
            value={formData.studentId ?? ""}
            onChange={handleChange}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="courseId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course ID
          </label>
          <input
            type="number"
            id="courseId"
            value={formData.courseId ?? ""}
            onChange={handleChange}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="semesterId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Semester ID
          </label>
          <input
            type="text"
            id="semesterId"
            value={formData.semesterId}
            onChange={handleChange}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="batch"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Batch
          </label>
          <input
            type="text"
            id="batch"
            placeholder="e.g. 2023"
            value={formData.batch}
            onChange={handleChange}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? "Enrolling..." : "Enroll Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
