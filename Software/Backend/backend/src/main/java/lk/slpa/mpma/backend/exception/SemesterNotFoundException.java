package lk.slpa.mpma.backend.exception;

public class SemesterNotFoundException extends RuntimeException {
  public SemesterNotFoundException(String message) {
    super(message);
  }
}
