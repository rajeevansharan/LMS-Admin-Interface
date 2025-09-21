package lk.slpa.mpma.backend.dto;

import lombok.Data;
import java.util.Date;

@Data
public class CourseCreateDTO {
    private Long courseId;
    private String name;
    private Date startDate;
}