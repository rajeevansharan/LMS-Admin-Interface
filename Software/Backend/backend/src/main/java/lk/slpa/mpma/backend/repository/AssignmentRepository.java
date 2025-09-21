package lk.slpa.mpma.backend.repository;

import lk.slpa.mpma.backend.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
  // JpaRepository gives us the .save() method for free!
}
