package com.smartparking.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.smartparking.model.Location;
import com.smartparking.model.Slot;
import com.smartparking.repository.LocationRepository;
import com.smartparking.repository.SlotRepository;

@Component
@Order(2) // Run after DataInitializer
public class MapDataInitializer implements CommandLineRunner {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private org.springframework.core.env.Environment env;

    @Override
    public void run(String... args) throws Exception {
        
        // Only initialize sample data if explicitly enabled via environment variable
        // This prevents re-initialization when user deletes all locations
        String initSampleData = env.getProperty("app.init-sample-data", "false");
        
        if ("true".equalsIgnoreCase(initSampleData) && locationRepository.count() == 0) {
            createSampleLocations();
            System.out.println("✅ Sample Map Locations Created");
        } else if (!"true".equalsIgnoreCase(initSampleData) && locationRepository.count() == 0) {
            System.out.println("⚠️  No locations found. Set 'app.init-sample-data=true' to create sample data.");
        }
    }

    private void createSampleLocations() {
        
        // Location 1: Downtown Parking
        Location downtown = new Location();
        downtown.setName("Downtown Parking");
        downtown.setLatitude(40.7128);
        downtown.setLongitude(-74.0060);
        downtown.setAddress("123 Main St, New York, NY 10001");
        downtown.setDescription("Central downtown parking facility with covered spaces and EV charging");
        downtown.setAmenities("CCTV,24/7 Access,EV Charging,Covered,Security Guard");
        downtown.setOperatingHours("24/7");
        downtown.setIsActive(true);
        downtown.setMarkerColor("blue");
        downtown.setTotalSlots(0);
        downtown.setAvailableSlots(0);
        
        Location savedDowntown = locationRepository.save(downtown);
        createSlotsForLocation(savedDowntown, 50, "DT");
        
        // Location 2: Airport Parking
        Location airport = new Location();
        airport.setName("Airport Parking");
        airport.setLatitude(40.6413);
        airport.setLongitude(-73.7781);
        airport.setAddress("JFK Airport, Queens, NY 11430");
        airport.setDescription("Long-term airport parking with shuttle service");
        airport.setAmenities("Shuttle Service,CCTV,Covered,Car Wash");
        airport.setOperatingHours("24/7");
        airport.setIsActive(true);
        airport.setMarkerColor("purple");
        airport.setTotalSlots(0);
        airport.setAvailableSlots(0);
        
        Location savedAirport = locationRepository.save(airport);
        createSlotsForLocation(savedAirport, 100, "AP");
        
        // Location 3: Shopping Mall Parking
        Location mall = new Location();
        mall.setName("Shopping Mall Parking");
        mall.setLatitude(40.7589);
        mall.setLongitude(-73.9851);
        mall.setAddress("Herald Square, New York, NY 10001");
        mall.setDescription("Covered parking at shopping mall with direct access");
        mall.setAmenities("Covered,Elevator Access,Disabled Parking,CCTV");
        mall.setOperatingHours("06:00-23:00");
        mall.setIsActive(true);
        mall.setMarkerColor("green");
        mall.setTotalSlots(0);
        mall.setAvailableSlots(0);
        
        Location savedMall = locationRepository.save(mall);
        createSlotsForLocation(savedMall, 75, "ML");
        
        // Location 4: Stadium Parking
        Location stadium = new Location();
        stadium.setName("Stadium Parking");
        stadium.setLatitude(40.8296);
        stadium.setLongitude(-73.9262);
        stadium.setAddress("Yankee Stadium, Bronx, NY 10451");
        stadium.setDescription("Event parking for stadium visitors");
        stadium.setAmenities("CCTV,Event Parking,Security Patrol");
        stadium.setOperatingHours("Event Days Only");
        stadium.setIsActive(true);
        stadium.setMarkerColor("orange");
        stadium.setTotalSlots(0);
        stadium.setAvailableSlots(0);
        
        Location savedStadium = locationRepository.save(stadium);
        createSlotsForLocation(savedStadium, 200, "ST");
        
        // Location 5: Beach Parking
        Location beach = new Location();
        beach.setName("Beach Parking");
        beach.setLatitude(40.5731);
        beach.setLongitude(-73.9712);
        beach.setAddress("Coney Island, Brooklyn, NY 11224");
        beach.setDescription("Beachfront parking lot with ocean views");
        beach.setAmenities("Outdoor,Beach Access,Restrooms");
        beach.setOperatingHours("05:00-22:00");
        beach.setIsActive(true);
        beach.setMarkerColor("cyan");
        beach.setTotalSlots(0);
        beach.setAvailableSlots(0);
        
        Location savedBeach = locationRepository.save(beach);
        createSlotsForLocation(savedBeach, 60, "BCH");
        
        System.out.println("   Created 5 sample locations with GPS coordinates");
        System.out.println("   - Downtown Parking (50 slots)");
        System.out.println("   - Airport Parking (100 slots)");
        System.out.println("   - Shopping Mall Parking (75 slots)");
        System.out.println("   - Stadium Parking (200 slots)");
        System.out.println("   - Beach Parking (60 slots)");
    }

    private void createSlotsForLocation(Location location, int slotCount, String prefix) {
        // Create zones (A, B, C, etc.)
        String[] zones = {"A", "B", "C", "D", "E"};
        int slotsPerZone = slotCount / zones.length;
        
        for (int z = 0; z < zones.length; z++) {
            for (int i = 1; i <= slotsPerZone; i++) {
                Slot slot = new Slot();
                slot.setSlotNumber(prefix + "-" + zones[z] + i);
                slot.setLocation(location);
                slot.setAvailable(true);
                
                slotRepository.save(slot);
            }
        }
        
        // Update location slot counts
        location.setTotalSlots(slotCount);
        location.setAvailableSlots(slotCount);
        locationRepository.save(location);
    }
}
