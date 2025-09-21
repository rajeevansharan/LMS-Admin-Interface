/**
 * Interface representing a student participant in a course
 */
export interface StudentParticipant {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string; // Date will be serialized as string in JSON
  address: string;
  role: string;
}
