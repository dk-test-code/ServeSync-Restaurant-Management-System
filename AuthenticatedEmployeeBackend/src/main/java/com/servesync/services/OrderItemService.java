// OrderItemService.java
package com.servesync.services;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.servesync.dtos.OrderItemDTO;
import com.servesync.enums.ItemDeliveryStatus;
import com.servesync.models.OrderItem;
import com.servesync.repository.OrderItemRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ModelMapper modelMapper;

    public OrderItemDTO createOrderItem(OrderItemDTO orderItemDTO) {
        OrderItem orderItem = modelMapper.map(orderItemDTO, OrderItem.class);
        orderItem = orderItemRepository.save(orderItem);
        return modelMapper.map(orderItem, OrderItemDTO.class);
    }
    
    public OrderItemDTO getOrderItemById(Long id) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order item not found with id: " + id));
        return modelMapper.map(orderItem, OrderItemDTO.class);
    }
    public List<OrderItemDTO> getPendingOrderItems() {
        List<OrderItem> pendingOrderItems = orderItemRepository.findByDeliveryStatus(ItemDeliveryStatus.PENDING);
        return pendingOrderItems.stream()
                .map(orderItem -> modelMapper.map(orderItem, OrderItemDTO.class))
                .collect(Collectors.toList());
    }
    
    public List<OrderItemDTO> getOrderItemsByOrderId(Long orderId) {
        try {
            List<OrderItem> orderItems = orderItemRepository.findOrderItemsByOrderId(orderId);
            return orderItems.stream()
                    .map(orderItem -> modelMapper.map(orderItem, OrderItemDTO.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace(); 
            return Collections.emptyList(); 
        }
    }


    public OrderItemDTO updateOrderItem(Long id, OrderItemDTO orderItemDTO) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order item not found with id: " + id));
        modelMapper.map(orderItemDTO, orderItem);
        orderItem = orderItemRepository.save(orderItem);
        return modelMapper.map(orderItem, OrderItemDTO.class);
    }

    public void deleteOrderItem(Long id) {
        if (!orderItemRepository.existsById(id)) {
            throw new EntityNotFoundException("Order item not found with id: " + id);
        }
        orderItemRepository.deleteById(id);
    }
}
