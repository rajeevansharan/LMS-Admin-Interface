package lk.slpa.mpma.backend.repository;

import lk.slpa.mpma.backend.model.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Administrator, Long> {

        Optional<Administrator> findByUsername(String username);
    }


