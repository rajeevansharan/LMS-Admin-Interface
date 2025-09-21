package lk.slpa.mpma.backend.service.impl;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lk.slpa.mpma.backend.dto.QuestionDTO;
import lk.slpa.mpma.backend.model.Course;
import lk.slpa.mpma.backend.model.EssayQuestion;
import lk.slpa.mpma.backend.model.MultipleChoiceQuestion;
import lk.slpa.mpma.backend.model.Question;
import lk.slpa.mpma.backend.model.QuestionOption;
import lk.slpa.mpma.backend.model.QuestionType;
import lk.slpa.mpma.backend.model.ShortAnswerQuestion;
import lk.slpa.mpma.backend.model.SingleChoiceQuestion;
import lk.slpa.mpma.backend.model.TrueFalseQuestion;
import lk.slpa.mpma.backend.repository.CourseRepository;
import lk.slpa.mpma.backend.repository.QuestionRepository;
import lk.slpa.mpma.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of the QuestionService interface for managing question operations.
 *
 * <p>This service handles the business logic for creating and retrieving questions of various
 * types. It supports polymorphic question creation by instantiating the appropriate question
 * subtype based on the QuestionType specified in the DTO.
 */
@Service
public class QuestionServiceImpl implements QuestionService {

  @Autowired private QuestionRepository questionRepository;

  @Autowired private CourseRepository courseRepository;

  /**
   * Creates a new question based on the provided DTO.
   *
   * <p>This method instantiates the appropriate question subtype based on the questionType in the
   * DTO. It then populates the common fields from the base Question class and specific fields for
   * each question type.
   *
   * @param questionDTO The question data to create
   * @return The created question as a DTO with generated ID
   * @throws IllegalArgumentException if the question type is not supported
   * @throws EntityNotFoundException if the referenced course does not exist
   */
  @Override
  @Transactional
  public QuestionDTO createQuestion(QuestionDTO questionDTO) {
    Question question;
    switch (questionDTO.getQuestionType()) {
      case TRUE_FALSE:
        TrueFalseQuestion tfQuestion = new TrueFalseQuestion();
        tfQuestion.setCorrectAnswer(questionDTO.getCorrectAnswerTF());
        question = tfQuestion;
        break;
      case SINGLE_CHOICE:
        SingleChoiceQuestion scQuestion = new SingleChoiceQuestion();
        if (questionDTO.getOptionsSCMC() != null) {
          List<QuestionOption> options =
              questionDTO.getOptionsSCMC().stream()
                  .map(
                      optText -> {
                        QuestionOption qOpt = new QuestionOption();
                        qOpt.setOptionText(optText);
                        qOpt.setQuestion(scQuestion);
                        return qOpt;
                      })
                  .collect(Collectors.toList());
          scQuestion.setOptions(options);
          // Only set correct option if index is provided and valid
          if (questionDTO.getCorrectOptionIndexSC() != null
              && questionDTO.getCorrectOptionIndexSC() < options.size()) {
            scQuestion.setCorrectOption(options.get(questionDTO.getCorrectOptionIndexSC()));
          } else {
            // Explicitly set to null to ensure proper database update
            scQuestion.setCorrectOption(null);
          }
        }
        question = scQuestion;
        break;
      case MULTIPLE_CHOICE:
        MultipleChoiceQuestion mcQuestion = new MultipleChoiceQuestion();
        if (questionDTO.getOptionsSCMC() != null) {
          List<QuestionOption> options =
              questionDTO.getOptionsSCMC().stream()
                  .map(
                      optText -> {
                        QuestionOption qOpt = new QuestionOption();
                        qOpt.setOptionText(optText);
                        qOpt.setQuestion(mcQuestion);
                        return qOpt;
                      })
                  .collect(Collectors.toList());
          mcQuestion.setOptions(options);
          if (questionDTO.getCorrectOptionIndicesMC() != null) {
            Set<QuestionOption> correctOptions =
                questionDTO.getCorrectOptionIndicesMC().stream()
                    .filter(index -> index < options.size())
                    .map(options::get)
                    .collect(Collectors.toSet());
            mcQuestion.setCorrectOptions(correctOptions);
          }
        }
        question = mcQuestion;
        break;
      case SHORT_ANSWER:
        ShortAnswerQuestion saQuestion = new ShortAnswerQuestion();
        saQuestion.setCorrectAnswer(questionDTO.getCorrectAnswerSA());
        saQuestion.setCaseSensitive(
            questionDTO.getCaseSensitiveSA() != null ? questionDTO.getCaseSensitiveSA() : false);
        question = saQuestion;
        break;
      case ESSAY:
        EssayQuestion esQuestion = new EssayQuestion();
        esQuestion.setAnswerGuidelines(questionDTO.getAnswerGuidelinesES());
        esQuestion.setWordLimit(questionDTO.getWordLimitES());
        question = esQuestion;
        break;
      default:
        throw new IllegalArgumentException(
            "Unsupported question type: " + questionDTO.getQuestionType());
    }

    question.setQuestionText(questionDTO.getQuestionText());
    question.setDifficultyLevel(questionDTO.getDifficultyLevel());
    question.setMarks(questionDTO.getMarks());
    question.setQuestionType(questionDTO.getQuestionType());
    // Ensure correctOptionIndexSC is set for all question types
    if (questionDTO.getQuestionType() == lk.slpa.mpma.backend.model.QuestionType.SINGLE_CHOICE) {
      question.setCorrectOptionIndexSC(questionDTO.getCorrectOptionIndexSC());
    } else {
      // For other types, set a default/dummy value if the column is NOT NULL
      question.setCorrectOptionIndexSC(0); // Or any other appropriate default
    }

    if (questionDTO.getCourseId() != null) {
      Course course =
          courseRepository
              .findById(questionDTO.getCourseId())
              .orElseThrow(
                  () ->
                      new EntityNotFoundException(
                          "Course not found with id: " + questionDTO.getCourseId()));
      question.setCourse(course);
    }

    Question savedQuestion = questionRepository.save(question);
    return convertToDTO(savedQuestion);
  }

  /**
   * Retrieves a question by its unique identifier.
   *
   * @param id The question ID
   * @return The question DTO
   * @throws EntityNotFoundException if no question with the given ID exists
   */
  @Override
  @Transactional(readOnly = true)
  public QuestionDTO getQuestionById(Long id) {
    Question question =
        questionRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));
    return convertToDTO(question);
  }

  /**
   * Retrieves all questions in the system.
   *
   * @return A list of all question DTOs
   */
  @Override
  @Transactional(readOnly = true)
  public List<QuestionDTO> getAllQuestions() {
    return questionRepository.findAll().stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  /**
   * Retrieves all questions associated with a specific course.
   *
   * @param courseId The course ID
   * @return A list of question DTOs for the given course
   * @throws EntityNotFoundException if no course with the given ID exists
   */
  @Override
  @Transactional(readOnly = true)
  public List<QuestionDTO> getQuestionsByCourseId(Long courseId) {
    // First, check if the course exists
    courseRepository
        .findById(courseId)
        .orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + courseId));

    return questionRepository.findByCourse_CourseId(courseId).stream() // Changed method name here
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  /**
   * Retrieves all questions available to a specific lecturer.
   *
   * @param lecturerId The ID of the lecturer
   * @return A list of question DTOs available to the lecturer
   */
  @Override
  @Transactional(readOnly = true)
  public List<QuestionDTO> getQuestionsByLecturerId(Long lecturerId) {
    return questionRepository.findAllQuestionsForLecturer(lecturerId).stream()
        .map(result -> (Question) result[0]) // Extract Question from Object[]
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  /**
   * Retrieves all questions from the global question bank.
   *
   * @return A list of question DTOs not tied to any course
   */
  @Override
  @Transactional(readOnly = true)
  public List<QuestionDTO> getGlobalQuestions() {
    return questionRepository.findByCourseIsNull().stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  /**
   * Deletes a question by its unique identifier.
   *
   * @param id The question ID to delete
   * @return true if the question was successfully deleted, false otherwise
   * @throws EntityNotFoundException if no question with the given ID exists
   */
  @Override
  @Transactional
  public boolean deleteQuestion(Long id) {
    if (!questionRepository.existsById(id)) {
      throw new EntityNotFoundException("Question not found with id: " + id);
    }

    try {
      questionRepository.deleteById(id);
      return true;
    } catch (Exception e) {
      // Log the exception
      System.err.println("Error deleting question with id " + id + ": " + e.getMessage());
      return false;
    }
  }

  /**
   * Converts a Question entity to its corresponding DTO representation.
   *
   * <p>This method handles the polymorphic nature of question entities by determining the concrete
   * question type and populating the appropriate type-specific fields in the DTO.
   *
   * @param question The question entity to convert
   * @return The question data transfer object with all relevant fields populated
   */
  private QuestionDTO convertToDTO(Question question) {
    QuestionDTO dto = new QuestionDTO();
    dto.setId(question.getId());
    dto.setQuestionText(question.getQuestionText());
    dto.setQuestionType(question.getQuestionType());
    dto.setDifficultyLevel(question.getDifficultyLevel());
    dto.setMarks(question.getMarks());

    // Set timestamp fields
    if (question.getCreatedAt() != null) {
      dto.setCreatedAt(question.getCreatedAt().toString());
    }
    if (question.getUpdatedAt() != null) {
      dto.setUpdatedAt(question.getUpdatedAt().toString());
    }

    if (question.getCourse() != null) {
      dto.setCourseId(question.getCourse().getCourseId());
    }

    switch (question.getQuestionType()) {
      case TRUE_FALSE:
        TrueFalseQuestion tfQuestion = (TrueFalseQuestion) question;
        dto.setCorrectAnswerTF(tfQuestion.getCorrectAnswer());
        break;
      case SINGLE_CHOICE:
        SingleChoiceQuestion scQuestion = (SingleChoiceQuestion) question;
        if (scQuestion.getOptions() != null) {
          dto.setOptionsSCMC(
              scQuestion.getOptions().stream()
                  .map(QuestionOption::getOptionText)
                  .collect(Collectors.toList()));
          if (scQuestion.getCorrectOption() != null) {
            int correctIndex = -1;
            for (int i = 0; i < scQuestion.getOptions().size(); i++) {
              if (scQuestion
                  .getOptions()
                  .get(i)
                  .getId()
                  .equals(scQuestion.getCorrectOption().getId())) {
                correctIndex = i;
                break;
              }
            }
            dto.setCorrectOptionIndexSC(correctIndex);
          }
        }
        break;
      case MULTIPLE_CHOICE:
        MultipleChoiceQuestion mcQuestion = (MultipleChoiceQuestion) question;
        if (mcQuestion.getOptions() != null) {
          dto.setOptionsSCMC(
              mcQuestion.getOptions().stream()
                  .map(QuestionOption::getOptionText)
                  .collect(Collectors.toList()));
          if (mcQuestion.getCorrectOptions() != null) {
            List<Integer> correctIndices =
                mcQuestion.getCorrectOptions().stream()
                    .map(
                        correctOpt -> {
                          for (int i = 0; i < mcQuestion.getOptions().size(); i++) {
                            if (mcQuestion.getOptions().get(i).getId().equals(correctOpt.getId())) {
                              return i;
                            }
                          }
                          return -1;
                        })
                    .filter(index -> index != -1)
                    .collect(Collectors.toList());
            dto.setCorrectOptionIndicesMC(correctIndices);
          }
        }
        break;
      case SHORT_ANSWER:
        ShortAnswerQuestion saQuestion = (ShortAnswerQuestion) question;
        dto.setCorrectAnswerSA(saQuestion.getCorrectAnswer());
        dto.setCaseSensitiveSA(saQuestion.getCaseSensitive());
        break;
      case ESSAY:
        EssayQuestion esQuestion = (EssayQuestion) question;
        dto.setAnswerGuidelinesES(esQuestion.getAnswerGuidelines());
        dto.setWordLimitES(esQuestion.getWordLimit());
        break;
    }
    return dto;
  }

  /**
   * Retrieves all questions of a specific type.
   *
   * @param questionType The type of questions to retrieve
   * @return A list of question DTOs of the specified type
   */
  @Override
  @Transactional(readOnly = true)
  public List<QuestionDTO> getQuestionsByType(QuestionType questionType) {
    return questionRepository.findAll().stream()
        .filter(q -> q.getQuestionType() == questionType)
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  /**
   * Retrieves all questions of a specific type available to a lecturer.
   *
   * @param lecturerId The lecturer ID
   * @param questionType The type of questions to retrieve
   * @return A list of question DTOs of the specified type available to the lecturer
   */
  @Override
  @Transactional(readOnly = true)
  public List<QuestionDTO> getQuestionsByLecturerIdAndType(
      Long lecturerId, QuestionType questionType) {
    return questionRepository.findAllQuestionsForLecturer(lecturerId).stream()
        .map(result -> (Question) result[0]) // Extract Question from Object[]
        .filter(q -> q.getQuestionType() == questionType)
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  /**
   * Updates an existing question.
   *
   * @param id The ID of the question to update
   * @param questionDTO The updated question data
   * @return The updated question as a DTO
   * @throws EntityNotFoundException if no question with the given ID exists
   * @throws IllegalArgumentException if trying to change question type
   */
  @Override
  @Transactional
  public QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO) {
    Question question =
        questionRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));

    // Verify question types match
    if (question.getQuestionType() != questionDTO.getQuestionType()) {
      throw new IllegalArgumentException("Cannot change question type during update");
    }

    // Update common fields
    question.setQuestionText(questionDTO.getQuestionText());
    question.setDifficultyLevel(questionDTO.getDifficultyLevel());
    question.setMarks(questionDTO.getMarks());

    // Update type-specific fields based on question type
    switch (question.getQuestionType()) {
      case TRUE_FALSE:
        TrueFalseQuestion tfQuestion = (TrueFalseQuestion) question;
        tfQuestion.setCorrectAnswer(questionDTO.getCorrectAnswerTF());
        break;

      case SINGLE_CHOICE:
        SingleChoiceQuestion scQuestion = (SingleChoiceQuestion) question;
        if (questionDTO.getOptionsSCMC() != null) {
          // Manage the existing collection
          scQuestion.getOptions().clear(); // Clear existing options

          List<QuestionOption> newOptions =
              questionDTO.getOptionsSCMC().stream()
                  .map(
                      optText -> {
                        QuestionOption qOpt = new QuestionOption();
                        qOpt.setOptionText(optText);
                        qOpt.setQuestion(scQuestion); // Associate with the parent question
                        return qOpt;
                      })
                  .collect(Collectors.toList());
          scQuestion.getOptions().addAll(newOptions); // Add new options to the managed collection

          if (questionDTO.getCorrectOptionIndexSC() != null
              && questionDTO.getCorrectOptionIndexSC() < scQuestion.getOptions().size()) {
            scQuestion.setCorrectOption(
                scQuestion.getOptions().get(questionDTO.getCorrectOptionIndexSC()));
          } else {
            scQuestion.setCorrectOption(null);
          }
        } else { // If DTO has no options, clear existing ones
          scQuestion.getOptions().clear();
          scQuestion.setCorrectOption(null);
        }
        break;

      case MULTIPLE_CHOICE:
        MultipleChoiceQuestion mcQuestion = (MultipleChoiceQuestion) question;
        if (questionDTO.getOptionsSCMC() != null) {
          // Manage the existing collection
          mcQuestion.getOptions().clear(); // Clear existing options

          List<QuestionOption> newOptions =
              questionDTO.getOptionsSCMC().stream()
                  .map(
                      optText -> {
                        QuestionOption qOpt = new QuestionOption();
                        qOpt.setOptionText(optText);
                        qOpt.setQuestion(mcQuestion); // Associate with the parent question
                        return qOpt;
                      })
                  .collect(Collectors.toList());
          mcQuestion.getOptions().addAll(newOptions); // Add new options to the managed collection

          if (questionDTO.getCorrectOptionIndicesMC() != null) {
            Set<QuestionOption> correctOptions =
                questionDTO.getCorrectOptionIndicesMC().stream()
                    .filter(index -> index >= 0 && index < mcQuestion.getOptions().size())
                    .map(index -> mcQuestion.getOptions().get(index))
                    .collect(Collectors.toSet());
            mcQuestion.setCorrectOptions(correctOptions);
          } else {
            mcQuestion.setCorrectOptions(null); // Or an empty set, depending on your logic
          }
        } else { // If DTO has no options, clear existing ones
          mcQuestion.getOptions().clear();
          mcQuestion.setCorrectOptions(null); // Or an empty set
        }
        break;

      case SHORT_ANSWER:
        ShortAnswerQuestion saQuestion = (ShortAnswerQuestion) question;
        saQuestion.setCorrectAnswer(questionDTO.getCorrectAnswerSA());
        saQuestion.setCaseSensitive(
            questionDTO.getCaseSensitiveSA() != null ? questionDTO.getCaseSensitiveSA() : false);
        break;

      case ESSAY:
        EssayQuestion esQuestion = (EssayQuestion) question;
        esQuestion.setAnswerGuidelines(questionDTO.getAnswerGuidelinesES());
        esQuestion.setWordLimit(questionDTO.getWordLimitES());
        break;

      default:
        throw new IllegalArgumentException(
            "Unsupported question type: " + questionDTO.getQuestionType());
    }

    // Update course if provided
    if (questionDTO.getCourseId() != null) {
      Course course =
          courseRepository
              .findById(questionDTO.getCourseId())
              .orElseThrow(
                  () ->
                      new EntityNotFoundException(
                          "Course not found with id: " + questionDTO.getCourseId()));
      question.setCourse(course);
    } else {
      question.setCourse(null);
    }

    Question updatedQuestion = questionRepository.save(question);
    return convertToDTO(updatedQuestion);
  }
}
