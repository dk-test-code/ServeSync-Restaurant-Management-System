package com.servesync.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.servesync.enums.ReservationStatus;
import lombok.Data;

import java.util.Date;

@Data
public class ReservationDTO {
    private Long reservationId;
    private String customerName;
    private String customerMobile;
    private String customerEmail;
    private Integer partySize;
    private String specialRequests;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private Date timeSubmitted;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date reservationDate;

    @JsonFormat(pattern="HH:mm:ss")
    private Date reservationTime;

    private String tableName;
    private ReservationStatus reservationStatus;
}
