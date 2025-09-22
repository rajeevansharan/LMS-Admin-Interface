package com.LmsProject.AdminInterface.Repository;

import com.LmsProject.AdminInterface.Model.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Administrator, Long> {

        Optional<Administrator> findByUsername(String username);
    }


