package lk.slpa.mpma.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AdminDashboardStatsDTO {


    private long  activeCourses;
    private long  completedCourses;
    private long totalStudents;

}


