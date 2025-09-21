package lk.slpa.mpma.backend.service.impl;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lk.slpa.mpma.backend.dto.*;
import lk.slpa.mpma.backend.exception.ResourceNotFoundException;
import lk.slpa.mpma.backend.model.*;
import lk.slpa.mpma.backend.repository.AssignmentRepository;
import lk.slpa.mpma.backend.repository.CourseRepository;
import lk.slpa.mpma.backend.repository.MaterialRepository;
import lk.slpa.mpma.backend.repository.PersonRepository;
import lk.slpa.mpma.backend.service.CourseService;
import lk.slpa.mpma.backend.service.FileStorageService;
import lk.slpa.mpma.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Implementation of the CourseService interface.
 *
 * <p>This class provides the concrete implementation of all operations defined in the CourseService
 * interface, handling the business logic for course management and interacting with the repository
 * layer to perform data access operations.
 */
@Service
@RequiredArgsConstructor
public  class CourseServiceImpl implements CourseService {

  private final CourseRepository courseRepository;
  private final FileStorageService fileStorageService;
  private final PersonRepository personRepository;
  private final MaterialRepository materialRepository;

  @Autowired
  private AssignmentRepository assignmentRepository;

  @Override
  public List<Course> getAllCourses() {
    return courseRepository.findAll();
  }

    /**
     * {@inheritDoc}
     *
     * <p>Uses a read-only transaction to improve performance for this retrieval operation. Throws a
     * RuntimeException if the course with the given ID doesn't exist.
     */
    @Override
    @Transactional(readOnly = true)
    public Course getCourseById(Long id) {
        Course course =
                courseRepository
                        .findById(id)
                        .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        return course;
    }

    /**
     * {@inheritDoc}
     *
     * <p>Persists a new course entity or updates an existing one in the database.
     */
    @Override
    public Course saveCreatedCourse(CourseCreateDTO courseDTO) {
        Course course = new Course();

        // Set ID only if provided (e.g., for manual override or migration use cases)
        if (courseDTO.getCourseId() != null) {
            course.setCourseId(courseDTO.getCourseId());
        }

        course.setName(courseDTO.getName());
        course.setStartDate(courseDTO.getStartDate());
        course.setEndDate(courseDTO.getStartDate());

        return saveCourse(course);
    }


    /**
     * {@inheritDoc}
     *
     * <p>Persists a new course entity or updates an existing one in the database.
     */
    @Override
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }


    /**
     * {@inheritDoc}
     *
     * <p>Deletes a course by its ID. If the course doesn't exist, the operation is silently ignored.
     */
    @Override
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    /**
     * {@inheritDoc}
     *
     * <p>Uses a read-only transaction and stream operations to efficiently transform course entities
     * to DTOs with simplified related entity information.
     */
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByLecturerId(Long lecturerId) {
        List<Course> courses = courseRepository.findByLecturers_PersonId(lecturerId);
        // Collections should be eagerly loaded now
        return courses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     *
     * <p>Provides an efficient existence check without loading the full entity.
     */
    @Override
    public boolean existsById(Long id) {
        return courseRepository.existsById(id);
    }

  @Override
  @Transactional
  public MaterialDocumentDTO addCourseMaterialDocument(
          Long courseId, MultipartFile file, String description) throws IOException {
    String username = SecurityUtil.getCurrentUsername()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
    Person creator = personRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Creator not found in database: " + username));
    Course course = getCourseById(courseId);
    String fileId = fileStorageService.storeFile(file, String.valueOf(courseId));
    MaterialDocument material = new MaterialDocument();
    String filename = Objects.requireNonNull(file.getOriginalFilename());
    material.setTitle(filename);
    String finalDescription = (description == null || description.trim().isEmpty()) ? "Uploaded file: " + filename : description;
    material.setDescription(finalDescription);
    material.setSectionNumber(1);
    material.setFileID(fileId);
    material.setCourse(course);
    material.setUploadDate(new Date());
    material.setVisible(true);
    material.setCreator(creator);
    material.setType(Material.MaterialType.DOCUMENT);
    course.addMaterial(material);
    courseRepository.save(course);
    return new MaterialDocumentDTO(material.getMaterialId(), material.getTitle(), material.getDescription(), material.getFileID(), material.getUploadDate(), material.getVisible(), creator.getName());
  }

  @Override
  @Transactional
  public void deleteCourseMaterial(Long materialId) throws IOException {
    Material material = materialRepository.findById(materialId)
            .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));
    if (material instanceof MaterialDocument) {
      MaterialDocument doc = (MaterialDocument) material;
      String fileId = doc.getFileID();
      if (fileId != null && !fileId.isEmpty()) {
        fileStorageService.deleteFile(fileId);
      }
    }
    materialRepository.delete(material);
  }

  @Override
  @Transactional
  public Material toggleMaterialVisibility(Long materialId) {
    Material material = materialRepository.findById(materialId)
            .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));
    material.setVisible(!material.getVisible());
    return materialRepository.save(material);
  }

  @Override
  public List<ActivityDTO> getActivitiesByCourseId(Long courseId) {
    List<Material> activityMaterials = materialRepository.findByCourseIdAndType(courseId, Material.MaterialType.ACTIVITY);
    return activityMaterials.stream()
            .map(material -> {
              Activity activity = (Activity) material;
              return new ActivityDTO(activity.getMaterialId(), activity.getTitle(), activity.getActivityType().name());
            })
            .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public void createAssignment(Long courseId, AssignmentCreateRequestDTO request, Person creator) {
    Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
    Assignment assignment = new Assignment();
    assignment.setTitle(request.getTitle());
    assignment.setDescription(request.getDescription());
    assignment.setVisible(request.getVisible());
    assignment.setUploadDate(new Date());
    assignment.setCourse(course);
    assignment.setCreator(creator);
    assignment.setType(Material.MaterialType.ACTIVITY);
    assignment.setEndDate(request.getEndDate());
    assignment.setMaxMarks(request.getMaxMarks());
    assignment.setPassMark(request.getPassMark());
    Double weight = (request.getWeight() == null || request.getWeight() <= 0) ? 1.0 : request.getWeight();
    assignment.setWeight(weight);
    assignment.setActivityType(Activity.ActivityType.ASSIGNMENT);
    assignment.setInstruction(request.getInstruction());
    assignment.setAllowedFileTypes(request.getAllowedFileTypes());
    assignment.setMaxFileSize(request.getMaxFileSize());
    assignment.setMaxFileCount(request.getMaxFileCount());
    assignmentRepository.save(assignment);
  }

  @Override
  public void updateAssignment(Long assignmentId, AssignmentCreateRequestDTO request) {
    Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
    assignment.setTitle(request.getTitle());
    assignment.setDescription(request.getDescription());
    assignment.setVisible(request.getVisible());
    assignment.setEndDate(request.getEndDate());
    assignment.setMaxMarks(request.getMaxMarks());
    assignment.setPassMark(request.getPassMark());
    Double weight = (request.getWeight() == null || request.getWeight() <= 0) ? 1.0 : request.getWeight();
    assignment.setWeight(weight);
    assignment.setInstruction(request.getInstruction());
    assignment.setAllowedFileTypes(request.getAllowedFileTypes());
    assignment.setMaxFileSize(request.getMaxFileSize());
    assignment.setMaxFileCount(request.getMaxFileCount());
    assignmentRepository.save(assignment);
  }

    @Override
    @Transactional(readOnly = true)
    public UnassignedCourseDetailsDTO getUnassignedCourseDetails(Long courseId) {
        Course course = getCourseById(courseId);

        // Verify the course is actually unassigned
        if (course.getSemester() != null) {
            throw new RuntimeException("Course is already assigned to a semester");
        }

        UnassignedCourseDetailsDTO dto = new UnassignedCourseDetailsDTO();
        dto.setCourseId(course.getCourseId());
        dto.setName(course.getName());
        dto.setStartDate(course.getStartDate());
        dto.setEndDate(course.getEndDate());
        dto.setStatus(course.getStatus());
        dto.setLectures(
                course.getLecturers().stream()
                        .map(lecturer -> new AdminViewLectureDTO(
                                lecturer.getPersonId(),
                                lecturer.getName(),
                                lecturer.getEmail()))
                        .collect(Collectors.toSet()));

        return dto;
    }
    @Override
    @Transactional(readOnly = true)
    public List<UnassignedCourseSimpleDTO> getUnassignedCoursesSimple() {
        List<Course> courses = courseRepository.findCoursesNotAssignedToSemester();
        return courses.stream()
                .map(course -> new UnassignedCourseSimpleDTO(
                        course.getCourseId(),
                        course.getName(),
                        course.getCourseImage(),
                        course.getStartDate()))
                .collect(Collectors.toList());
    }

  @Override
  public CourseStatusCountDTO getCourseStatusCounts() {
    long activeCount = courseRepository.countByStatus(Course.CourseStatus.ACTIVE);
    long completedCount = courseRepository.countByStatus(Course.CourseStatus.COMPLETED);
    return new CourseStatusCountDTO(activeCount, completedCount);
  }

    @Override
    @Transactional(readOnly = true)
    public List<CourseViewDTO> getAllCoursesForAdminView() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(
                        course -> {
                            CourseViewDTO dto = new CourseViewDTO();
                            dto.setCourseId(course.getCourseId());
                            dto.setCourseName(course.getName());
                            dto.setCourseImage(course.getCourseImage());
                            // Since this is an admin view, we might not need enrollment status
                            dto.setStatus(null); // or set a default status if needed
                            dto.setStartDate(course.getStartDate());
                            // Get lecturer names
                            List<String> lecturerNames =
                                    course.getLecturers().stream()
                                            .map(Lecturer::getName)
                                            .collect(Collectors.toList());
                            dto.setLecture(lecturerNames);

                            return dto;
                        })
                .collect(Collectors.toList());
    }



    /**
     * Helper method to convert a Course entity to a CourseDTO.
     *
     * <p>This method handles the transformation of a complex entity with multiple relationships into
     * a data transfer object suitable for client communication. It creates simplified representations
     * of related entities.
     *
     * @param course The course entity to convert
     * @return A CourseDTO representing the course with simplified related entities
     */
    private CourseDTO convertToDTO(Course course) {

        CourseDTO dto = new CourseDTO();
        dto.setCourseId(course.getCourseId());
        dto.setName(course.getName());
        dto.setStartDate(course.getStartDate());
        dto.setEndDate(course.getEndDate());

        // Convert lecturers (still collecting to Set for DTO)
        dto.setLecturers(
                course.getLecturers().stream()
                        .map(
                                lecturer ->
                                        new LecturerSimpleDTO(
                                                lecturer.getPersonId(), lecturer.getName(), lecturer.getDepartment()))
                        .collect(Collectors.toSet())); // DTO uses Set

        // Convert materials (still collecting to Set for DTO)
        dto.setMaterials(
                course.getMaterials().stream()
                        .map(
                                material ->
                                        new MaterialSimpleDTO(
                                                material.getMaterialId(),
                                                material.getTitle(),
                                                material.getType(),
                                                material.getUploadDate(),
                                                material.getVisible()))
                        .collect(Collectors.toSet())); // DTO uses Set

        // Convert lectures (still collecting to Set for DTO)
        dto.setLectures(
                course.getLectures().stream()
                        .map(
                                lecture ->
                                        new LectureSimpleDTO(
                                                lecture.getLectureId(),
                                                lecture.getTitle(),
                                                lecture.getStartDate(),
                                                lecture.getLocation(),
                                                lecture.getDescription()))
                        .collect(Collectors.toSet())); // DTO uses Set

        return dto;
    }

    @Override
    public List<CourseDTO> getCoursesByStudentId(Long studentId)
    {
        List<Course> courses = courseRepository.findCoursesByStudentId(studentId);
        return courses.stream().map(this::convertToDTO).collect(Collectors.toList());
    };

}