// DiningTableRepository.java
package com.servesync.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.servesync.models.DiningTable;

@Repository
public interface DiningTableRepository extends JpaRepository<DiningTable, Long> {
	
	// Define custom query method to find dining tables by current status
    @Query("SELECT dt FROM DiningTable dt WHERE dt.currentStatus = :status")
    List<DiningTable> findByCurrentStatus(String status);
}
