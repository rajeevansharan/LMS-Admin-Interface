package lk.slpa.mpma.backend.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lk.slpa.mpma.backend.dto.QuestionReviewDTO;
import lk.slpa.mpma.backend.dto.QuizAttemptDetailDTO;
import lk.slpa.mpma.backend.dto.StudentCountDTO;
import lk.slpa.mpma.backend.dto.StudentDTO;
import lk.slpa.mpma.backend.exception.ResourceNotFoundException;
import lk.slpa.mpma.backend.model.Quiz;
import lk.slpa.mpma.backend.model.Student;
import lk.slpa.mpma.backend.model.StudentResponse;
import lk.slpa.mpma.backend.model.Submission;
import lk.slpa.mpma.backend.repository.QuizRepository;
import lk.slpa.mpma.backend.repository.StudentRepository;
import lk.slpa.mpma.backend.repository.StudentResponseRepository;
import lk.slpa.mpma.backend.repository.SubmissionRepository;
import lk.slpa.mpma.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of the StudentService interface.
 *
 * <p>This class provides the concrete implementation of all operations defined in the
 * StudentService interface, handling the business logic for student management and interacting with
 * the repository layer to perform data access operations.
 */
@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private StudentResponseRepository studentResponseRepository;

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByCourseId(Long courseId) {
        List<Student> students = studentRepository.findStudentsByCourseId(courseId);
        return students.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Converts a Student entity to a StudentDTO.
     *
     * @param student The student entity to convert
     * @return A StudentDTO representing the student
     */
    private StudentDTO convertToDTO(Student student) {
        return new StudentDTO(
                student.getPersonId(),
                student.getName(),
                student.getUsername(),
                student.getEmail(),
                student.getPhoneNumber(),
                student.getDateOfBirth(),
                student.getAddress(),
                student.getUserRole().name());
    }

    @Override
    public QuizAttemptDetailDTO getQuizAttemptDetails(Long submissionId) {
        // 1. Fetch the main submission record
        Submission submission =
                submissionRepository
                        .findById(submissionId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException("Submission not found with id: " + submissionId));

        // 2. Fetch the associated quiz
        Long quizId = Long.parseLong(submission.getActivityId());
        Quiz quiz =
                quizRepository
                        .findById(quizId)
                        .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        // 3. Fetch the student
        Long studentId = Long.parseLong(submission.getStudentId());
        Student student =
                studentRepository
                        .findById(studentId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // 4. Loop through each question in the quiz and build the DTO
        List<QuestionReviewDTO> questionReviews =
                quiz.getQuestions().stream()
                        .map(
                                question -> {
                                    // Find the student's specific answer for this question
                                    StudentResponse response =
                                            studentResponseRepository
                                                    .findByStudentIdAndQuestionId(studentId, question.getId())
                                                    .orElse(null); // It's possible the student didn't answer

                                    // This is a simplified logic block. A real one would be more complex.
                                    return QuestionReviewDTO.builder()
                                            .questionId(question.getId())
                                            .questionText(question.getQuestionText())
                                            .studentAnswer(response != null ? response.getResponseContent() : "No Answer")
                                            .correctAnswer("Correct answer logic to be implemented") // Placeholder
                                            .isCorrect(
                                                    response != null
                                                            && response.getAutoGraded() != null
                                                            && response.getAutoGraded())
                                            .marksObtained(
                                                    response != null && response.getMarksObtained() != null
                                                            ? response.getMarksObtained()
                                                            : 0)
                                            .build();
                                })
                        .collect(Collectors.toList());

        // 5. Build the final DTO
        return QuizAttemptDetailDTO.builder()
                .studentName(student.getName())
                .quizTitle(quiz.getTitle())
                .totalMarks(submission.getMarksObtained())
                .questions(questionReviews)
                .build();
    }

    // get student details by username
    @Override
    public Optional<Student> getStudentByUsername(String username) {
        return studentRepository.findByUsername(username);
    }

    public StudentCountDTO getTotalStudentCount() {
        long count = studentRepository.count();
        return new StudentCountDTO(count);
    }

    @Override
    @Transactional
    public Student updateStudent(StudentDTO studentDTO) {
        Student existingStudent = studentRepository.findById(studentDTO.getId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentDTO.getId()));

        // Update all fields except role
        existingStudent.setName(studentDTO.getName());
        existingStudent.setUsername(studentDTO.getUsername());
        existingStudent.setEmail(studentDTO.getEmail());
        existingStudent.setPhoneNumber(studentDTO.getPhoneNumber());
        existingStudent.setDateOfBirth(studentDTO.getDateOfBirth());
        existingStudent.setAddress(studentDTO.getAddress());

        return studentRepository.save(existingStudent);
    }

}
