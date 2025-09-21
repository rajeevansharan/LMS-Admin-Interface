package lk.slpa.mpma.backend.controller;

import lk.slpa.mpma.backend.dto.AttendanceReportDTO;
import lk.slpa.mpma.backend.dto.AttendanceUpdateDTO;
import lk.slpa.mpma.backend.dto.SemesterAttendanceDTO;
import lk.slpa.mpma.backend.dto.StudentSemesterAttendanceDTO;
import lk.slpa.mpma.backend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/semester/{semesterId}/batch/{batch}/date/{date}")
    public List<SemesterAttendanceDTO> getSemesterAttendance(
            @PathVariable String semesterId,
            @PathVariable String batch,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return attendanceService.getSemesterAttendance(semesterId, batch, date);
    }

    // get all course attendances for the specific student, semester and batch on date (Student wise attendance)
    @GetMapping("/student/{studentId}/semester/{semesterId}/batch/{batch}/date/{date}")
    public ResponseEntity<List<AttendanceReportDTO>> getStudentSemesterAttendance(
            @PathVariable Long studentId,
            @PathVariable String semesterId,
            @PathVariable String batch,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<AttendanceReportDTO> report = attendanceService.getStudentAttendanceForSemester(
                studentId, semesterId, batch, date);

        return ResponseEntity.ok(report);
    }

    @PutMapping("/student/quick-update")
    public ResponseEntity<AttendanceReportDTO> quickUpdateStudentAttendance(
            @RequestBody AttendanceUpdateDTO updateDTO) {
        AttendanceReportDTO updatedAttendance =
                attendanceService.quickUpdateStudentAttendance(updateDTO);
        return ResponseEntity.ok(updatedAttendance);
    }

    @GetMapping("/student/{username}/semester/{semesterId}")
    public ResponseEntity<?> getStudentSemesterAttendance(
            @PathVariable String username,
            @PathVariable String semesterId) {

        try {
            List<SemesterAttendanceDTO> attendance = attendanceService.getStudentSemesterAttendanceByUsername(username, semesterId);

            if (attendance.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No attendance records found for this student in the specified semester");
            }

            return ResponseEntity.ok(attendance);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching attendance records: " + ex.getMessage());
        }
    }

}