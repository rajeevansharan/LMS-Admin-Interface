package com.LmsProject.AdminInterface.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "administrator")
@Data
@EqualsAndHashCode(callSuper = true)

public class Administrator extends Person {}
