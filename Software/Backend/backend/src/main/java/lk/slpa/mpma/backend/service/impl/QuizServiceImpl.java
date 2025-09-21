// _FILEPATH: src/main/java/lk/slpa/mpma/backend/service/impl/QuizServiceImpl.java
package lk.slpa.mpma.backend.service.impl;

import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import lk.slpa.mpma.backend.dto.OptionDTO;
import lk.slpa.mpma.backend.dto.QuestionInfoDTO;
import lk.slpa.mpma.backend.dto.QuizCreateRequestDTO;
import lk.slpa.mpma.backend.dto.QuizDTO;
import lk.slpa.mpma.backend.exception.ResourceNotFoundException;
import lk.slpa.mpma.backend.model.*;
import lk.slpa.mpma.backend.repository.CourseRepository;
import lk.slpa.mpma.backend.repository.PersonRepository;
import lk.slpa.mpma.backend.repository.QuestionRepository;
import lk.slpa.mpma.backend.repository.QuizRepository;
import lk.slpa.mpma.backend.service.QuizService;
import lk.slpa.mpma.backend.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuizServiceImpl implements QuizService {

  @Autowired private QuizRepository quizRepository;
  @Autowired private QuestionRepository questionRepository;
  @Autowired private CourseRepository courseRepository;
  @Autowired private PersonRepository personRepository;

  @Override
  @Transactional
  public QuizDTO createQuiz(Long courseId, QuizCreateRequestDTO quizRequest) {
    Course course =
            courseRepository
                    .findById(courseId)
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Course not found with id: " + courseId));

    String username =
            SecurityUtil.getCurrentUsername()
                    .orElseThrow(() -> new IllegalStateException("Authentication context not found"));
    Person creator =
            personRepository
                    .findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

    Quiz quiz = new Quiz();

    quiz.setTitle(quizRequest.getTitle());
    quiz.setDescription(quizRequest.getDescription());
    quiz.setUploadDate(new Date());
    quiz.setVisible(quizRequest.getVisible());
    quiz.setCourse(course);
    quiz.setCreator(creator);
    quiz.setType(Material.MaterialType.ACTIVITY);
    quiz.setActivityType(Activity.ActivityType.QUIZ);
    quiz.setMaxMarks(quizRequest.getMaxMarks());
    quiz.setPassMark(quizRequest.getPassMark());
    quiz.setWeight(quizRequest.getWeight());
    quiz.setTimeLimit(quizRequest.getTimeLimit());
    quiz.setMaxAttempts(quizRequest.getMaxAttempts());
    quiz.setShuffleQuestions(quizRequest.getShuffleQuestions());

    if (quizRequest.getQuestionIds() != null && !quizRequest.getQuestionIds().isEmpty()) {
      List<Question> questions = questionRepository.findAllById(quizRequest.getQuestionIds());
      if (questions.size() != quizRequest.getQuestionIds().size()) {
        throw new ResourceNotFoundException(
                "One or more questions not found for the provided IDs.");
      }
      quiz.setQuestions(new HashSet<>(questions));
    }

    Quiz savedQuiz = quizRepository.save(quiz);
    return mapToQuizDTO(savedQuiz);
  }

  private QuizDTO mapToQuizDTO(Quiz quiz) {
    QuizDTO dto = new QuizDTO();
    dto.setId(quiz.getMaterialId());
    dto.setTitle(quiz.getTitle());
    dto.setDescription(quiz.getDescription());
    dto.setTimeLimit(quiz.getTimeLimit());
    dto.setMaxAttempts(quiz.getMaxAttempts());
    dto.setShuffleQuestions(quiz.getShuffleQuestions());
    return dto;
  }

  @Override
  @Transactional(readOnly = true) // Use readOnly for GET methods for better performance
  public QuizDTO getQuizById(Long quizId) {
    Quiz quiz =
            quizRepository
                    .findById(quizId)
                    .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
    return mapToQuizDTOWithQuestions(quiz);
  }

  @Override
  @Transactional
  public QuizDTO updateQuiz(Long quizId, QuizCreateRequestDTO quizRequest) {
    Quiz existingQuiz =
            quizRepository
                    .findById(quizId)
                    .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

    Course course =
            courseRepository
                    .findById(quizRequest.getCourseId())
                    .orElseThrow(
                            () ->
                                    new ResourceNotFoundException(
                                            "Course not found with id: " + quizRequest.getCourseId()));

    existingQuiz.setTitle(quizRequest.getTitle());
    existingQuiz.setDescription(quizRequest.getDescription());
    existingQuiz.setVisible(quizRequest.getVisible());
    existingQuiz.setCourse(course);
    existingQuiz.setMaxMarks(quizRequest.getMaxMarks());
    existingQuiz.setPassMark(quizRequest.getPassMark());
    existingQuiz.setWeight(quizRequest.getWeight());
    existingQuiz.setTimeLimit(quizRequest.getTimeLimit());
    existingQuiz.setMaxAttempts(quizRequest.getMaxAttempts());
    existingQuiz.setShuffleQuestions(quizRequest.getShuffleQuestions());

    if (quizRequest.getQuestionIds() != null && !quizRequest.getQuestionIds().isEmpty()) {
      List<Question> questions = questionRepository.findAllById(quizRequest.getQuestionIds());
      if (questions.size() != quizRequest.getQuestionIds().size()) {
        throw new ResourceNotFoundException(
                "One or more questions not found for the provided IDs.");
      }
      existingQuiz.setQuestions(new HashSet<>(questions));
    } else {
      existingQuiz.setQuestions(new HashSet<>());
    }

    Quiz updatedQuiz = quizRepository.save(existingQuiz);
    return mapToQuizDTOWithQuestions(updatedQuiz);
  }

  @Override
  @Transactional
  public void deleteQuiz(Long quizId) {
    if (!quizRepository.existsById(quizId)) {
      throw new ResourceNotFoundException("Quiz not found with id: " + quizId);
    }
    quizRepository.deleteById(quizId);
  }

  private QuizDTO mapToQuizDTOWithQuestions(Quiz quiz) {
    QuizDTO dto = new QuizDTO();
    dto.setId(quiz.getMaterialId());
    dto.setTitle(quiz.getTitle());
    dto.setDescription(quiz.getDescription());
    dto.setTimeLimit(quiz.getTimeLimit());
    dto.setMaxAttempts(quiz.getMaxAttempts());
    dto.setShuffleQuestions(quiz.getShuffleQuestions());

    if (quiz.getQuestions() != null) {
      List<QuestionInfoDTO> questionInfos =
              quiz.getQuestions().stream()
                      .map(
                              question -> {
                                QuestionInfoDTO questionInfo = new QuestionInfoDTO();
                                questionInfo.setId(question.getId());
                                questionInfo.setQuestionText(question.getQuestionText());
                                questionInfo.setQuestionType(question.getQuestionType());
                                questionInfo.setMarks(question.getMarks());

                                List<QuestionOption> questionOptions = null;

                                // FIX 1: Check the instance and cast to get options
                                if (question instanceof SingleChoiceQuestion) {
                                  questionOptions = ((SingleChoiceQuestion) question).getOptions();
                                } else if (question instanceof MultipleChoiceQuestion) {
                                  questionOptions = ((MultipleChoiceQuestion) question).getOptions();
                                }

                                // If options were found, map them to DTOs
                                if (questionOptions != null) {
                                  List<OptionDTO> options = questionOptions.stream()
                                          // FIX 2: Call the correct getters from QuestionOption's @Data
                                          .map(option -> new OptionDTO(option.getId(), option.getOptionText()))
                                          .collect(Collectors.toList());

                                  Collections.shuffle(options);
                                  questionInfo.setOptions(options);
                                }
                                return questionInfo;
                              })
                      .collect(Collectors.toList());

      // FIX 3: Call getShuffleQuestions() for Boolean type and check for null.
      if (Boolean.TRUE.equals(quiz.getShuffleQuestions())) {
        Collections.shuffle(questionInfos);
      }

      dto.setQuestions(questionInfos);
    }

    return dto;
  }
}