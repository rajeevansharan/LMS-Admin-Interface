export interface Event {
  id?: number;
  date: Date;
  title: string;
  description: string;
  createdBy: string;
  semesterId?: string | null;
  batch?: string;
  eventType?: string;
  courseId?: string | null;
  courseName?: string | null;
  semesterName?: string | null;
  academicYear?: string | null;
}
export interface SemesterBatchInfo {
  semesters: {
    semesterId: string;
    semesterName: string;
    academicYear: string;
  }[];
  batches: string[];
}
