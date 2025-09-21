package lk.slpa.mpma.backend.controller;

import lk.slpa.mpma.backend.dto.AdminHelperResponseDTO;
import lk.slpa.mpma.backend.dto.SemesterInfoDTO;
import lk.slpa.mpma.backend.model.Student;
import lk.slpa.mpma.backend.repository.StudentRepository;
import lk.slpa.mpma.backend.service.SemesterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/helper")
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