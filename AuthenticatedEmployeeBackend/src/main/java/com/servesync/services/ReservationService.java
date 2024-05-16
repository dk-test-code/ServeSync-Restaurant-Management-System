package com.servesync.services;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.servesync.dtos.ReservationDTO;
import com.servesync.enums.ReservationStatus;
import com.servesync.models.Reservation;
import com.servesync.repository.ReservationRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ReservationDTO createReservation(ReservationDTO reservationDTO) {
        Reservation reservation = modelMapper.map(reservationDTO, Reservation.class);
        reservation.setReservationStatus(ReservationStatus.PENDING);
        
        // Subtract 5 hours and 30 minutes
        Calendar cal = Calendar.getInstance();
        cal.setTime(reservation.getReservationTime());
        cal.add(Calendar.HOUR_OF_DAY, -5);
        cal.add(Calendar.MINUTE, -30);
        Date adjustedReservationTime = cal.getTime();

        // Set the adjusted reservation time
        reservation.setReservationTime(adjustedReservationTime);
        reservation = reservationRepository.save(reservation);
        return modelMapper.map(reservation, ReservationDTO.class);
    }


    public ReservationDTO getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + id));
        return modelMapper.map(reservation, ReservationDTO.class);
    }

    public List<ReservationDTO> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        return reservations.stream()
                .map(reservation -> modelMapper.map(reservation, ReservationDTO.class))
                .collect(Collectors.toList());
    }
    public List<Reservation> getReservationsByEmailAndDate(String email, LocalDate date) {
        // Convert LocalDate to Date using UTC timezone
        Date utilDate = Date.from(date.atStartOfDay(ZoneOffset.UTC).toInstant());

        // Use utilDate in your query
        return reservationRepository.findByCustomerEmailAndReservationDate(email, utilDate);
    }
    
    public ReservationDTO updateReservation(Long id, ReservationDTO reservationDTO) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + id));
        modelMapper.map(reservationDTO, reservation);
        reservation = reservationRepository.save(reservation);
        return modelMapper.map(reservation, ReservationDTO.class);
    }

    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new EntityNotFoundException("Reservation not found with id: " + id);
        }
        reservationRepository.deleteById(id);
    }
}
