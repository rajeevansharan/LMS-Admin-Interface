package com.LmsProject.AdminInterface.DTO;

import java.time.LocalDate;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchEventRequestDTO {
    private String title;
    private LocalDate date;
    private String description;
    private String createdBy;
    private String batch;
}