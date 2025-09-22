package com.LmsProject.AdminInterface.Repository;

import java.util.Optional;

import com.LmsProject.AdminInterface.Model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

  /**
   * Find a person by username
   *
   * @param username The username to search for
   * @return Optional containing the person if found
   */
  Optional<Person> findByUsername(String username);

  /**
   * Count persons by their user role
   *
   * @param userRole The role to count
   * @return The count of persons with the specified role
   */
  long countByUserRole(Person.UserRole userRole);
}
