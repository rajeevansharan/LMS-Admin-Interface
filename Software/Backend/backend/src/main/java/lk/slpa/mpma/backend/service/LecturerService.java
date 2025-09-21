package lk.slpa.mpma.backend.service;

import java.util.List;
import java.util.Optional;
import lk.slpa.mpma.backend.model.Lecturer;

public interface LecturerService {
  List<Lecturer> getAllLecturers();

  Lecturer getLecturerById(Long id);

  Lecturer saveLecturer(Lecturer lecturer);

  void deleteLecturer(Long id);

  Optional<Lecturer> getLecturerByUsername(String username);

  Optional<Lecturer> getLecturerByEmail(String email);

  List<Lecturer> getLecturersByDepartment(String department);
}
