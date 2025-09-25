package com.LmsProject.AdminInterface.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.LmsProject.AdminInterface.Model.BatchEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BatchEventRepository extends JpaRepository<BatchEvent, Long> {
    List<BatchEvent> findByBatch(String batch);

    List<BatchEvent> findByBatchAndDateGreaterThanEqual(String batch, LocalDate currentDate);

    @Query("SELECT be FROM BatchEvent be WHERE be.id = :id AND be.date >= :currentDate")
    Optional<BatchEvent> findByIdAndDateGreaterThanEqual(@Param("id") Long id, @Param("currentDate") LocalDate currentDate);

    List<BatchEvent> findByBatchAndDate(String batch, LocalDate date);

    List<BatchEvent> findByDateGreaterThanEqual(LocalDate currentDate);

}