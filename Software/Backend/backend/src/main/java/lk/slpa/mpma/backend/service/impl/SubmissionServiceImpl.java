package lk.slpa.mpma.backend.service.impl;

import jakarta.transaction.Transactional;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import lk.slpa.mpma.backend.dto.GradeSubmissionRequestDTO;
import lk.slpa.mpma.backend.dto.QuestionReviewDTO;
import lk.slpa.mpma.backend.dto.QuizAttemptDetailDTO;
import lk.slpa.mpma.backend.dto.SubmissionDTO;
import lk.slpa.mpma.backend.exception.ResourceNotFoundException;
import lk.slpa.mpma.backend.model.*;
import lk.slpa.mpma.backend.repository.*;
import lk.slpa.mpma.backend.service.SubmissionService;
import lk.slpa.mpma.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {

  private final SubmissionRepository submissionRepository;
  private final PersonRepository personRepository;
  private final AssignmentRepository assignmentRepository;
  private final QuizRepository quizRepository;
  private final StudentResponseRepository studentResponseRepository;
  private final AzureBlobFileStorageServiceImpl azureFileStorageService;

  @Override
  @Transactional
  public SubmissionDTO createSubmission(Long assignmentId, MultipartFile file) throws IOException {
    String username = SecurityUtil.getCurrentUsername()
            .orElseThrow(() -> new IllegalStateException("User not authenticated."));
    Person person = personRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + username));
    Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));
    String courseIdStr = String.valueOf(assignment.getCourse().getCourseId());
    String filePath = azureFileStorageService.storeFile(file, courseIdStr);
    Submission submission = new Submission();
    submission.setStudentId(String.valueOf(person.getPersonId()));
    submission.setActivityId(String.valueOf(assignment.getMaterialId()));
    submission.setFilePath(filePath);
    submission.setSubmissionDate(new Date());
    submission.setStatus(Submission.SubmissionStatus.SUBMITTED);
    Submission savedSubmission = submissionRepository.save(submission);
    return convertToDTO(savedSubmission);
  }

  @Override
  public List<SubmissionDTO> getSubmissionsByActivityId(String activityId) {
    // =========== THIS LINE IS NOW CORRECTED =================
    // It now calls the correct repository method.
    List<Submission> submissions = submissionRepository.findByActivityId(activityId);
    // ========================================================
    return submissions.stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  // The rest of your file remains the same...
  private SubmissionDTO convertToDTO(Submission submission) {
    Person student = personRepository.findById(Long.parseLong(submission.getStudentId()))
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + submission.getStudentId()));
    return new SubmissionDTO(
            submission.getSubmissionId(),
            submission.getStudentId(),
            student.getName(),
            submission.getSubmissionDate(),
            submission.getFilePath(),
            submission.getStatus(),
            submission.getMarksObtained(),
            submission.getFeedback());
  }

  @Override
  @Transactional
  public SubmissionDTO gradeSubmission(Long submissionId, GradeSubmissionRequestDTO gradeRequest, Person grader) {
    Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionId));
    submission.setMarksObtained(gradeRequest.getMarksObtained());
    submission.setFeedback(gradeRequest.getFeedback());
    submission.setStatus(Submission.SubmissionStatus.GRADED);
    submission.setGradedBy(grader.getPersonId());
    submission.setGradingDate(new Date());
    Submission updatedSubmission = submissionRepository.save(submission);
    return convertToDTO(updatedSubmission);
  }

  @Override
  @Transactional
  public QuizAttemptDetailDTO getQuizAttemptDetails(Long submissionId) {
    // 1. Fetch the main entities
    Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionId));

    Quiz quiz = quizRepository.findById(Long.parseLong(submission.getActivityId()))
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found for submission: " + submissionId));

    Person student = personRepository.findById(Long.parseLong(submission.getStudentId()))
            .orElseThrow(() -> new ResourceNotFoundException("Student not found for submission: " + submissionId));

    // 2. Fetch all questions for the quiz and all student responses for the submission
    // NOTE: The relation is on quiz.getMaterialId() which is correct for Material -> Quiz relationship
    List<Question> questions = quiz.getQuestions().stream().toList();
    List<StudentResponse> studentResponses = studentResponseRepository.findBySubmissionSubmissionId(submissionId);

    // 3. Create a map for easy lookup of a student's response by question ID
    Map<Long, StudentResponse> responseMap = studentResponses.stream()
            .collect(Collectors.toMap(StudentResponse::getQuestionId, r -> r));

    // 4. Build the review DTO for each question
    List<QuestionReviewDTO> questionReviews = new ArrayList<>();
    for (Question question : questions) {
      StudentResponse response = responseMap.get(question.getId());

      String studentAnswerText = "Not Answered";
      String correctAnswerText = "N/A";
      boolean isCorrect = false;
      double marksObtained = 0.0;

      if (response != null) {
        studentAnswerText = response.getResponseContent();
        // We'll determine correctness and marks based on the question type
        marksObtained = (response.getMarksObtained() != null) ? response.getMarksObtained() : 0.0;
      }

      // Determine correct answer text and correctness based on question type
      if (question instanceof SingleChoiceQuestion scq) {
        correctAnswerText = (scq.getCorrectOption() != null) ? scq.getCorrectOption().getOptionText() : "Not defined";
        if(response != null) isCorrect = Objects.equals(studentAnswerText, correctAnswerText);
      }
      else if (question instanceof TrueFalseQuestion tfq) {
        correctAnswerText = tfq.getCorrectAnswer().toString();
        if(response != null) isCorrect = Objects.equals(Boolean.valueOf(studentAnswerText), tfq.getCorrectAnswer());
      }
      else if (question instanceof ShortAnswerQuestion saq) {
        correctAnswerText = saq.getCorrectAnswer();
        if(response != null) {
          isCorrect = saq.getCaseSensitive()
                  ? studentAnswerText.equals(correctAnswerText)
                  : studentAnswerText.equalsIgnoreCase(correctAnswerText);
        }
      }
      // TODO: You can add an 'else if' block for MultipleChoiceQuestion if needed.
      // It would involve checking if the set of student answers matches the set of correct options.

      questionReviews.add(QuestionReviewDTO.builder()
              .questionId(question.getId()) // Use getId() from Question
              .questionText(question.getQuestionText())
              .studentAnswer(studentAnswerText)
              .correctAnswer(correctAnswerText)
              .isCorrect(isCorrect)
              .marksObtained(marksObtained)
              .build());
    }

    // 5. Build the final DTO with the populated questions list
    return QuizAttemptDetailDTO.builder()
            .studentName(student.getName())
            .quizTitle(quiz.getTitle())
            .totalMarks(submission.getMarksObtained() != null ? submission.getMarksObtained() : 0.0)
            .questions(questionReviews) // This now sends the list instead of null
            .build();
  }


  @Override
  public Resource getSubmissionFile(Long submissionId) throws IOException {
    Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Submission not found with ID: " + submissionId));
    if (submission.getFilePath() == null || submission.getFilePath().isEmpty()) {
      throw new ResourceNotFoundException("No file associated with submission ID: " + submissionId);
    }
    return azureFileStorageService.loadFileAsResource(submission.getFilePath());
  }
}