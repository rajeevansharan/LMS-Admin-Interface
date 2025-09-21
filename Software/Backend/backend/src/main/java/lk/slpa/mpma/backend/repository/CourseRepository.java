package lk.slpa.mpma.backend.repository;

import java.util.List;
import java.util.Optional;

import lk.slpa.mpma.backend.dto.CourseStatusCountDTO;
import lk.slpa.mpma.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import lk.slpa.mpma.backend.model.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // Add this method to find courses a student is enrolled in
    @Query("SELECT c FROM Course c JOIN c.students s WHERE s.id = :studentId")
    List<Course> findCoursesByStudentId(@Param("studentId") Long studentId);

  // Add any additional query methods as needed


  Optional<Course> findById(Long courseId);


  /**
   * Finds all courses associated with a specific student.
   *
   * @param studentId The unique identifier of the student
   * @return List of courses enrolled by the specified student
   */
  List<Course> findByStudents_PersonId(Long studentId);



  @Query("SELECT COUNT(c) FROM Course c WHERE c.status = :status")
  long countByStatus(Course.CourseStatus status);

  @Query("SELECT c FROM Course c WHERE c.semester IS NULL")
  List<Course> findCoursesNotAssignedToSemester();

  List<Course> findBySemester_SemesterId(String semesterId);

  boolean existsByName(String name);


    List<Course> findByLecturers_PersonId(Long lecturerId);
}
