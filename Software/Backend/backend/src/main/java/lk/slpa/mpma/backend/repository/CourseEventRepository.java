// CourseEventRepository.java
package lk.slpa.mpma.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import lk.slpa.mpma.backend.model.CourseEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseEventRepository extends JpaRepository<CourseEvent, Long> {

    List<CourseEvent> findByCourse_Semester_AcademicYearAndCourse_Semester_SemesterIdAndBatch(
            String academicYear, String semesterId, String batch);


    // For upcoming events
    List<CourseEvent> findByCourse_Semester_AcademicYearAndCourse_Semester_SemesterIdAndBatchAndDateGreaterThanEqual(
            String academicYear, String semesterId, String batch, LocalDate currentDate);

    @Query("SELECT ce FROM CourseEvent ce WHERE ce.id = :id AND ce.date >= :currentDate")
    Optional<CourseEvent> findByIdAndDateGreaterThanEqual(@Param("id") Long id, @Param("currentDate") LocalDate currentDate);

    List<CourseEvent> findByCourse_Semester_AcademicYearAndCourse_Semester_SemesterIdAndBatchAndDate(
            String academicYear, String semesterId, String batch, LocalDate date);

    List<CourseEvent> findByCourse_CourseIdInAndBatchAndDateGreaterThanEqual(
            List<Long> courseIds, String batch, LocalDate currentDate);
}

