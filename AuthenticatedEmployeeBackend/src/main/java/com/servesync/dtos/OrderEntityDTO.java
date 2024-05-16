package com.servesync.dtos;

import java.util.Date;
import java.util.List;

import com.servesync.models.DiningTable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderEntityDTO {
    private Long orderId;
    private String orderType;
    private DiningTable diningTable;
    private double totalPrice;
    private double totalPriceWithTaxes;
    private double cgstPercent;
    private double sgstPercent;
    private double cgstAmount;
    private double sgstAmount;
    private Date createdAt;
    private String customerName;
    private String mobileNumber;
    private String status;
    private String paymentType;
    private List<OrderItemDTO> orderItems;
}
