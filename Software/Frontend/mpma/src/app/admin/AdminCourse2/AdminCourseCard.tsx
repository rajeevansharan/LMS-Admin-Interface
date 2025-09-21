// app/admin/AdminCourse2/AdminCourseCard.tsx
"use client";
import Link from "next/link";
import { FrontendCourseCard } from "./types/course";

const AdminCourseCard: React.FC<FrontendCourseCard> = ({
  courseId,
  courseName,
  semesterName,
  batch,
  semesterId,
}) => {
  const hasValidParams = courseId && semesterId && batch;
  const href = hasValidParams
    ? `/admin/AdminCourse2/${courseId}?semesterId=${encodeURIComponent(semesterId)}&batch=${encodeURIComponent(batch)}`
    : "#";

  const cardContent = (
    <div className="p-4 text-center space-y-1">
      <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
        {courseName}
      </h2>
      <p className="text-sm text-gray-500">Course ID: {courseId}</p>
      <p className="text-sm text-gray-500">Semester: {semesterName}</p>
      <p className="text-sm text-gray-500">Batch: {batch}</p>
    </div>
  );

  if (!hasValidParams) {
    return (
      <div className="block rounded-2xl border border-base-200 bg-white shadow-md opacity-50 cursor-not-allowed overflow-hidden">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-base-200 bg-white shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
    >
      {cardContent}
    </Link>
  );
};

export default AdminCourseCard;
