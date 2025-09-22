import { Lecture } from "./Lecture"; // Assuming you have a Lecture type
import { Material } from "./Material"; // We import our new master Material type

export interface Course {
  courseId: number;
  name: string;
  startDate: string;
  endDate?: string;
  lecturers?: {
    personId: number;
    name?: string;
    department?: string;
  }[];

  materials: Material[];
  lectures: Lecture[];
}
