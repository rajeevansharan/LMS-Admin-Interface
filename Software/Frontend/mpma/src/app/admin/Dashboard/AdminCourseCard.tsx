"use client";
import Link from "next/link";
import { FaCalendarAlt, FaEye } from "react-icons/fa";

interface CourseResponse {
  courseId: number;
  courseName: string;
  startDate: string;
  status: "Active" | "Completed";
}

const AdminCourseCard: React.FC<CourseResponse> = ({
  courseId,
  courseName,
  startDate,
  status,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
      {/* Course Details */}
      <div className="card-body p-4">
        <h2 className="card-title text-lg mb-2 line-clamp-2">{courseName}</h2>
        <p className="text-sm font-medium">Course ID: {courseId}</p>

        <div className="space-y-2 text-sm mt-2">
          <div className="flex items-center gap-2">
            <span
              className={`badge ${status === "Active" ? "badge-success" : "badge-neutral"}`}
            >
              {status}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-2">
            <FaCalendarAlt className="text-amber-600 w-3 h-3" />
            <span className="font-medium text-amber-700">
              {new Date(startDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="card-actions justify-end mt-4">
          <Link
            href={`/admin/courses/${courseId}/view`}
            className="btn btn-sm btn-primary flex items-center gap-1"
          >
            <FaEye className="w-3 h-3" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseCard;
