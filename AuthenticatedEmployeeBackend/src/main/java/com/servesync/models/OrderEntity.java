package com.servesync.models;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.servesync.enums.OrderStatus;
import com.servesync.enums.OrderType;
import com.servesync.enums.PaymentType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Enumerated(EnumType.STRING)
    private OrderType orderType;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private DiningTable diningTable;

    private double totalPrice;
    
   private double totalPriceWithTaxes;

    private double cgstPercent;

    private double sgstPercent;

    private double cgstAmount;

    private double sgstAmount;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    @JsonFormat(pattern="HH:mm:ss dd-MM-yyyy")
    private Date createdAt;

    private String customerName;

    private String mobileNumber;

    @Enumerated(EnumType.STRING)
    private OrderStatus status=OrderStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;
    
    @OneToMany(mappedBy = "orderId",fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<OrderItem> orderItems;
}
