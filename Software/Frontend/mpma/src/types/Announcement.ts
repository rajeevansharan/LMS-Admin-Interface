export interface Announcement {
  materialId: number;
  title: string;
  description: string;
  uploadDate: string;
  visible: boolean;
  courseId: number;
  courseName?: string;
  uploaderId?: number;
  uploaderName?: string;
}

export interface AnnouncementCreate {
  title: string;
  description: string;
  visible: boolean;
  courseId: number;
}
