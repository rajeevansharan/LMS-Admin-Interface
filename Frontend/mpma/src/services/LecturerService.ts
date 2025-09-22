import { Lecturer } from "@/types/Lecturer";

// ! API configuration for lecturer endpoints
// ! Ensures consistent API URL handling across environments
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ! Service for managing lecturer-related API operations
// ! Provides profile management functionality
export const LecturerService = {
  /**
   * Get lecturer profile information by ID
   * @param id - The ID of the lecturer
   * @param token - Authentication token
   * @returns Promise with lecturer details including parsed areas of interest
   */
  getLecturerById: async (id: number, token: string): Promise<Lecturer> => {
    const response = await fetch(`${API_URL}/api/lecturers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch lecturer profile: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Parse areas of interest from CSV string to array
    return {
      ...data,
      areasOfInterest: data.areasOfInterest
        ? data.areasOfInterest.split(",").map((area: string) => area.trim())
        : [],
    };
  },

  /**
   * Get profile information for currently authenticated lecturer
   * @param token - Authentication token
   * @returns Promise with current lecturer's profile
   */
  getCurrentLecturerProfile: async (token: string): Promise<Lecturer> => {
    // Extract username from token to get current user (not currently implemented in backend)
    const response = await fetch(`${API_URL}/api/lecturers/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch lecturer profile: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Parse areas of interest from CSV string to array
    return {
      ...data,
      areasOfInterest: data.areasOfInterest
        ? data.areasOfInterest.split(",").map((area: string) => area.trim())
        : [],
    };
  },

  /**
   * Update lecturer profile information
   * @param id - The ID of the lecturer to update
   * @param lecturerData - Updated lecturer profile data
   * @param token - Authentication token
   * @returns Promise with updated lecturer details
   */
  updateLecturerProfile: async (
    id: number,
    lecturerData: Partial<Lecturer>,
    token: string,
  ): Promise<Lecturer> => {
    // First, get the full current lecturer data to ensure we have all fields
    const currentData = await LecturerService.getLecturerById(id, token);

    // Convert areas of interest from array to CSV string if it exists
    const dataToSend = {
      ...currentData, // Include all current data as the base
      ...lecturerData, // Override with updated fields
      areasOfInterest: Array.isArray(lecturerData.areasOfInterest)
        ? lecturerData.areasOfInterest.join(",")
        : lecturerData.areasOfInterest || currentData.areasOfInterest,
    };

    console.log("Sending profile update with data:", dataToSend);

    const response = await fetch(`${API_URL}/api/lecturers/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Profile update error response:", errorText);
      throw new Error(
        `Failed to update lecturer profile: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Parse areas of interest from CSV string to array in response
    return {
      ...data,
      areasOfInterest: data.areasOfInterest
        ? data.areasOfInterest.split(",").map((area: string) => area.trim())
        : [],
    };
  },
};
