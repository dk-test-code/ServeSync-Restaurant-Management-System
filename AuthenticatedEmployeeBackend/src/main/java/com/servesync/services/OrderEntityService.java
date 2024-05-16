// OrderEntityService.java
package com.servesync.services;
 
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.servesync.dtos.OrderEntityDTO;
import com.servesync.dtos.OrderItemDTO;
import com.servesync.enums.OrderStatus;
import com.servesync.models.OrderEntity;
import com.servesync.repository.OrderEntityRepository;

import jakarta.persistence.EntityNotFoundException;
 
@Service
public class OrderEntityService {
 
    @Autowired
    private OrderEntityRepository orderEntityRepository;
 
    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private OrderItemService orderItemService;
 
    public OrderEntityDTO createOrder(OrderEntityDTO orderEntityDTO) {
        OrderEntity orderEntity = modelMapper.map(orderEntityDTO, OrderEntity.class);
        orderEntity = orderEntityRepository.save(orderEntity);
        for(OrderItemDTO orderItemDTO : orderEntityDTO.getOrderItems()) {
        	orderItemDTO.setOrderId(orderEntity.getOrderId());
        	orderItemService.createOrderItem(orderItemDTO);
        }
        return modelMapper.map(orderEntity, OrderEntityDTO.class);
        
    }
    public List<OrderEntityDTO> getAllOrders() {
        List<OrderEntity> orders = orderEntityRepository.findAll();
        return orders.stream()
                .map(orderEntity -> modelMapper.map(orderEntity, OrderEntityDTO.class))
                .collect(Collectors.toList());
    }
    public OrderEntityDTO getOrderById(Long id) {
        OrderEntity orderEntity = orderEntityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
        return modelMapper.map(orderEntity, OrderEntityDTO.class);
    }
    public Double getRevenueGeneratedToday() {
        // Convert LocalDate to Date
        LocalDate today = LocalDate.now();
        Date todayDate = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());
        return orderEntityRepository.calculateRevenueForToday(todayDate);
    }
    
    public Double getRevenueGeneratedThisMonth() {
        // Call the repository method to calculate revenue generated today
        return orderEntityRepository.calculateRevenueGeneratedThisMonth();
    }
    public Long findOrderIdByDiningTableIdAndStatus(Long tableId, OrderStatus status) {
        OrderEntity orderEntity = orderEntityRepository.findOrderIdByDiningTableIdAndStatus(tableId, status)
                .orElseThrow(() -> new EntityNotFoundException("Order not found for table: " + tableId +
                                                                 " with payment status: " + status));
        return orderEntity.getOrderId();
    }
    public Long getOrdersPlacedTodayCount() {
        // Convert LocalDate to Date
        LocalDate today = LocalDate.now();
        Date todayDate = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());
        return orderEntityRepository.countOrdersCreatedToday(todayDate);
    }
    public OrderEntityDTO updateOrder(Long id, OrderEntityDTO orderEntityDTO) {
        OrderEntity orderEntity = orderEntityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
        modelMapper.map(orderEntityDTO, orderEntity);
        orderEntity = orderEntityRepository.save(orderEntity);
        return modelMapper.map(orderEntity, OrderEntityDTO.class);
    }
 
    public void deleteOrder(Long id) {
        if (!orderEntityRepository.existsById(id)) {
            throw new EntityNotFoundException("Order not found with id: " + id);
        }
        orderEntityRepository.deleteById(id);
    }
}

