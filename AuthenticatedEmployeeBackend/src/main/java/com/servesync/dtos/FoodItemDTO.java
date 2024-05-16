package com.servesync.dtos;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FoodItemDTO {
    private Long id;
    private String name;
    private Long categoryId; // Add categoryId field to associate the food item with a category
    private String categoryName; // Add categoryName field to display the category name
    private double price;
    private boolean available;
    private byte[] imageData; // Byte array to store image 
    private Date createdAt;
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
