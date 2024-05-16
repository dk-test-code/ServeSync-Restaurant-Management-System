package com.servesync.dtos;

import java.util.Date;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiningTableDTO {
    private Long id;

    @NotBlank(message = "Please enter the table name.")
    @Pattern(regexp = "^[^\\d].*$", message = "Table name cannot start with a number.")
    @Pattern(regexp = "^[a-zA-Z0-9 ]*$", message = "Table name cannot contain special characters.")
    @Size(min = 2, max = 10, message = "Table name must be between 2 and 10 characters.")
    private String name;
    
    @NotBlank(message = "Please enter the table active status")
    private boolean active;

    private String currentStatus;

    @NotBlank(message = "Please enter the floor number.")
    @Pattern(regexp = "^[0-9]*$", message = "Floor Number can only contain digits.")
    @Size(max = 3, message = "Floor Number can contain maximum 3 characters")
    private String floorNumber;

    @Min(value = 1, message = "Capacity must be at least 1.")
    @Max(value = 30, message = "Capacity cannot exceed 30.")
    private Integer capacity;

    private Date createdAt;
}
