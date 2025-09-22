package com.LmsProject.AdminInterface.Service;
import java.util.Optional;
import com.LmsProject.AdminInterface.DTO.AdminDTO;
import com.LmsProject.AdminInterface.Model.Administrator;
import com.LmsProject.AdminInterface.Repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

  @Autowired private AdminRepository adminRepository;

  public Optional<AdminDTO> getAdminProfile(Long adminId) {
    return adminRepository
            .findById(adminId)
            .map(this::convertToDto); // Convert Admin entity to AdminDTO
  }


  public Optional<AdminDTO> getAdminProfileByUsername(String username) {
    return adminRepository
            .findByUsername(username)
            .map(this::convertToDto);
  }
  // New method to convert Admin to AdminDTO
  private AdminDTO convertToDto(Administrator admin) {
    AdminDTO dto = new AdminDTO();
    dto.setPersonId(admin.getPersonId());
    dto.setName(admin.getName());
    dto.setUsername(admin.getUsername());
    dto.setAddress(admin.getAddress());
    dto.setDateOfBirth(admin.getDateOfBirth());
    dto.setPhoneNumber(admin.getPhoneNumber());
    dto.setEmail(admin.getEmail());
    dto.setProfilePicture(admin.getProfilePicture());
    return dto;
  }
}
