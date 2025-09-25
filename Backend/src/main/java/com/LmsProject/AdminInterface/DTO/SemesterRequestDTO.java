package com.LmsProject.AdminInterface.DTO;

import lombok.Data;

import java.util.List;

@Data
public class SemesterRequestDTO {
    private String semesterId;
    private String semesterName;
    private String academicYear;
    private List<Long> courseIds;
}