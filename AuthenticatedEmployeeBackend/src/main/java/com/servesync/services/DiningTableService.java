// DiningTableService.java
package com.servesync.services;

import com.servesync.dtos.DiningTableDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.servesync.models.DiningTable;
import com.servesync.repository.DiningTableRepository;

@Service
public class DiningTableService {

    @Autowired
    private DiningTableRepository diningTableRepository;

    public List<DiningTableDTO> getAllDiningTables() {
        List<DiningTable> diningTables = diningTableRepository.findAll();
        return diningTables.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public List<DiningTableDTO> getAvailableDiningTables() {
        List<DiningTable> availableTables = diningTableRepository.findByCurrentStatus("AVAILABLE");
        return availableTables.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public Optional<DiningTableDTO> getDiningTableById(Long id) {
        Optional<DiningTable> diningTable = diningTableRepository.findById(id);
        return diningTable.map(this::convertToDTO);
    }

    public DiningTableDTO addDiningTable(DiningTableDTO diningTableDTO) {
        DiningTable diningTable = convertToEntity(diningTableDTO);
        diningTable.setCreatedAt(new Date());
        diningTable.setCurrentStatus(determineInitialStatus(diningTableDTO.isActive()));
        DiningTable savedDiningTable = diningTableRepository.save(diningTable);
        return convertToDTO(savedDiningTable);
    }

    private String determineInitialStatus(boolean isActive) {
        if (isActive) {
            return "AVAILABLE";
        } else {
            return "OUT OF SERVICE";
        }
    }

    public Optional<DiningTableDTO> updateDiningTable(Long id, DiningTableDTO diningTableDTO) {
        Optional<DiningTable> diningTableOptional = diningTableRepository.findById(id);
        if (diningTableOptional.isPresent()) {
            DiningTable existingDiningTable = diningTableOptional.get();
            String currentStatus = existingDiningTable.getCurrentStatus();
            boolean isActive = diningTableDTO.isActive();
            boolean statusChanged = existingDiningTable.isActive() != isActive;

            // Update other properties if they are not null
            if (diningTableDTO.getName() != null) {
                existingDiningTable.setName(diningTableDTO.getName());
            }
            existingDiningTable.setActive(diningTableDTO.isActive());
            if (diningTableDTO.getFloorNumber() != null) {
                existingDiningTable.setFloorNumber(diningTableDTO.getFloorNumber());
            }
            if (diningTableDTO.getCapacity() != null) {
                existingDiningTable.setCapacity(diningTableDTO.getCapacity());
            }
            if (diningTableDTO.getCurrentStatus() != null) {
                existingDiningTable.setCurrentStatus(diningTableDTO.getCurrentStatus());
            }

            // Check and update the status separately
            if (statusChanged) {
                if (!isActive && "AVAILABLE".equals(currentStatus)) {
                    existingDiningTable.setCurrentStatus("OUT OF SERVICE");
                } else if (isActive && ("OUT OF SERVICE".equals(currentStatus) || "OCCUPIED".equals(currentStatus))) {
                    existingDiningTable.setCurrentStatus("AVAILABLE");
                } else if (isActive && "AVAILABLE".equals(currentStatus)) {
                    existingDiningTable.setCurrentStatus("OCCUPIED");
                }

                // If the table is currently occupied and is being made inactive, return empty
                if (!isActive && "OCCUPIED".equals(currentStatus)) {
                    return Optional.empty();
                }
            }

            // Update the entity
            DiningTable updatedDiningTable = diningTableRepository.save(existingDiningTable);
            return Optional.of(convertToDTO(updatedDiningTable));
        }
        return Optional.empty();
    }



    public void deleteDiningTable(Long id) {
        diningTableRepository.deleteById(id);
    }

    private DiningTableDTO convertToDTO(DiningTable diningTable) {
        DiningTableDTO diningTableDTO = new DiningTableDTO();
        BeanUtils.copyProperties(diningTable, diningTableDTO);
        return diningTableDTO;
    }

    private DiningTable convertToEntity(DiningTableDTO diningTableDTO) {
        DiningTable diningTable = new DiningTable();
        BeanUtils.copyProperties(diningTableDTO, diningTable);
        return diningTable;
    }
}
