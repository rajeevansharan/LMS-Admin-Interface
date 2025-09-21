package lk.slpa.mpma.backend.repository;

import java.util.List;
import java.util.Optional;
import lk.slpa.mpma.backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

  // The incorrect method "findByActivity_MaterialId" has been removed.

  /**
   * Finds all submissions for a specific activity.
   * THIS IS THE CORRECT METHOD that matches your Submission entity.
   *
   * @param activityId The ID of the activity (e.g., a quiz or assignment).
   * @return A list of submissions for that activity.
   */
  List<Submission> findByActivityId(String activityId);

  /**
   * Finds a specific submission by a student for a specific activity. This can be useful to check
   * if a student has already submitted.
   *
   * @param activityId The ID of the activity.
   * @param studentId The ID of the student.
   * @return An Optional containing the submission if found.
   */
  List<Submission> findByActivityIdAndStudentId(String activityId, String studentId);

}