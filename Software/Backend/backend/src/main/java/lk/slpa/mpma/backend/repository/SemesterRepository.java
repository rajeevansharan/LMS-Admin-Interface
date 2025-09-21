package lk.slpa.mpma.backend.repository;

import java.util.Optional;
import lk.slpa.mpma.backend.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, String> {
  Optional<Semester> findBySemesterId(String semesterId);

  Optional<Semester> findBySemesterIdAndAcademicYear(String semesterId, String academicYear);
}
