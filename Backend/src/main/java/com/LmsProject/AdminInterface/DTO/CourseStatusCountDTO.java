package com.LmsProject.AdminInterface.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseStatusCountDTO {
    private long activeCount;
    private long completedCount;
}