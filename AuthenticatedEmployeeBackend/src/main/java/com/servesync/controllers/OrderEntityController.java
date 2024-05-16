// OrderEntityController.java
package com.servesync.controllers;
 
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.servesync.dtos.OrderEntityDTO;
import com.servesync.enums.OrderStatus;
import com.servesync.services.OrderEntityService;
 
@RestController
@RequestMapping("/orders")
public class OrderEntityController {
 
    @Autowired
    private OrderEntityService orderEntityService;
    
    @GetMapping
    public ResponseEntity<List<OrderEntityDTO>> getAllOrders() {
        List<OrderEntityDTO> orders = orderEntityService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    @PostMapping
    public ResponseEntity<OrderEntityDTO> createOrder(@RequestBody OrderEntityDTO orderEntityDTO) {
        OrderEntityDTO createdOrderEntity = orderEntityService.createOrder(orderEntityDTO);
        return ResponseEntity.ok(createdOrderEntity);
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<OrderEntityDTO> getOrderById(@PathVariable("id") Long id) {
        OrderEntityDTO orderEntityDTO = orderEntityService.getOrderById(id);
        return ResponseEntity.ok(orderEntityDTO);
    }
    
    @GetMapping("/findOrderId")
    public ResponseEntity<Long> findOrderIdByTableIdAndPaymentStatus(
            @RequestParam("tableId") Long tableId,
            @RequestParam("paymentStatus") String paymentStatus) {
    
    	OrderStatus status = OrderStatus.PENDING;
 
    	Long orderId = orderEntityService.findOrderIdByDiningTableIdAndStatus(tableId, status);
        return ResponseEntity.ok(orderId);
    }
    
    @GetMapping("/orders-placed-today")
    public ResponseEntity<Long> getOrdersPlacedTodayCount() {
        Long ordersPlacedTodayCount = orderEntityService.getOrdersPlacedTodayCount();
        return ResponseEntity.ok(ordersPlacedTodayCount);
    }
    @GetMapping("/revenue-generated-today")
    public ResponseEntity<Double> getRevenueGeneratedToday() {
        Double revenueGeneratedToday = orderEntityService.getRevenueGeneratedToday();
        return ResponseEntity.ok(revenueGeneratedToday);
    }
    
    @GetMapping("/revenue-generated-this-month")
    public ResponseEntity<Double> getRevenueGeneratedThisMonth() {
        Double revenueGeneratedThisMonth = orderEntityService.getRevenueGeneratedThisMonth();
        return ResponseEntity.ok(revenueGeneratedThisMonth);
    }
    @PutMapping("/{id}")
    public ResponseEntity<OrderEntityDTO> updateOrder(@PathVariable("id") Long id, @RequestBody OrderEntityDTO orderEntityDTO) {
        OrderEntityDTO updatedOrderEntity = orderEntityService.updateOrder(id, orderEntityDTO);
        return ResponseEntity.ok(updatedOrderEntity);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable("id") Long id) {
        orderEntityService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
 