import { useEffect, useState } from "react";
import BookingModal from "../components/BookingModal";
import { slotService } from "../services/slotService";

export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState("");
  const [filterAvailable, setFilterAvailable] = useState("all"); // all | available | occupied | maintenance
  const [locationName, setLocationName] = useState(""); // Store location name from slot data
  const [selectedMaintSlot, setSelectedMaintSlot] = useState(null); // For maintenance notes modal

  const locationId = localStorage.getItem("selectedLocationId") || 1;

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setError("");
      console.log(`📍 Fetching slots for location ID: ${locationId}`);
      const data = await slotService.getSlotsByLocation(locationId);
      console.log(`✅ Received ${data?.length || 0} slots:`, data);
      setSlots(data || []);
      
      // Extract location name from first slot if available
      if (data && data.length > 0 && data[0].locationName) {
        setLocationName(data[0].locationName);
      } else if (data && data.length === 0) {
        // Try to get location name from stored data
        const storedLocationName = localStorage.getItem("selectedLocationName");
        if (storedLocationName) {
          setLocationName(storedLocationName);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching slots:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to load slots";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [locationId]);

  const filteredSlots = slots.filter((slot) => {
    const isDisabled = slot.isDisabled === true; // Handle undefined/null
    if (filterAvailable === "available") return slot.available && !isDisabled;
    if (filterAvailable === "occupied") return !slot.available && !isDisabled;
    if (filterAvailable === "maintenance") return isDisabled;
    return true;
  });

  const availableCount = slots.filter((s) => s.available && s.isDisabled !== true).length;
  const occupiedCount = slots.filter((s) => !s.available && s.isDisabled !== true).length;
  const maintenanceCount = slots.filter((s) => s.isDisabled === true).length;

  if (loading) {
    return (
      <div className="p-4 pb-24 text-center">
        <p className="text-gray-500">Loading parking slots...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🅿️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Parking Slots</h1>
            {locationName ? (
              <p className="text-sm text-indigo-100 font-semibold">📍 {locationName}</p>
            ) : (
              <p className="text-sm text-indigo-100">Select a slot to book</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {error && (
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-5 rounded-2xl shadow-lg border border-red-300">
            <p className="font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              {error}
            </p>
            <button
              onClick={fetchSlots}
              className="bg-white text-red-600 hover:bg-red-50 px-5 py-2 rounded-xl font-semibold transition shadow-md"
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
            <p className="text-2xl font-bold text-green-600 mb-1">
              {availableCount}
            </p>
            <p className="text-xs font-semibold text-gray-700">Available</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
            <p className="text-2xl font-bold text-red-600 mb-1">{occupiedCount}</p>
            <p className="text-xs font-semibold text-gray-700">Occupied</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm">
            <p className="text-2xl font-bold text-orange-600 mb-1">{maintenanceCount}</p>
            <p className="text-xs font-semibold text-gray-700">Maint.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <p className="text-2xl font-bold text-blue-600 mb-1">
              {slots.length}
            </p>
            <p className="text-xs font-semibold text-gray-700">Total</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterAvailable("all")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filterAvailable === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterAvailable("available")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filterAvailable === "available"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setFilterAvailable("occupied")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filterAvailable === "occupied"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Occupied
          </button>
          <button
            onClick={() => setFilterAvailable("maintenance")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filterAvailable === "maintenance"
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Maintenance
          </button>
        </div>

        {/* Slots Grid */}
        {filteredSlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p className="text-6xl mb-3">📭</p>
            <p className="text-lg font-semibold">No slots available</p>
            <p className="text-sm text-gray-500 mt-1">
              {filterAvailable === "occupied"
                ? "All slots are free!"
                : filterAvailable === "maintenance"
                ? "No slots under maintenance"
                : "Try selecting a different filter"}
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="grid grid-cols-4 gap-3">
              {filteredSlots.map((slot) => (
                <div key={slot.id} className="relative group">
                  <button
                    onClick={() => {
                      const isDisabled = slot.isDisabled === true;
                      if (isDisabled && slot.maintenanceNotes) {
                        setSelectedMaintSlot(slot);
                      } else if (slot.available && !isDisabled) {
                        setSelectedSlot(slot);
                      }
                    }}
                    className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center font-bold transition-all ${
                      slot.isDisabled === true
                        ? "bg-orange-100 text-orange-700 cursor-pointer border-2 border-orange-300 hover:bg-orange-200"
                        : slot.available
                        ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer border-2 border-green-300"
                        : "bg-red-100 text-red-600 cursor-not-allowed opacity-60 border-2 border-red-300"
                    }`}
                    disabled={!slot.available && slot.isDisabled !== true}
                    title={slot.isDisabled === true ? "Click to view full maintenance details" : slot.available ? "Click to book" : "Occupied"}
                  >
                    <span className="text-lg">{slot.slotNumber}</span>
                    <span className="text-2xl mt-1">
                      {slot.isDisabled === true ? (
                        <span className="animate-pulse">⚠️</span>
                      ) : slot.available ? "🟢" : "🔴"}
                    </span>
                  </button>
                  
                  {/* Maintenance Hover Tooltip */}
                  {slot.isDisabled === true && slot.maintenanceNotes && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-50 pointer-events-none group-hover:z-50">
                      <div className="bottom-full mb-2 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-orange-400">
                        <div className="font-bold text-orange-300 mb-1">
                          🔧 Under Maintenance
                        </div>
                        <div className="text-gray-100 leading-relaxed">
                          {slot.maintenanceNotes}
                        </div>
                        {/* Arrow pointer */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="border-t-8 border-l-4 border-r-4 border-t-gray-800 border-l-transparent border-r-transparent"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-900 text-sm mb-3">Legend</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🟢</span>
              <span className="text-xs text-gray-700">Available</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg">🔴</span>
              <span className="text-xs text-gray-700">Occupied</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span className="text-xs text-gray-700">Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onBooked={() => {
            setSelectedSlot(null);
            fetchSlots();
          }}
        />
      )}

      {/* Maintenance Details Modal */}
      {selectedMaintSlot && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg border border-orange-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-xl font-bold text-gray-900">Under Maintenance</h3>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-orange-700 font-bold uppercase mb-2">Slot Number</p>
              <p className="text-2xl font-bold text-orange-600 mb-4">{selectedMaintSlot.slotNumber}</p>
              
              {selectedMaintSlot.maintenanceNotes && (
                <>
                  <p className="text-xs text-orange-700 font-bold uppercase mb-2">Maintenance Details</p>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded border border-orange-100">
                    {selectedMaintSlot.maintenanceNotes}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setSelectedMaintSlot(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


