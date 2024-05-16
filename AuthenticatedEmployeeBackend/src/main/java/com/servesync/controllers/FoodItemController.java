package com.servesync.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.servesync.dtos.FoodItemDTO;
import com.servesync.services.FoodItemService;

import java.util.List;

@RestController
@RequestMapping("/food-items")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @GetMapping
    public ResponseEntity<List<FoodItemDTO>> getAllFoodItems() {
        List<FoodItemDTO> foodItemDTOs = foodItemService.getAllFoodItems();
        return ResponseEntity.ok(foodItemDTOs);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getFoodItemCount() {
        long count = foodItemService.getFoodItemCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/{categoryId}")
    public ResponseEntity<Long> getFoodItemCountByCategory(@PathVariable Long categoryId) {
        long count = foodItemService.getFoodItemCountByCategory(categoryId);
        return ResponseEntity.ok(count);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<String> addFoodItem(
            @RequestPart("foodItemDTO") FoodItemDTO foodItemDTO,
            @RequestPart("image") MultipartFile image
    ) {
        try {
            foodItemService.addFoodItem(foodItemDTO, image);
            return ResponseEntity.status(HttpStatus.CREATED).body("Food item added successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error adding food item: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding food item: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateFoodItem(
            @PathVariable Long id,
            @RequestPart("foodItemDTO") FoodItemDTO foodItemDTO,
            @RequestPart(name = "image", required = false) MultipartFile image
    ) {
        try {
            foodItemService.updateFoodItem(id, foodItemDTO, image);
            return ResponseEntity.ok("Food item updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating food item: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFoodItem(@PathVariable Long id) {
        try {
            foodItemService.deleteFoodItem(id);
            return ResponseEntity.ok("Food item deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting food item: " + e.getMessage());
        }
    }
}
