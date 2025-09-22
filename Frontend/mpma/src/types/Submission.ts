export interface Submission {
  submissionId: number;
  studentId: string;
  studentName: string;
  submissionDate: string; // Dates usually come as ISO strings from JSON
  filePath: string | null; // Can be a string or null
  status: "SUBMITTED" | "GRADED" | "LATE" | "REJECTED";
  marksObtained: number | null;
  feedback: string | null;
}
