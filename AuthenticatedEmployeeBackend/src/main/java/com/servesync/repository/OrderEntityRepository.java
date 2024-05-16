// OrderEntityRepository.java
package com.servesync.repository;

import java.util.Date;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.servesync.enums.OrderStatus;
import com.servesync.models.OrderEntity;

@Repository
public interface OrderEntityRepository extends JpaRepository<OrderEntity, Long> {

    Optional<OrderEntity> findOrderIdByDiningTableIdAndStatus(Long tableId, OrderStatus status);

    @Query(value = "SELECT COUNT(*) FROM orders WHERE DATE_FORMAT(created_at, '%Y-%m-%d') = DATE_FORMAT(?1, '%Y-%m-%d')", nativeQuery = true)
    Long countOrdersCreatedToday(Date today);
    
    @Query("SELECT COALESCE(SUM(o.totalPriceWithTaxes), 0) FROM OrderEntity o WHERE DATE(o.createdAt) = DATE(:today)")
    Double calculateRevenueForToday(Date today);
    
    @Query("SELECT COALESCE(SUM(o.totalPriceWithTaxes), 0) FROM OrderEntity o WHERE YEAR(o.createdAt) = YEAR(CURRENT_DATE) AND MONTH(o.createdAt) = MONTH(CURRENT_DATE)")
    Double calculateRevenueGeneratedThisMonth();
}
