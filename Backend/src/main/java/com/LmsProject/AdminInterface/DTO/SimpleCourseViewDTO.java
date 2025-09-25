package com.LmsProject.AdminInterface.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleCourseViewDTO {
    private Long courseId;
    private String courseName;
    private String courseImage;
    private String semesterId;
    private String semesterName;
    private String academicYear;
    private List<StudentViewLectureDTO> lectures;
}