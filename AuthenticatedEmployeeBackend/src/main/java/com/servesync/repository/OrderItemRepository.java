// OrderItemRepository.java
package com.servesync.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.servesync.enums.ItemDeliveryStatus;
import com.servesync.models.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findOrderItemsByOrderId(Long orderId);
    List<OrderItem> findByDeliveryStatus(ItemDeliveryStatus deliveryStatus);
}
