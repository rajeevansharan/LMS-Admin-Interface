package com.LmsProject.AdminInterface.Repository;

import java.util.List;
import java.util.Optional;

import com.LmsProject.AdminInterface.Model.Course;
import com.LmsProject.AdminInterface.Model.Enrollment;
import com.LmsProject.AdminInterface.Model.Semester;
import com.LmsProject.AdminInterface.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent_PersonId(Long studentId);

  boolean existsByStudentAndSemester(Student student, Semester semester);

    List<Enrollment> findBySemester_SemesterIdAndSemester_Courses_CourseIdAndStudent_Batch(
            String semesterId, Long courseId, String batch);

    List<Enrollment> findBySemester_SemesterIdAndStudent_Batch(String semesterId, String batch);

    @Query("SELECT e FROM Enrollment e WHERE " +
            "e.student.personId = :studentId AND " +
            "e.semester.semesterId = :semesterId AND " +
            ":courseId IN (SELECT c.courseId FROM e.semester.courses c)")
    Optional<Enrollment> findByStudentAndSemesterAndCourse(
            @Param("studentId") Long studentId,
            @Param("semesterId") String semesterId,
            @Param("courseId") Long courseId);

  List<Enrollment> findByStudent_UsernameAndCourseIsNotNull(String username);
  List<Enrollment> findByStudent_Username(String username);

  @Query("SELECT COUNT(e) > 0 FROM Enrollment e WHERE " +
          "e.student.username = :username AND " +
          "e.semester.semesterId = :semesterId")
  boolean existsByStudentUsernameAndSemesterId(
          @Param("username") String username,
          @Param("semesterId") String semesterId);

  List<Enrollment> findByCourse_CourseIdAndSemester_SemesterId(Long courseId, String semesterId);

  List<Enrollment> findByStudent_PersonIdAndSemester_SemesterId(Long studentId, String semesterId);
  int countByCourse_CourseIdAndSemester_SemesterId(Long courseId, String semesterId);

  boolean existsByStudentAndSemesterAndCourse(Student student, Semester semester, Course course);

}
