package com.servesync.dtos;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private Long orderItemId;
    private Long orderId;
    private Long tableId ;
    private String tableName ;
    private Long foodItemId;
    private String name;
    private double price;
    private double totalPrice;
    private int quantity;
    private String deliveryStatus;
    private Date createdAt;
}
