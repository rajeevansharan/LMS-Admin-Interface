package lk.slpa.mpma.backend.service.impl;

import java.util.List;
import java.util.Optional;
import lk.slpa.mpma.backend.model.Lecturer;
import lk.slpa.mpma.backend.repository.LecturerRepository;
import lk.slpa.mpma.backend.service.LecturerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LecturerServiceImpl implements LecturerService {

  private final LecturerRepository lecturerRepository;

  @Autowired
  public LecturerServiceImpl(LecturerRepository lecturerRepository) {
    this.lecturerRepository = lecturerRepository;
  }

  @Override
  public List<Lecturer> getAllLecturers() {
    return lecturerRepository.findAll();
  }

  @Override
  public Lecturer getLecturerById(Long id) {
    return lecturerRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + id));
  }

  @Override
  public Lecturer saveLecturer(Lecturer lecturer) {
    return lecturerRepository.save(lecturer);
  }

  @Override
  public void deleteLecturer(Long id) {
    lecturerRepository.deleteById(id);
  }

  @Override
  public Optional<Lecturer> getLecturerByUsername(String username) {
    return lecturerRepository.findByUsername(username);
  }

  @Override
  public Optional<Lecturer> getLecturerByEmail(String email) {
    return lecturerRepository.findByEmail(email);
  }

  @Override
  public List<Lecturer> getLecturersByDepartment(String department) {
    return lecturerRepository.findByDepartment(department);
  }
}
