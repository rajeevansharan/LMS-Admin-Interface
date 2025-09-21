// app/admin/AdminCourse2/types/course.ts
export interface BackendCourseCard {
  courseId: number;
  courseName: string;
  semesterId: string;
  semesterName: string;
  batch: string;
}

export interface LecturerDTO {
  lecturerId: number;
  name: string;
  email: string;
}

export interface StudentDTO {
  studentId: number;
  name: string;
  username: string;
}

export type EnrollmentStatus = "OPEN" | "CLOSED" | "FULL";

export interface BackendCourseDetails {
  courseId: number;
  courseName: string;
  semesterId: string;
  semesterName: string;
  batch: string;
  enrollmentStatus: EnrollmentStatus;
  enrolledStudentCount: number;
  lecturers: LecturerDTO[];
  students: StudentDTO[];
}

export interface FrontendCourseCard {
  courseId: number;
  courseName: string;
  semesterId: string;
  semesterName: string;
  batch: string;
}

export interface SemesterBatchInfo {
  semesters: {
    semesterId: string;
    semesterName: string;
    academicYear: string;
  }[];
  batches: string[];
}

// Helper function to generate unique keys for students
export const generateStudentKey = (student: StudentDTO): string => {
  return `student-${student.studentId}-${student.username}`;
};

// Helper function to generate unique keys for lecturers
export const generateLecturerKey = (lecturer: LecturerDTO): string => {
  return `lecturer-${lecturer.lecturerId}`;
};
