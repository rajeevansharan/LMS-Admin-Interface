package com.LmsProject.AdminInterface.DTO;

import lombok.Data;
import java.time.LocalDate;
import java.util.Map;

@Data
public class AttendanceUpdateDTO {
    private Long studentId;
    private String semesterId;
    private String batch;
    private LocalDate date;
    private Long courseId;  // For a single course update
    private Boolean present; // For a single course update
    private Map<Long, Boolean> courseAttendance; // For bulk updates
}