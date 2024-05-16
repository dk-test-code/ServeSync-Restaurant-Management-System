package com.servesync.models;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.servesync.enums.ItemDeliveryStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "table_id")
    private Long tableId;
    
    @Column(name = "table_name")
    private String tableName;

    @Column(name = "food_item_id")
    private Long foodItemId;
    
    private String name;
       
    private double price;
    
    private double totalPrice;

    private int quantity;

    
    @Enumerated(EnumType.STRING)
    private ItemDeliveryStatus deliveryStatus=ItemDeliveryStatus.PENDING;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    @JsonFormat(pattern="HH:mm:ss dd-MM-yyyy")
 
    private Date createdAt;
}
