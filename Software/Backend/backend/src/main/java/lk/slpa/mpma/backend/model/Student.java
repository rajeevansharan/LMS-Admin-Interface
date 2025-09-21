package lk.slpa.mpma.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student")
@PrimaryKeyJoinColumn(
        name = "person_id") // FK created in student table  as person_id that references person_id PK in
// person table
// Both PK in the person table and FK in student table should have same column name
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Student extends Person {

    // Academic Information
    /** Represents the department associated with a student. */
    private String department;



    /** Represents the academic year associated with a student. */
    private String batch;

}

