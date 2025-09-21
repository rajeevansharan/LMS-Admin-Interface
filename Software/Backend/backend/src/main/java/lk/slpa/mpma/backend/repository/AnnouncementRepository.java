package lk.slpa.mpma.backend.repository;

import java.util.List;
import lk.slpa.mpma.backend.model.MaterialAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepository extends JpaRepository<MaterialAnnouncement, Long> {
  // Find announcements by course ID
  List<MaterialAnnouncement> findByCourse_CourseId(Long courseId);

  // Find visible announcements by course ID
  List<MaterialAnnouncement> findByCourse_CourseIdAndVisible(Long courseId, boolean visible);

  // Find announcements by creator ID (lecturer)
  List<MaterialAnnouncement> findByCreator_PersonId(Long creatorId);
}
