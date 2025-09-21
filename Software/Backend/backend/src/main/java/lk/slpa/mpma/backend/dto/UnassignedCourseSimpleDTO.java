package lk.slpa.mpma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnassignedCourseSimpleDTO {
    private Long courseId;
    private String name;
    private String courseImage;
    private Date startDate;
}