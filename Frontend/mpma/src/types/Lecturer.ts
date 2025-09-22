/**
 * Interface representing a lecturer in the system
 * Mirrors the backend Lecturer entity structure
 */
export interface Lecturer {
  personId: number;
  username: string;
  name: string;
  dateOfBirth?: string;
  address?: string;
  department?: string;
  phoneNumber?: string;
  email?: string;
  profilePicture?: string;
  areasOfInterest?: string[]; // Stored as CSV in backend, array in frontend
}

/**
 * Interface for lecturer profile update operations
 * Contains only the fields that can be updated
 */
export interface LecturerProfileUpdate {
  email?: string;
  phoneNumber?: string;
  address?: string;
  department?: string;
  areasOfInterest?: string[];
}
