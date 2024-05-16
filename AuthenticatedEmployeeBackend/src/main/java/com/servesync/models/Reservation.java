package com.servesync.models;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.servesync.enums.ReservationStatus;

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
public class Reservation {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ReservationId;
		
	private String customerName;
	
	private String customerMobile;
	
	private String customerEmail;
	
	private Integer partySize;
	
	private String specialRequests;
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private Date timeSubmitted;
	
	@Temporal(TemporalType.DATE)
    @Column(name = "reservation_date")
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date reservationDate; 
    
	@Temporal(TemporalType.TIME)
	@Column(name = "reservation_time")
	@JsonFormat(pattern="hh:mm:ss")
	private Date reservationTime; 
    
    @Column(nullable = true)
    private String tableName;
	
	@Enumerated(EnumType.STRING)
    private ReservationStatus reservationStatus=ReservationStatus.PENDING;
}
