package com.servesync.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.servesync.dtos.FoodItemDTO;
import com.servesync.exceptions.ResourceNotFoundException;
import com.servesync.models.Category;
import com.servesync.models.FoodItem;
import com.servesync.repository.FoodItemRepository;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private CategoryService categoryService;

    public List<FoodItemDTO> getAllFoodItems() {
        List<FoodItem> foodItems = foodItemRepository.findAll();
        return foodItems.stream()
                .map(this::convertToFoodItemDTO)
                .collect(Collectors.toList());
    }

    public long getFoodItemCount() {
        return foodItemRepository.count();
    }

    public long getFoodItemCountByCategory(Long categoryId) {
        return foodItemRepository.countByCategoryId(categoryId);
    }

    public void addFoodItem(FoodItemDTO foodItemDTO, MultipartFile image) throws IOException {
        FoodItem foodItem = convertToFoodItem(foodItemDTO);
        if (image != null && !image.isEmpty()) {
            foodItem.setImageData(image.getBytes());
        }
        foodItemRepository.save(foodItem);
    }

    public void updateFoodItem(Long id, FoodItemDTO foodItemDTO, MultipartFile image) throws IOException {
        FoodItem existingFoodItem = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));

        FoodItem updatedFoodItem = convertToFoodItem(foodItemDTO);
        updatedFoodItem.setId(existingFoodItem.getId());

        if (image != null && !image.isEmpty()) {
            updatedFoodItem.setImageData(image.getBytes());
        } else {
            // If image is not updated, retain the existing image data
            updatedFoodItem.setImageData(existingFoodItem.getImageData());
        }

        foodItemRepository.save(updatedFoodItem);
    }

    public void deleteFoodItem(Long id) {
        foodItemRepository.deleteById(id);
    }

    private FoodItemDTO convertToFoodItemDTO(FoodItem foodItem) {
        FoodItemDTO foodItemDTO = new FoodItemDTO();
        foodItemDTO.setId(foodItem.getId());
        foodItemDTO.setName(foodItem.getName());
        foodItemDTO.setPrice(foodItem.getPrice());
        foodItemDTO.setAvailable(foodItem.isAvailable());
        foodItemDTO.setCreatedAt(foodItem.getCreatedAt()); 
        if (foodItem.getCategory() != null) {
            foodItemDTO.setCategoryName(foodItem.getCategory().getName());
            foodItemDTO.setCategoryId(foodItem.getCategory().getId());
        }
        if (foodItem.getImageData() != null) {
            foodItemDTO.setImageData(foodItem.getImageData());
        }
        return foodItemDTO;
    }
    
    private FoodItem convertToFoodItem(FoodItemDTO foodItemDTO) {
        FoodItem foodItem = new FoodItem();
        foodItem.setId(foodItemDTO.getId());
        foodItem.setName(foodItemDTO.getName());
        foodItem.setPrice(foodItemDTO.getPrice());
        foodItem.setAvailable(foodItemDTO.isAvailable());
        foodItem.setCreatedAt(foodItemDTO.getCreatedAt()); 
        Long categoryId = foodItemDTO.getCategoryId();
        String categoryName = foodItemDTO.getCategoryName();
        
        if (categoryId != null) {
            Category category = categoryService.findById(categoryId);
            if (category == null) {
                throw new IllegalArgumentException("Category with ID " + categoryId + " not found.");
            }
            foodItem.setCategory(category);
        } else if (categoryName != null) {
            Category category = categoryService.findByName(categoryName);
            if (category == null) {
                throw new IllegalArgumentException("Category with name " + categoryName + " not found.");
            }
            foodItem.setCategory(category);
        } else {
            throw new IllegalArgumentException("Category ID or name is required.");
        }
        return foodItem;
    }
}
