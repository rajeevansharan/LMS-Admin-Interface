package lk.slpa.mpma.backend.repository;

import lk.slpa.mpma.backend.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
  // JpaRepository already gives us findAll(), findById(), save(), delete(), etc.
  // We can add custom query methods here later if needed.
}
