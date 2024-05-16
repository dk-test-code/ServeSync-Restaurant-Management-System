package com.servesync.models;

import java.util.Set;

import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//ApplicationUser.java

@Entity
@Table(name="users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationUser implements UserDetails {

 @Id
 @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Integer userId;

 @Column(unique=true)
 private String username;
 
 @JsonIgnore
 private String password;
 private String firstName;
 private String lastName;
 @Column(unique=true)
 private String mobileNumber;
 @Column(unique = true)
 private String email;

 @ManyToMany(fetch=FetchType.EAGER)
 @JoinTable(
     name="user_role_junction",
     joinColumns = {@JoinColumn(name="user_id")},
     inverseJoinColumns = {@JoinColumn(name="role_id")}
 )
 private Set<Role> authorities;



	/* If you want account locking capabilities create variables and ways to set them for the methods below */
	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}
    
}
