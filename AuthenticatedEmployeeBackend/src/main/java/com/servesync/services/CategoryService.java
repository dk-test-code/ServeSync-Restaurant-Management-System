package com.servesync.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.servesync.dtos.CategoryRequestDTO;
import com.servesync.exceptions.ResourceNotFoundException;
import com.servesync.models.Category;
import com.servesync.models.FoodItem;
import com.servesync.repository.CategoryRepository;
import com.servesync.repository.FoodItemRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
   
    @Autowired
    private FoodItemRepository foodItemRepository;

    public List<CategoryRequestDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryRequestDTO> responseDTOs = new ArrayList<>();
        for (Category category : categories) {
            responseDTOs.add(convertToRequestDTO(category));
        }
        return responseDTOs;
    }
    
    public Category findById(Long id) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        return categoryOptional.orElse(null);
    }
    
    public Category findByName(String name) {
        return categoryRepository.findByName(name).orElse(null);
    }
    
    public long getCategoryCount() {
        return categoryRepository.count(); 
    }


    public CategoryRequestDTO createCategory(CategoryRequestDTO categoryRequestDTO) {
        Category category = new Category();
        category.setName(categoryRequestDTO.getName());
        category.setAvailable(categoryRequestDTO.isAvailable());
        category.setCreatedAt(new Date()); // Set the creation date
        category = categoryRepository.save(category);
        return convertToRequestDTO(category);
    }

    public CategoryRequestDTO updateCategory(Long id, CategoryRequestDTO categoryRequestDTO) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();
            category.setName(categoryRequestDTO.getName());
            category.setAvailable(categoryRequestDTO.isAvailable());
            categoryRepository.save(category);
            return convertToRequestDTO(category);
        } else {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
    }

    public void deleteCategory(Long id) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();
            // Delete associated food items
            List<FoodItem> foodItems = category.getFoodItems();
            for (FoodItem foodItem : foodItems) {
                foodItemRepository.delete(foodItem);
            }
            categoryRepository.delete(category);
        } else {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
    }

    // Method to convert Category entity to CategoryResponseDTO
    private CategoryRequestDTO convertToRequestDTO(Category category) {
        CategoryRequestDTO responseDTO = new CategoryRequestDTO();
        responseDTO.setId(category.getId());
        responseDTO.setName(category.getName());
        responseDTO.setAvailable(category.isAvailable());
        responseDTO.setCreatedAt(category.getCreatedAt()); // Set the creation date
        return responseDTO;
    }
}
