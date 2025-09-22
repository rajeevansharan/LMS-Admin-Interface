import { Announcement, AnnouncementCreate } from "@/types/Announcement";

// ! API base URL configuration from environment or fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ! Service for handling announcement-related API operations
// ! Critical for course communication and notifications
export const AnnouncementService = {
  /**
   * Get all announcements by course ID
   * @param courseId - The ID of the course
   * @param token - Authentication token
   * @returns Promise with array of announcements
   */
  // * Fetches all announcements for a specific course
  // * Used in course dashboards to display announcements to students and faculty
  getAnnouncementsByCourseId: async (
    courseId: number,
    token: string,
  ): Promise<Announcement[]> => {
    const response = await fetch(
      `${API_URL}/api/announcements/course/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch announcements: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  /**
   * Get announcement by ID
   * @param announcementId - The ID of the announcement
   * @param token - Authentication token
   * @returns Promise with announcement details
   */
  // * Retrieves detailed information for a specific announcement
  // * Used when viewing individual announcement content and details
  getAnnouncementById: async (
    announcementId: number,
    token: string,
  ): Promise<Announcement> => {
    const response = await fetch(
      `${API_URL}/api/announcements/${announcementId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch announcement: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  /**
   * Create new announcement
   * @param courseId - The ID of the course
   * @param announcement - The announcement data to create
   * @param token - Authentication token
   * @returns Promise with created announcement
   */
  // * Creates a new announcement in the system
  // * Used by faculty to publish important information to students
  createAnnouncement: async (
    courseId: number,
    announcement: AnnouncementCreate,
    token: string,
  ): Promise<Announcement> => {
    const response = await fetch(`${API_URL}/api/announcements`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...announcement,
        courseId: courseId,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Create announcement error:", errorBody);
      throw new Error(
        `Failed to create announcement: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  /**
   * Update an existing announcement
   * @param announcementId - The ID of the announcement to update
   * @param announcement - The updated announcement data
   * @param token - Authentication token
   * @returns Promise with updated announcement
   */
  // * Updates an existing announcement with new content or metadata
  // * Allows faculty to correct or update previously published information
  updateAnnouncement: async (
    announcementId: number,
    announcement: AnnouncementCreate,
    token: string,
  ): Promise<Announcement> => {
    const response = await fetch(
      `${API_URL}/api/announcements/${announcementId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(announcement),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update announcement: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  /**
   * Delete an announcement
   * @param announcementId - The ID of the announcement to delete
   * @param token - Authentication token
   */
  // * Permanently removes an announcement from the system
  // * Used when content is no longer relevant or needed
  deleteAnnouncement: async (
    announcementId: number,
    token: string,
  ): Promise<void> => {
    const response = await fetch(
      `${API_URL}/api/announcements/${announcementId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to delete announcement: ${response.status} ${response.statusText}`,
      );
    }
  },

  /**
   * Toggle announcement visibility
   * @param announcementId - The ID of the announcement
   * @param token - Authentication token
   * @returns Promise with updated announcement
   */
  // * Changes visibility status of an announcement (published/unpublished)
  // * Allows faculty to prepare announcements before making them visible
  toggleVisibility: async (
    announcementId: number,
    token: string,
  ): Promise<Announcement> => {
    const response = await fetch(
      `${API_URL}/api/announcements/${announcementId}/toggle-visibility`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to toggle announcement visibility: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  // * Alias for backward compatibility
  toggleAnnouncementVisibility: async (
    announcementId: number,
    token: string,
  ): Promise<Announcement> => {
    const response = await fetch(
      `${API_URL}/api/announcements/${announcementId}/toggle-visibility`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to toggle announcement visibility: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  // TODO: Implement announcement prioritization system
  // TODO: Add support for targeted announcements to specific student groups
  // TODO: Integrate with notification system for push notifications
};
