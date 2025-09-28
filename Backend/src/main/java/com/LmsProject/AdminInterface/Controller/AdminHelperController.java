package com.LmsProject.AdminInterface.Controller;

import com.LmsProject.AdminInterface.DTO.AdminHelperResponseDTO;
import com.LmsProject.AdminInterface.DTO.SemesterInfoDTO;
import com.LmsProject.AdminInterface.Model.Student;
import com.LmsProject.AdminInterface.Repository.StudentRepository;
import com.LmsProject.AdminInterface.Service.SemesterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/helper")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AdminHelperController {

    private final SemesterService semesterService;
    private final StudentRepository studentRepository;

    @GetMapping("/semester-and-batch-info")
    public AdminHelperResponseDTO getSemesterAndBatchInfo() {
        List<SemesterInfoDTO> semesterInfo = semesterService.getAllSemesters().stream()
                .map(semester -> new SemesterInfoDTO(
                        semester.getSemesterId(),
                        semester.getSemesterName(),
                        semester.getAcademicYear()))
                .collect(Collectors.toList());

        List<String> batches = studentRepository.findAll().stream()
                .map(Student::getBatch)
                .distinct()
                .collect(Collectors.toList());

        return new AdminHelperResponseDTO(semesterInfo, batches);
    }
}