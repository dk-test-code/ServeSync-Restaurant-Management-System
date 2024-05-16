package com.servesync.models;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FoodItem> foodItems;
    
    @Column(name = "is_available")
    private boolean available;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    @JsonFormat(pattern="HH:mm:ss dd-MM-yyyy")
    private Date createdAt;
}

    
    //If we would have used DTO we wouldnt have managed this!!
    //Here I wanted to keep the naming of the entity as isAvailable but as per the json naming conventions it is not allowed because then the automatic generated getter would be named as isIsAvailable which is not suitable
//    // Getter method following JavaBeans conventions
//    @JsonProperty("isAvailable")
//    public boolean isAvailable() {
//        return available;
//    }
