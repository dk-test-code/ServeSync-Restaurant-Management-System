package com.servesync.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servesync.dtos.RegistrationDTO;
import com.servesync.models.ApplicationUser;
import com.servesync.repository.UserRepository;
import com.servesync.services.AuthenticationService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    
    @Autowired
    private AuthenticationService authenticationService;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<ApplicationUser> registerUser(@RequestBody RegistrationDTO body) {
        // Check if the logged-in user is an admin
        boolean isAdmin = authenticationService.isAuthenticatedUserAdmin();
        
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        
        // Register the new user using the provided details
        ApplicationUser newUser = authenticationService.registerUser(body.getUsername(), body.getPassword(), body.getFirstName(), body.getLastName(), body.getMobileNumber(), body.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }
    @GetMapping("/list-employees")
    public List<ApplicationUser> getAllEmployees() {
    	
        return userRepository.findAll();
    }
    @DeleteMapping("/delete-employee/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Integer id) {
        authenticationService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
