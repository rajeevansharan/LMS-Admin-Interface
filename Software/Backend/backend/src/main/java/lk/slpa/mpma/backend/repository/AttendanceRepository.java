package lk.slpa.mpma.backend.repository;

import lk.slpa.mpma.backend.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByCourse_CourseIdAndStudent_PersonIdAndDate(Long courseId, Long studentId, LocalDate date);

    List<Attendance> findByStudent_PersonIdAndCourse_Semester_SemesterId(Long studentId, String semesterId);
}