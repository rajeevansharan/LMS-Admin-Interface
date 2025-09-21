package lk.slpa.mpma.backend.service;

import lk.slpa.mpma.backend.dto.StatsDTO;
import lk.slpa.mpma.backend.model.Person.UserRole;
import lk.slpa.mpma.backend.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StatsService {

  private final PersonRepository personRepository;

  @Transactional(readOnly = true)
  public StatsDTO getPlatformStats() {
    long studentCount = personRepository.countByUserRole(UserRole.STUDENT);
    long lecturerCount = personRepository.countByUserRole(UserRole.LECTURER);
    long trainerCount = personRepository.countByUserRole(UserRole.TRAINER);
    long traineeCount = personRepository.countByUserRole(UserRole.TRAINEE);

    return new StatsDTO(studentCount, lecturerCount, trainerCount, traineeCount);
  }
}
