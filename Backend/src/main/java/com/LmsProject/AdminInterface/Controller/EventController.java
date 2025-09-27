package com.LmsProject.AdminInterface.Controller;

import java.time.LocalDate;
import java.util.List;

import com.LmsProject.AdminInterface.DTO.BatchEventRequestDTO;
import com.LmsProject.AdminInterface.DTO.CourseEventRequestDTO;
import com.LmsProject.AdminInterface.DTO.EventBasicResponseDTO;
import com.LmsProject.AdminInterface.DTO.EventResponseDTO;
import com.LmsProject.AdminInterface.Exception.NoEventFoundException;
import com.LmsProject.AdminInterface.Service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping("/course")
    public ResponseEntity<EventResponseDTO> createCourseEvent(@RequestBody CourseEventRequestDTO request) {
        return ResponseEntity.ok(eventService.createCourseEvent(request));
    }

    @PostMapping("/batch")
    public ResponseEntity<EventResponseDTO> createBatchEvent(@RequestBody BatchEventRequestDTO request) {
        return ResponseEntity.ok(eventService.createBatchEvent(request));
    }

    @PutMapping("/course/{id}")
    public ResponseEntity<EventResponseDTO> updateCourseEvent(@PathVariable Long id, @RequestBody CourseEventRequestDTO request) {
        return ResponseEntity.ok(eventService.updateCourseEvent(id, request));
    }


    @PutMapping("/batch/{id}")
    public ResponseEntity<EventResponseDTO> updateBatchEvent(@PathVariable Long id, @RequestBody BatchEventRequestDTO request) {
        return ResponseEntity.ok(eventService.updateBatchEvent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter/{academicYear}/{semesterId}/{batch}")
    public ResponseEntity<?> getEventsByAcademicYearSemesterAndBatch(
            @PathVariable String academicYear,
            @PathVariable String semesterId,
            @PathVariable String batch) {
        try {
            List<EventResponseDTO> events = eventService.getEventsByAcademicYearSemesterAndBatch(academicYear, semesterId, batch);
            return ResponseEntity.ok(events);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching events");
        }
    }


    // Get basic details of events for a specific date (for date-specific events)
    @GetMapping("/date/basic/{academicYear}/{semesterId}/{batch}/{date}")
    public ResponseEntity<?> getEventsByDate(
            @PathVariable String academicYear,
            @PathVariable String semesterId,
            @PathVariable String batch,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<EventBasicResponseDTO> events = eventService.getEventsByDate(academicYear, semesterId, batch, date);
            return ResponseEntity.ok(events);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching events for date");
        }
    }

    // Get full details of a specific event (for date-specific events)
    @GetMapping("/details/{eventId}")
    public ResponseEntity<?> getEventDetails(@PathVariable Long eventId) {
        try {
            EventResponseDTO event = eventService.getEventDetails(eventId);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching event details");
        }
    }

    // Upcoming basic events
    @GetMapping("/upcoming/basic/{academicYear}/{semesterId}/{batch}")
    public ResponseEntity<?> getUpcomingBasicEvents(
            @PathVariable String academicYear,
            @PathVariable String semesterId,
            @PathVariable String batch) {
        try {
            List<EventBasicResponseDTO> events = eventService.getUpcomingBasicEvents(academicYear, semesterId, batch);
            return ResponseEntity.ok(events);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching upcoming events");
        }
    }

    // Upcoming eventful details
    @GetMapping("/upcoming/details/{eventId}")
    public ResponseEntity<?> getUpcomingEventDetails(@PathVariable Long eventId) {
        try {
            EventResponseDTO event = eventService.getUpcomingEventDetails(eventId);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching upcoming event details");
        }
    }

    @GetMapping("/upcoming/batchWiseEvents")
    public List<EventResponseDTO> getUpcomingBatchEvents() {
        return eventService.getUpcomingBatchEvents();
    }



     //fetching the events for the student
     @GetMapping("/student/upcoming/basic/{username}")
     public ResponseEntity<?> getUpcomingEventsForStudentBasic(@PathVariable String username) {
         try {
             List<EventBasicResponseDTO> events = eventService.getUpcomingCourseEventsForStudent(username);
             return ResponseEntity.ok(events);
         } catch (NoEventFoundException e) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
         } catch (IllegalArgumentException e) {
             return ResponseEntity.badRequest().body(e.getMessage());
         } catch (Exception e) {
             return ResponseEntity.internalServerError().body("Error fetching student events");
         }
     }

    @GetMapping("/student/upcoming/details/{eventId}/{username}")
    public ResponseEntity<?> getUpcomingEventDetailsForStudent(
            @PathVariable Long eventId,
            @PathVariable String username) {
        try {
            EventResponseDTO event = eventService.getUpcomingEventDetailsForStudent(eventId, username);
            return ResponseEntity.ok(event);
        } catch (NoEventFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching event details");
        }
    }
}

