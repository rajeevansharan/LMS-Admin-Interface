// app/admin/AdminCourse2/AdminVCourse.tsx
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaSearch, FaPlus } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import AdminCourseCard from "./AdminCourseCard";
import { BackendCourseCard, FrontendCourseCard, SemesterBatchInfo } from "./types/course";

export default function AdminCourseView(): React.ReactElement {
  const [courses, setCourses] = useState<FrontendCourseCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [batch, setBatch] = useState("");
  const [semesterBatchInfo, setSemesterBatchInfo] = useState<SemesterBatchInfo | null>(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSemesterBatchInfo = async () => {
      try {
        const response = await axios.get<SemesterBatchInfo>(
          "http://localhost:8080/api/helper/semester-and-batch-info"
        );
        setSemesterBatchInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch semester and batch info", error);
        setError("Failed to load semester and batch information.");
      }
    };

    fetchSemesterBatchInfo();
  }, []);

  const fetchCourses = async () => {
    if (!semesterId || !batch) {
      setError("Please select both semester and batch");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get<BackendCourseCard[]>(
        `http://localhost:8080/api/enrollments/courses/semester/${semesterId}/batch/${batch}`,
      );

      const transformedCourses: FrontendCourseCard[] = response.data.map(
        (course) => ({
          courseId: course.courseId,
          courseName: course.courseName || "Untitled Course",
          semesterId: course.semesterId || semesterId,
          semesterName: course.semesterName,
          batch: course.batch || batch,
        }),
      );

      setCourses(transformedCourses);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch courses", error);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedSemester(selectedId);
    setSemesterId(selectedId);
  };

  const filteredCourses = courses.filter((course) => {
    return course.courseName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Enrolled Courses Overview</h1>

        {error && (
          <div className="alert alert-error mb-6">
            <FiInfo className="text-xl" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-4 w-full md:w-2/3">
            <div className="form-control w-1/2">
              <select
                className="select select-bordered w-full"
                value={selectedSemester}
                onChange={handleSemesterChange}
              >
                <option value="">Select Semester</option>
                {semesterBatchInfo?.semesters.map((semester) => (
                  <option key={semester.semesterId} value={semester.semesterId}>
                    {semester.semesterName} - {semester.academicYear}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control w-1/2">
              <select
                className="select select-bordered w-full"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              >
                <option value="">Select Batch</option>
                {semesterBatchInfo?.batches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-primary whitespace-nowrap"
              onClick={fetchCourses}
              disabled={!semesterId || !batch}
            >
              <FaSearch className="mr-2" />
              Search Courses
            </button>
          </div>

          <Link href="/admin/CourseManagement_2" className="btn btn-primary">
            <FaPlus className="mr-2" />
            Add Course
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="form-control w-full md:w-1/3">
            <div className="join">
              <input
                type="text"
                placeholder="Search courses..."
                className="input input-bordered join-item w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-square btn-primary join-item">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>

        {!semesterId || !batch ? (
          <div className="flex justify-center items-center h-64">
            <div className="alert alert-info">
              <FiInfo className="text-xl" />
              <span>
                Please select both semester and batch to view courses
              </span>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <AdminCourseCard key={course.courseId} {...course} />
              ))
            ) : (
              <div className="col-span-full text-center">
                <div className="alert alert-info">
                  <FiInfo className="text-xl" />
                  <span>No courses found matching your criteria.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}  