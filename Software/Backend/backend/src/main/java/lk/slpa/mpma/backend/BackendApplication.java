package lk.slpa.mpma.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the MPMA backend.
 *
 * <p>This is the entry point for the Spring Boot application that powers the Mahapola Ports and
 * Maritime Academy (MPMA) platform. It initializes the Spring application context and starts all
 * required services.
 *
 * <p>The application implements a RESTful API backend supporting features for lecturers, students,
 * and administrators to manage courses, lectures, announcements, and other academic resources.
 */
@SpringBootApplication
public class BackendApplication {

  /**
   * Main method that starts the Spring Boot application.
   *
   * @param args Command line arguments passed to the application
   */
  public static void main(String[] args) {
    SpringApplication.run(BackendApplication.class, args);
  }
}
