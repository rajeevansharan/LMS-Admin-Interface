package lk.slpa.mpma.backend.dto;

import lk.slpa.mpma.backend.model.Course;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@Setter
public class UnassignedCourseDetailsDTO {
    private Long courseId;
    private String name;
    private Date startDate;
    private Date endDate;
    private Course.CourseStatus status;
    private Set<AdminViewLectureDTO> lectures;
}