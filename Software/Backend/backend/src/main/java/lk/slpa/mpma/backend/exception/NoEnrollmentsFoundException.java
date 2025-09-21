package lk.slpa.mpma.backend.exception;

public class NoEnrollmentsFoundException extends RuntimeException {
    public NoEnrollmentsFoundException(String message) {
        super(message);
    }
}