package com.servesync.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/employee")
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {
	
    @GetMapping("/")
    public String helloEmployeeController(){
        return "Employee access level";
    }
    
}
