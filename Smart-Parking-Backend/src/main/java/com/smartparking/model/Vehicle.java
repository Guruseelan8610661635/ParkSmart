package com.smartparking.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = true)
    private String make;  // e.g., "Toyota"

    @Column(nullable = true)
    private String model;  // e.g., "Camry"

    @Column(nullable = true)
    private String color;

    @Column(nullable = false)
    private Boolean isDefault = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Constructors
    public Vehicle() {}

    public Vehicle(Long userId, VehicleType vehicleType, String registrationNumber) {
        this.userId = userId;
        this.vehicleType = vehicleType;
        this.registrationNumber = registrationNumber;
    }

    // Getters and Setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public Long getUserId() { 
        return userId; 
    }
    
    public void setUserId(Long userId) { 
        this.userId = userId; 
    }

    public VehicleType getVehicleType() { 
        return vehicleType; 
    }
    
    public void setVehicleType(VehicleType vehicleType) { 
        this.vehicleType = vehicleType; 
    }

    public String getRegistrationNumber() { 
        return registrationNumber; 
    }
    
    public void setRegistrationNumber(String registrationNumber) { 
        this.registrationNumber = registrationNumber; 
    }

    public String getMake() { 
        return make; 
    }
    
    public void setMake(String make) { 
        this.make = make; 
    }

    public String getModel() { 
        return model; 
    }
    
    public void setModel(String model) { 
        this.model = model; 
    }

    public String getColor() { 
        return color; 
    }
    
    public void setColor(String color) { 
        this.color = color; 
    }

    public Boolean getIsDefault() { 
        return isDefault; 
    }
    
    public void setIsDefault(Boolean isDefault) { 
        this.isDefault = isDefault; 
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }
    
    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }
}
