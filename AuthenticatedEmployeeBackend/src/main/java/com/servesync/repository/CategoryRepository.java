package com.servesync.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.servesync.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	
	Optional<Category> findByName(String name);
}
