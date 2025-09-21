package lk.slpa.mpma.backend.repository;

import java.util.List;
import java.util.Optional;
import lk.slpa.mpma.backend.model.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Lecturer entities. Provides database operations for lecturers using
 * Spring Data JPA. Extends JpaRepository to inherit standard CRUD operations.
 */
@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, Long> {
  /**
   * Finds a lecturer by their email address.
   *
   * @param email The email address to search for
   * @return Optional containing the lecturer if found, empty otherwise
   */
  Optional<Lecturer> findByEmail(String email);

  /**
   * Finds a lecturer by their username. Used primarily for authentication purposes.
   *
   * @param username The username to search for
   * @return Optional containing the lecturer if found, empty otherwise
   */
  Optional<Lecturer> findByUsername(String username);

  /**
   * Finds all lecturers in a specific department.
   *
   * @param department The name of the department
   * @return List of lecturers belonging to the specified department
   */
  List<Lecturer> findByDepartment(String department);

  /**
   * Finds lecturers whose areas of interest contain a specific keyword. Useful for searching
   * lecturers by their expertise or research interests.
   *
   * @param keyword The keyword to search for in areas of interest
   * @return List of lecturers with matching areas of interest
   */
  List<Lecturer> findByAreasOfInterestContaining(String keyword);
}
