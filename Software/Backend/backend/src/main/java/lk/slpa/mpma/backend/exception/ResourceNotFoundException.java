package lk.slpa.mpma.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a requested resource cannot be found in the system. This exception is
 * automatically translated to an HTTP 404 NOT FOUND response by Spring's exception handling
 * mechanism.
 *
 * <p>Used throughout the application to indicate when entities like courses, lectures,
 * announcements, etc. cannot be found by their identifiers.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  /** Constructs a new resource not found exception with no message. */
  public ResourceNotFoundException() {
    super();
  }

  /**
   * Constructs a new resource not found exception with the specified detail message.
   *
   * @param message The detail message explaining what resource was not found
   */
  public ResourceNotFoundException(String message) {
    super(message);
  }

  /**
   * Constructs a new resource not found exception with the specified detail message and cause.
   *
   * @param message The detail message explaining what resource was not found
   * @param cause The cause of the exception
   */
  public ResourceNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}
