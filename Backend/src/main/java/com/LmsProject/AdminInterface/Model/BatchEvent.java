package com.LmsProject.AdminInterface.Model;// BatchEvent.java



import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "batch_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class BatchEvent extends Event {

    @Column(nullable = false)
    private String batch;
}
