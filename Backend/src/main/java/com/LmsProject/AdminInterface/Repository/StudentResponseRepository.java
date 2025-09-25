package com.LmsProject.AdminInterface.Repository;

import java.util.List;
import java.util.Optional;

import com.LmsProject.AdminInterface.Model.StudentResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentResponseRepository extends JpaRepository<StudentResponse, Long> {
  // Find a single response for a student and a question
  Optional<StudentResponse> findByStudentIdAndQuestionId(Long studentId, Long questionId);


  List<StudentResponse> findBySubmissionSubmissionId(Long submissionId);
}
