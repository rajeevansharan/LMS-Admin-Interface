package com.LmsProject.AdminInterface.Service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


import com.LmsProject.AdminInterface.DTO.StudentCountDTO;
import com.LmsProject.AdminInterface.DTO.StudentDTO;
import com.LmsProject.AdminInterface.Model.Student;
import com.LmsProject.AdminInterface.Repository.StudentRepository;
import com.LmsProject.AdminInterface.Repository.StudentResponseRepository;
import com.LmsProject.AdminInterface.Service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of the StudentService interface.
 *
 * <p>This class provides the concrete implementation of all operations defined in the
 * StudentService interface, handling the business logic for student management and interacting with
 * the repository layer to perform data access operations.
 */
@Service
public abstract class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }



    @Autowired
    private StudentResponseRepository studentResponseRepository;

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByCourseId(Long courseId) {
        List<Student> students = studentRepository.findStudentsByCourseId(courseId);
        return students.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Converts a Student entity to a StudentDTO.
     *
     * @param student The student entity to convert
     * @return A StudentDTO representing the student
     */
    private StudentDTO convertToDTO(Student student) {
        return new StudentDTO(
                student.getPersonId(),
                student.getName(),
                student.getUsername(),
                student.getEmail(),
                student.getPhoneNumber(),
                student.getDateOfBirth(),
                student.getAddress(),
                student.getUserRole().name());
    }


    // get student details by username
    @Override
    public Optional<Student> getStudentByUsername(String username) {
        return studentRepository.findByUsername(username);
    }

    public StudentCountDTO getTotalStudentCount() {
        long count = studentRepository.count();
        return new StudentCountDTO(count);
    }

    @Override
    @Transactional
    public Student updateStudent(StudentDTO studentDTO) {
        Student existingStudent = studentRepository.findById(studentDTO.getId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentDTO.getId()));

        // Update all fields except role
        existingStudent.setName(studentDTO.getName());
        existingStudent.setUsername(studentDTO.getUsername());
        existingStudent.setEmail(studentDTO.getEmail());
        existingStudent.setPhoneNumber(studentDTO.getPhoneNumber());
        existingStudent.setDateOfBirth(studentDTO.getDateOfBirth());
        existingStudent.setAddress(studentDTO.getAddress());

        return studentRepository.save(existingStudent);
    }

}