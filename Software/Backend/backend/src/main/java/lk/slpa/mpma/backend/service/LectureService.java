package lk.slpa.mpma.backend.service;

import java.util.List;
import lk.slpa.mpma.backend.dto.LectureDTO;

public interface LectureService {
  List<LectureDTO> getLecturesByCourseId(Long courseId);

  LectureDTO getLectureById(Long id);

  LectureDTO createLecture(LectureDTO lectureDTO, Long courseId, String lecturerUsername);

  LectureDTO updateLecture(Long id, LectureDTO lectureDTO, String lecturerUsername);

  void deleteLecture(Long id, String lecturerUsername);
}
