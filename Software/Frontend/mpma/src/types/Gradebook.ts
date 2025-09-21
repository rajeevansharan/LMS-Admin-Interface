// This file now contains your existing types plus the new one.

export interface ActivityGrade {
  activityId: number;
  activityTitle: string;
  maxMarks: number;
  marksObtained: number | null; // Can be null if not submitted/graded
}

export interface StudentGradebook {
  personId: number;
  studentName: string;
  studentEmail: string;
  grades: ActivityGrade[];
}

// =================================================================
// THIS IS THE NEW TYPE THAT WAS MISSING
// =================================================================
/**
 * Defines the shape of the object required when a lecturer
 * grades or re-grades a submission.
 */
export interface GradeSubmissionPayload {
  marksObtained: number;
  feedback: string;
}
// =================================================================
