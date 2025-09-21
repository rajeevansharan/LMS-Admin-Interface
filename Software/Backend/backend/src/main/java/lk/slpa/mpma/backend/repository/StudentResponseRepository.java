package lk.slpa.mpma.backend.repository;

import java.util.List;
import java.util.Optional;
import lk.slpa.mpma.backend.model.StudentResponse;
import lk.slpa.mpma.backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentResponseRepository extends JpaRepository<StudentResponse, Long> {
  // Find a single response for a student and a question
  Optional<StudentResponse> findByStudentIdAndQuestionId(Long studentId, Long questionId);

  // Find all responses for a specific submission (attempt)
  List<StudentResponse> findBySubmission(Submission submission);

  List<StudentResponse> findBySubmissionSubmissionId(Long submissionId);
}
