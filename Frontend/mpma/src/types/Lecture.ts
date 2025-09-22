export interface Lecture {
  lectureId: number;
  courseId: number;
  lecturerId: number;
  lecturerName: string;
  title: string;
  startDate: string; // ISO 8601 date string
  durationMinutes: number;
  location: string;
  description: string;
}

export interface LectureCreate {
  title: string;
  description: string;
  startDate: string; // ISO 8601 date string
  durationMinutes: number;
  location: string;
  // courseId and lecturerId/username will be handled by the backend/service
}
