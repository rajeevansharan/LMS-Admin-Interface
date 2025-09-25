package com.LmsProject.AdminInterface.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminHelperResponseDTO {
    private List<SemesterInfoDTO> semesters;
    private List<String> batches;
}