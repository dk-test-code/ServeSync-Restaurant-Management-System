// DiningTableController.java
package com.servesync.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.servesync.dtos.DiningTableDTO;
import com.servesync.services.DiningTableService;

@RestController
@RequestMapping("/dining-tables")
public class DiningTableController {

    @Autowired
    private DiningTableService diningTableService;

    @GetMapping
    public ResponseEntity<List<DiningTableDTO>> getAllDiningTables() {
        List<DiningTableDTO> diningTables = diningTableService.getAllDiningTables();
        return ResponseEntity.ok(diningTables);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiningTableDTO> getDiningTableById(@PathVariable Long id) {
        Optional<DiningTableDTO> diningTable = diningTableService.getDiningTableById(id);
        return diningTable.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<DiningTableDTO>> getAvailableDiningTables() {
        List<DiningTableDTO> availableDiningTables = diningTableService.getAvailableDiningTables();
        return ResponseEntity.ok(availableDiningTables);
    }

    @PostMapping
    public ResponseEntity<DiningTableDTO> addDiningTable(@RequestBody DiningTableDTO diningTableDTO) {
        DiningTableDTO savedDiningTable = diningTableService.addDiningTable(diningTableDTO);
        return new ResponseEntity<>(savedDiningTable, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiningTableDTO> updateDiningTable(@PathVariable Long id, @RequestBody DiningTableDTO diningTableDTO) {
        Optional<DiningTableDTO> updatedDiningTable = diningTableService.updateDiningTable(id, diningTableDTO);
        return updatedDiningTable.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiningTable(@PathVariable Long id) {
        diningTableService.deleteDiningTable(id);
        return ResponseEntity.noContent().build();
    }
}
