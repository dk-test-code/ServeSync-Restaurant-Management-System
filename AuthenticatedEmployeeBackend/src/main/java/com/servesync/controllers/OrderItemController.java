// OrderItemController.java
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

import com.servesync.dtos.OrderItemDTO;
import com.servesync.services.OrderItemService;

@RestController
@RequestMapping("/order-items")
public class OrderItemController {

	@Autowired
	private OrderItemService orderItemService;

	@PostMapping
	public ResponseEntity<OrderItemDTO> createOrderItem(@RequestBody OrderItemDTO orderItemDTO) {
		OrderItemDTO createdOrderItem = orderItemService.createOrderItem(orderItemDTO);
		return ResponseEntity.ok(createdOrderItem);
	}
	@GetMapping("/pending")
    public ResponseEntity<List<OrderItemDTO>> getPendingOrderItems() {
        List<OrderItemDTO> pendingOrderItems = orderItemService.getPendingOrderItems();
        return ResponseEntity.ok(pendingOrderItems);
    }
	@GetMapping
	public ResponseEntity<List<OrderItemDTO>> getOrderItemsByOrderId(@RequestParam Long orderId) {
		List<OrderItemDTO> orderItems = orderItemService.getOrderItemsByOrderId(orderId);
		return ResponseEntity.ok(orderItems);
	}

	@GetMapping("/{id}")
	public ResponseEntity<OrderItemDTO> getOrderItemById(@PathVariable("id") Long id) {
		OrderItemDTO orderItemDTO = orderItemService.getOrderItemById(id);
		return ResponseEntity.ok(orderItemDTO);
	}

	@PutMapping("/{id}")
	public ResponseEntity<OrderItemDTO> updateOrderItem(@PathVariable("id") Long id,
			@RequestBody OrderItemDTO orderItemDTO) {
		OrderItemDTO updatedOrderItem = orderItemService.updateOrderItem(id, orderItemDTO);
		return ResponseEntity.ok(updatedOrderItem);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteOrderItem(@PathVariable("id") Long id) {
		orderItemService.deleteOrderItem(id);
		return ResponseEntity.noContent().build();
	}
}
