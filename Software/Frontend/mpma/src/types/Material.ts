// This is the base for all materials, containing common fields.
export interface BaseMaterial {
  materialId: number;
  title: string;
  description: string;
  visible: boolean;
  uploadDate: string;
  // This 'type' field is our primary discriminator.
  type: "DOCUMENT" | "ANNOUNCEMENT" | "LINKED" | "ACTIVITY";
}

// =================================================================
// --- SPECIFIC MATERIAL TYPES ---
// =================================================================

// This represents a simple file document.
export interface DocumentMaterial extends BaseMaterial {
  type: "DOCUMENT";
  fileUrl: string; // Or whatever field holds the download link
}

// This represents an announcement.
export interface AnnouncementMaterial extends BaseMaterial {
  type: "ANNOUNCEMENT";
}

// =================================================================
// --- ACTIVITY-RELATED TYPES (THE FIX IS HERE) ---
// =================================================================

// This is a base for all activities, containing shared fields like marks and due dates.
interface BaseActivityMaterial extends BaseMaterial {
  type: "ACTIVITY";
  activityType: "QUIZ" | "ASSIGNMENT"; // The activity can be one of these
  maxMarks: number;
  passMark: number;
  weight: number;
  endDate: string | null;
}

// This represents a Quiz. It has all the fields of a BaseActivityMaterial, plus quiz-specific ones.
export interface QuizMaterial extends BaseActivityMaterial {
  activityType: "QUIZ"; // This narrows the type down to 'QUIZ'
  timeLimit: string | null;
  maxAttempts: number;
  shuffleQuestions: boolean;
}

// --- THIS IS THE NEW TYPE WE ARE ADDING ---
// This represents an Assignment. It has all the fields of a BaseActivityMaterial, plus assignment-specific ones.
export interface AssignmentMaterial extends BaseActivityMaterial {
  activityType: "ASSIGNMENT"; // This narrows the type down to 'ASSIGNMENT'
  instruction: string;
  allowedFileTypes: string;
  maxFileSize: number;
  maxFileCount: number;
}

// =================================================================
// --- FINAL UNION TYPE ---
// =================================================================

// A "union" type. A Material object can be one of these specific types.
// We've now included AssignmentMaterial in the list.
export type Material =
  | QuizMaterial
  | DocumentMaterial
  | AnnouncementMaterial
  | AssignmentMaterial;
