package com.LmsProject.AdminInterface.DTO;

import java.time.LocalDate;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseEventRequestDTO {
    private String title;
    private LocalDate date;
    private String description;
    private Long courseId;
    private String batch ;
    private String createdBy;
    private Long enrollmentId;
    private String academicYear;
    private String semesterId;


}
