import React from "react";
import { SemesterBatchInfo } from "./types/event";

interface FilterValues {
  academicYear: string;
  semesterId: string;
  batch: string;
}

interface FiltersSectionProps {
  filters: FilterValues;
  semesterBatchInfo: SemesterBatchInfo | null;
  onFilterChange: (newFilters: FilterValues) => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  semesterBatchInfo,
  onFilterChange,
}) => {
  const handleAcademicYearChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onFilterChange({ ...filters, academicYear: e.target.value });
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, semesterId: e.target.value });
  };

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, batch: e.target.value });
  };

  if (!semesterBatchInfo) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Get unique academic years from semesters
  const academicYears = Array.from(
    new Set(semesterBatchInfo.semesters.map((s) => s.academicYear)),
  ).sort((a, b) => b.localeCompare(a));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Academic Year</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={filters.academicYear}
          onChange={handleAcademicYearChange}
        >
          <option value="">Select Academic Year</option>
          {academicYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Semester</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={filters.semesterId}
          onChange={handleSemesterChange}
          disabled={!filters.academicYear}
        >
          <option value="">Select Semester</option>
          {semesterBatchInfo.semesters
            .filter((s) => s.academicYear === filters.academicYear)
            .map((semester) => (
              <option key={semester.semesterId} value={semester.semesterId}>
                {semester.semesterName}
              </option>
            ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Batch</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={filters.batch}
          onChange={handleBatchChange}
        >
          <option value="">Select Batch</option>
          {semesterBatchInfo.batches.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltersSection;