package com.LmsProject.AdminInterface.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


import com.LmsProject.AdminInterface.DTO.BatchEventRequestDTO;
import com.LmsProject.AdminInterface.DTO.CourseEventRequestDTO;
import com.LmsProject.AdminInterface.DTO.EventBasicResponseDTO;
import com.LmsProject.AdminInterface.DTO.EventResponseDTO;
import com.LmsProject.AdminInterface.Exception.NoEventFoundException;
import com.LmsProject.AdminInterface.Model.*;
import com.LmsProject.AdminInterface.Repository.BatchEventRepository;
import com.LmsProject.AdminInterface.Repository.CourseEventRepository;
import com.LmsProject.AdminInterface.Repository.CourseRepository;
import com.LmsProject.AdminInterface.Repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventService {

    private final CourseEventRepository courseEventRepository;
    private final BatchEventRepository batchEventRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;


    //Get all Upcoming basic events details from now onwards
    public List<EventBasicResponseDTO> getUpcomingBasicEvents(String academicYear, String semesterId, String batch) {
        if (academicYear == null || academicYear.isBlank() ||
                semesterId == null || semesterId.isBlank() ||
                batch == null || batch.isBlank()) {
            throw new IllegalArgumentException("All parameters (academicYear, semesterId, batch) must be provided");
        }

        LocalDate currentDate = LocalDate.now();

        List<CourseEvent> courseEvents = courseEventRepository
                .findByCourse_Semester_AcademicYearAndCourse_Semester_SemesterIdAndBatchAndDateGreaterThanEqual(
                        academicYear, semesterId, batch, currentDate);
        List<BatchEvent> batchEvents = batchEventRepository.findByBatchAndDateGreaterThanEqual(batch, currentDate);

        List<EventBasicResponseDTO> results = new ArrayList<>();
        courseEvents.forEach(e -> results.add(mapToBasicResponse(e)));
        batchEvents.forEach(e -> results.add(mapToBasicResponse(e)));

        // Sort by date (ascending)
        results.sort(Comparator.comparing(EventBasicResponseDTO::getDate));

        return results;
    }

    // Get basic events for specific date
    public List<EventBasicResponseDTO> getEventsByDate(String academicYear, String semesterId, String batch, LocalDate date) {
        if (academicYear == null || academicYear.isBlank() ||
                semesterId == null || semesterId.isBlank() ||
                batch == null || batch.isBlank() || date == null) {
            throw new IllegalArgumentException("All parameters (academicYear, semesterId, batch, date) must be provided");
        }

        List<CourseEvent> courseEvents = courseEventRepository
                .findByCourse_Semester_AcademicYearAndCourse_Semester_SemesterIdAndBatchAndDate(
                        academicYear, semesterId, batch, date);

        List<BatchEvent> batchEvents = batchEventRepository.findByBatchAndDate(batch, date);

        List<EventBasicResponseDTO> results = new ArrayList<>();
        courseEvents.forEach(e -> results.add(mapToBasicResponse(e)));
        batchEvents.forEach(e -> results.add(mapToBasicResponse(e)));

        // Sort by title (or any other field you prefer)
        results.sort(Comparator.comparing(EventBasicResponseDTO::getTitle));

        return results;
    }

    //specific eventful details
    public EventResponseDTO getUpcomingEventDetails(Long eventId) {
        LocalDate currentDate = LocalDate.now();

        // Try to find in course events first
        Optional<CourseEvent> courseEvent = courseEventRepository.findByIdAndDateGreaterThanEqual(eventId, currentDate);
        if (courseEvent.isPresent()) {
            return mapToResponse(courseEvent.get());
        }

        // If not found, try batch events
        Optional<BatchEvent> batchEvent = batchEventRepository.findByIdAndDateGreaterThanEqual(eventId, currentDate);
        if (batchEvent.isPresent()) {
            return mapToResponse(batchEvent.get());
        }

        throw new RuntimeException("Upcoming event not found with id: " + eventId);
    }

    // Get full details of a specific event by ID (for date-specific events)
    public EventResponseDTO getEventDetails(Long eventId) {
        // Try to find in course events first
        Optional<CourseEvent> courseEvent = courseEventRepository.findById(eventId);
        if (courseEvent.isPresent()) {
            return mapToResponse(courseEvent.get());
        }

        // If not found, try batch events
        Optional<BatchEvent> batchEvent = batchEventRepository.findById(eventId);
        if (batchEvent.isPresent()) {
            return mapToResponse(batchEvent.get());
        }

        throw new RuntimeException("Event not found with id: " + eventId);
    }

    public List<EventResponseDTO> getEventsByAcademicYearSemesterAndBatch(String academicYear, String semesterId, String batch) {
        if (academicYear == null || academicYear.isBlank() ||
                semesterId == null || semesterId.isBlank() ||
                batch == null || batch.isBlank()) {
            throw new IllegalArgumentException("All parameters (academicYear, semesterId, batch) must be provided");
        }

        // Use academicYear for course events filtering
        List<CourseEvent> courseEvents = courseEventRepository
                .findByCourse_Semester_AcademicYearAndCourse_Semester_SemesterIdAndBatch(
                        academicYear, semesterId, batch);

        List<BatchEvent> batchEvents = batchEventRepository.findByBatch(batch);

        List<EventResponseDTO> results = new ArrayList<>();
        courseEvents.forEach(e -> results.add(mapToResponse(e)));
        batchEvents.forEach(e -> results.add(mapToResponse(e)));

        return results;
    }

    public EventResponseDTO createCourseEvent(CourseEventRequestDTO request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + request.getCourseId()));

        CourseEvent event = CourseEvent.builder()
                .title(request.getTitle())
                .date(request.getDate())
                .description(request.getDescription())
                .createdBy(request.getCreatedBy())
                .course(course)
                .batch(request.getBatch())
                .build();

        return mapToResponse(courseEventRepository.save(event));
    }

    public EventResponseDTO createBatchEvent(BatchEventRequestDTO request) {
        BatchEvent event = BatchEvent.builder()
                .title(request.getTitle())
                .date(request.getDate())
                .description(request.getDescription())
                .createdBy(request.getCreatedBy())
                .batch(request.getBatch())
                .build();

        return mapToResponse(batchEventRepository.save(event));
    }




    public void deleteEvent(Long id) {
        if (courseEventRepository.existsById(id)) {
            courseEventRepository.deleteById(id);
        } else if (batchEventRepository.existsById(id)) {
            batchEventRepository.deleteById(id);
        } else {
            throw new RuntimeException("Event not found with id: " + id);
        }
    }

    public EventResponseDTO updateCourseEvent(Long id, CourseEventRequestDTO request) {
        CourseEvent event = courseEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CourseEvent not found with id: " + id));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + request.getCourseId()));

        event.setTitle(request.getTitle());
        event.setDate(request.getDate());
        event.setDescription(request.getDescription());
        event.setCreatedBy(request.getCreatedBy());
        event.setCourse(course);
        event.setBatch(request.getBatch());

        return mapToResponse(courseEventRepository.save(event));
    }

    public EventResponseDTO updateBatchEvent(Long id, BatchEventRequestDTO request) {
        BatchEvent event = batchEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BatchEvent not found with id: " + id));

        event.setTitle(request.getTitle());
        event.setDate(request.getDate());
        event.setDescription(request.getDescription());
        event.setCreatedBy(request.getCreatedBy());
        event.setBatch(request.getBatch());

        return mapToResponse(batchEventRepository.save(event));
    }

    private EventResponseDTO mapToResponse(Event event) {
        EventResponseDTO.EventResponseDTOBuilder builder = EventResponseDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .description(event.getDescription())
                .createdBy(event.getCreatedBy());


        if (event instanceof CourseEvent courseEvent) {
            builder.eventType("COURSE_EVENT")
                    .courseId(courseEvent.getCourse().getCourseId())
                    .semesterId(courseEvent.getCourse().getSemester().getSemesterId())
                    .semesterName(courseEvent.getCourse().getSemester().getSemesterName())
                    .courseName(courseEvent.getCourse().getName())
                    .batch(courseEvent.getBatch()) // Now using the direct batch field
                    .academicYear(courseEvent.getCourse().getSemester().getAcademicYear());

        } else if (event instanceof BatchEvent batchEvent) {
            builder.eventType("BATCH_EVENT")
                    .batch(batchEvent.getBatch());
        } else {
            builder.eventType("GENERAL_EVENT");
        }
        return builder.build();
    }


    private EventBasicResponseDTO mapToBasicResponse(Event event) {
        return EventBasicResponseDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .eventType(event instanceof CourseEvent ? "COURSE_EVENT" : "BATCH_EVENT")
                .build();
    }

    public List<EventResponseDTO> getUpcomingBatchEvents() {
        LocalDate currentDate = LocalDate.now();
        List<BatchEvent> batchEvents = batchEventRepository.findByDateGreaterThanEqual(currentDate);
        return batchEvents.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    public List<EventBasicResponseDTO> getUpcomingCourseEventsForStudent(String username) {
        // Validate input
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username must be provided");
        }

        LocalDate currentDate = LocalDate.now();

        // Get student's enrollments
        List<Enrollment> enrollments = enrollmentRepository.findByStudent_Username(username);
        if (enrollments.isEmpty()) {
            throw new NoEventFoundException("Student not enrolled in any courses");
        }

        // Get student's batch (assuming single batch per student)
        String batch = enrollments.get(0).getStudent().getBatch();

        // Get course IDs from enrollments
        List<Long> courseIds = enrollments.stream()
                .map(e -> e.getCourse().getCourseId())
                .collect(Collectors.toList());

        // Get upcoming course events using existing repository method
        List<CourseEvent> courseEvents = courseEventRepository
                .findByCourse_CourseIdInAndBatchAndDateGreaterThanEqual(
                        courseIds,
                        batch,
                        currentDate);

        // Get upcoming batch events using existing repository method
        List<BatchEvent> batchEvents = batchEventRepository
                .findByBatchAndDateGreaterThanEqual(
                        batch,
                        currentDate);

        // Combine and map results
        List<EventBasicResponseDTO> results = new ArrayList<>();
        courseEvents.forEach(e -> results.add(mapToBasicResponse(e)));
        batchEvents.forEach(e -> results.add(mapToBasicResponse(e)));

        // Throw exception if no events found
        if (results.isEmpty()) {
            throw new NoEventFoundException("No upcoming events found for student");
        }

        // Sort by date
        results.sort(Comparator.comparing(EventBasicResponseDTO::getDate));

        return results;
    }

    public EventResponseDTO getUpcomingEventDetailsForStudent(Long eventId, String username) {
        LocalDate currentDate = LocalDate.now();

        // First verify the student has access to this event
        List<Enrollment> enrollments = enrollmentRepository.findByStudent_Username(username);
        if (enrollments.isEmpty()) {
            throw new RuntimeException("No enrollments found for student with username: " + username);
        }

        String batch = enrollments.get(0).getStudent().getBatch();

        // Try to find in course events
        Optional<CourseEvent> courseEvent = courseEventRepository.findByIdAndDateGreaterThanEqual(eventId, currentDate);
        if (courseEvent.isPresent()) {
            // Verify the student is enrolled in this course
            boolean isEnrolled = enrollments.stream()
                    .anyMatch(e -> e.getCourse().getCourseId().equals(courseEvent.get().getCourse().getCourseId()));
            if (isEnrolled) {
                return mapToResponse(courseEvent.get());
            }
        }

        // Try to find in batch events
        Optional<BatchEvent> batchEvent = batchEventRepository.findByIdAndDateGreaterThanEqual(eventId, currentDate);
        if (batchEvent.isPresent() && batchEvent.get().getBatch().equals(batch)) {
            return mapToResponse(batchEvent.get());
        }

        throw new RuntimeException("Upcoming event not found with id: " + eventId + " for student: " + username);
    }


}