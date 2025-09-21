package lk.slpa.mpma.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a user attempts to access a resource or perform an action for which they do
 * not have proper authorization.
 *
 * <p>This exception is automatically translated to an HTTP 403 FORBIDDEN response by Spring's
 * exception handling mechanism.
 *
 * <p>Used to indicate authorization failures such as: - A lecturer trying to modify another
 * lecturer's course - A student trying to access administrative functions - Any user attempting to
 * perform an action outside their role permissions
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnauthorizedAccessException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  /** Constructs a new unauthorized access exception with no detail message. */
  public UnauthorizedAccessException() {
    super();
  }

  /**
   * Constructs a new unauthorized access exception with the specified detail message.
   *
   * @param message The detail message explaining the authorization failure
   */
  public UnauthorizedAccessException(String message) {
    super(message);
  }

  /**
   * Constructs a new unauthorized access exception with the specified detail message and cause.
   *
   * @param message The detail message explaining the authorization failure
   * @param cause The cause of the exception
   */
  public UnauthorizedAccessException(String message, Throwable cause) {
    super(message, cause);
  }
}
