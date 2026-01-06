package com.smartparking.model;

/**
 * Vehicle Type Enum
 * Defines different types of vehicles supported by the parking system
 */
public enum VehicleType {
    BIKE("Bike/Motorcycle", "Two-wheelers including motorcycles and scooters"),
    CAR("Car", "Standard cars and sedans"),
    SUV("SUV", "Sport Utility Vehicles and larger cars"),
    TRUCK("Truck/Van", "Commercial vehicles, trucks, and vans");

    private final String displayName;
    private final String description;

    VehicleType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Get VehicleType from string (case-insensitive)
     */
    public static VehicleType fromString(String type) {
        if (type == null) {
            return CAR; // Default to CAR
        }
        
        String upperType = type.trim().toUpperCase();
        try {
            return VehicleType.valueOf(upperType);
        } catch (IllegalArgumentException e) {
            // Try to match by display name
            for (VehicleType vt : VehicleType.values()) {
                if (vt.displayName.equalsIgnoreCase(type) || 
                    vt.name().equalsIgnoreCase(type)) {
                    return vt;
                }
            }
            return CAR; // Default fallback
        }
    }
}
