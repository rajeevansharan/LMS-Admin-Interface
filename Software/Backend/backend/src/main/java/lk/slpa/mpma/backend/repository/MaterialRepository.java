package lk.slpa.mpma.backend.repository;

import java.util.List;
import lk.slpa.mpma.backend.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
  @Query("SELECT m FROM Material m WHERE m.course.courseId = :courseId AND m.type = :type")
  List<Material> findByCourseIdAndType(
      @Param("courseId") Long courseId, @Param("type") Material.MaterialType type);
}
