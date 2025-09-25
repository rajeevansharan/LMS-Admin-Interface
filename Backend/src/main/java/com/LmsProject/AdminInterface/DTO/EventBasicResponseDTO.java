package com.LmsProject.AdminInterface.DTO;// EventBasicResponseDTO.java

import java.time.LocalDate;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventBasicResponseDTO {
    private Long id;
    private String title;
    private LocalDate date;
    private Long courseId;
    private String eventType; // "COURSE_EVENT" or "BATCH_EVENT"
}