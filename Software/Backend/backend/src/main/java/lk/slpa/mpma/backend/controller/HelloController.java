package lk.slpa.mpma.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * A simple controller that provides a greeting message at the root endpoint. This controller serves
 * as a basic health check to verify that the application is running.
 */
@RestController
public class HelloController {

  /**
   * Returns a greeting message when the root endpoint is accessed.
   *
   * @return A greeting message string
   */
  @GetMapping("/")
  public String index() {
    return "Greetings from Spring Boot!";
  }
}
