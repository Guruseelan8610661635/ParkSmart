import { useState, useEffect } from "react";
import { bookingService } from "../services/bookingService";
import { vehicleService } from "../services/vehicleService";
import { getCurrentUser } from "../utils/auth";

export default function BookingModal({ slot, onClose, onBooked }) {
  const [userVehicles, setUserVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [entryTime, setEntryTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  // Load user's registered vehicles on mount
  useEffect(() => {
    const fetchUserVehicles = async () => {
      try {
        setLoading(true);
        setError("");
        
        const user = getCurrentUser();
        if (!user) {
          setError("User not authenticated");
          return;
        }

        const vehicles = await vehicleService.getUserVehicles();
        
        if (!vehicles || vehicles.length === 0) {
          setError("No registered vehicles found. Please add a vehicle first.");
          setLoading(false);
          return;
        }

        setUserVehicles(vehicles);
        // Select first vehicle by default
        setSelectedVehicleId(vehicles[0].id);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load vehicles:", err);
        setError("Failed to load your registered vehicles");
        setLoading(false);
      }
    };

    fetchUserVehicles();
  }, []);

  const handleBook = async () => {
    if (!selectedVehicleId) {
      setError("Please select a vehicle");
      return;
    }

    if (!entryTime) {
      setError("Please select entry time");
      return;
    }

    // Prevent booking in the past
    const selectedTime = new Date(entryTime);
    const now = new Date();
    if (selectedTime <= now) {
      setError("Please choose a future time for your entry");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const selectedVehicle = userVehicles.find(v => v.id === selectedVehicleId);
      
      // Format entryTime to ISO 8601 format expected by backend
      // entryTime comes as "2026-01-06T14:30" from datetime-local input
      const formattedEntryTime = new Date(entryTime).toISOString();
      
      // Log the booking request for debugging
      const bookingRequest = {
        slotId: slot.id,
        vehicleType: selectedVehicle.vehicleType,
        entryTime: formattedEntryTime,
      };
      
      console.log('📋 Booking request:', bookingRequest);
      
      const response = await bookingService.bookSlot(bookingRequest);

      // Show inline success banner
      setSuccess({
        id: response.id,
        slotNumber: response.slotNumber,
        status: response.status,
      });

      onBooked();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Booking failed. Slot may be occupied.";
      setError(errorMsg);
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleIcon = (vehicleType) => {
    const icons = {
      CAR: '🚗',
      BIKE: '🏍️',
      SUV: '🚙',
      TRUCK: '🚚',
      EV: '⚡'
    };
    return icons[vehicleType] || '🚗';
  };

  const getVehicleName = (vehicleType) => {
    const names = {
      CAR: 'Car',
      BIKE: 'Bike',
      SUV: 'SUV',
      TRUCK: 'Truck',
      EV: 'Electric Vehicle'
    };
    return names[vehicleType] || vehicleType;
  };

  // Check if selected vehicle matches slot type requirement
  const getSelectedVehicleType = () => {
    if (!selectedVehicleId) return null;
    const selected = userVehicles.find(v => v.id === selectedVehicleId);
    return selected?.vehicleType || null;
  };

  const selectedVehicleType = getSelectedVehicleType();
  const slotRequiredType = slot?.slotType || 'CAR';
  const isVehicleTypeMatch = !selectedVehicleType || selectedVehicleType === slotRequiredType;
  const isTypeMismatchError = error && error.includes('Vehicle type mismatch');

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
          <p className="text-center text-gray-600">Loading your vehicles...</p>
        </div>
      </div>
    );
  }

  if (error && userVehicles.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl space-y-4">
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-center">
          🅿️ Book Slot <span className="text-blue-600">{slot.slotNumber}</span>
        </h3>

        {success && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
            <div className="font-semibold mb-1">✅ Booking Successful</div>
            <div className="flex justify-between text-xs">
              <span>Booking ID</span>
              <span className="font-semibold">{success.id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Slot</span>
              <span className="font-semibold">{success.slotNumber}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Status</span>
              <span className="font-semibold uppercase">{success.status}</span>
            </div>
          </div>
        )}

        {error && (
          <div className={`p-3 rounded-lg text-sm border ${
            isTypeMismatchError 
              ? 'bg-orange-50 text-orange-800 border-orange-300' 
              : 'bg-red-100 text-red-700 border-red-300'
          }`}>
            {isTypeMismatchError ? (
              <div className="space-y-2">
                <div className="font-bold flex items-center gap-2">
                  ⚠️ Vehicle Type Mismatch
                </div>
                <div className="text-sm space-y-1">
                  <p>❌ This slot is reserved for <strong>{getVehicleName(slotRequiredType)} {getVehicleIcon(slotRequiredType)}</strong> only.</p>
                  <p>📋 Your selected vehicle is a <strong>{getVehicleName(selectedVehicleType)} {getVehicleIcon(selectedVehicleType)}</strong>.</p>
                  <p className="pt-1 text-xs opacity-90">💡 Please select a {getVehicleName(slotRequiredType)} vehicle or choose a different slot.</p>
                </div>
              </div>
            ) : (
              error
            )}
          </div>
        )}

        <div className="space-y-4">
          {/* Registered Vehicle Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              🚗 Select Registered Vehicle
            </label>
            <select
              value={selectedVehicleId || ""}
              onChange={(e) => setSelectedVehicleId(parseInt(e.target.value))}
              disabled={loading}
              className={`w-full bg-gray-100 p-3 rounded-lg border-2 focus:ring-2 focus:ring-blue-500 ${
                selectedVehicleType && !isVehicleTypeMatch
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300'
              }`}
            >
              <option value="">-- Choose a vehicle --</option>
              {userVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {getVehicleIcon(vehicle.vehicleType)} {vehicle.make} {vehicle.model} ({vehicle.registrationNumber})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Only registered vehicles can be used for parking
            </p>
            {selectedVehicleType && !isVehicleTypeMatch && (
              <div className="mt-2 p-2 bg-red-50 border border-red-300 rounded text-xs text-red-700 flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <span>Your <strong>{getVehicleName(selectedVehicleType)}</strong> doesn't match this slot's <strong>{getVehicleName(slotRequiredType)}</strong> requirement</span>
              </div>
            )}
            {selectedVehicleType && isVehicleTypeMatch && (
              <div className="mt-2 p-2 bg-green-50 border border-green-300 rounded text-xs text-green-700 flex items-start gap-2">
                <span className="text-lg">✅</span>
                <span>Your <strong>{getVehicleName(selectedVehicleType)}</strong> matches this slot perfectly!</span>
              </div>
            )}
          </div>

          {/* Entry Time */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              📅 Entry Time
            </label>
            <input
              type="datetime-local"
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
              disabled={loading}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full bg-gray-100 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Slot Info */}
          <div className={`p-4 rounded-lg border ${
            isVehicleTypeMatch
              ? 'bg-blue-50 border-blue-200'
              : 'bg-red-50 border-red-300'
          }`}>
            <p className="text-sm text-gray-600 mb-2">Slot Details</p>
            <div className="space-y-1">
              <p className="flex justify-between">
                <span className="text-gray-700">Slot Number:</span>
                <span className="font-bold text-blue-600">{slot.slotNumber}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-700">Location:</span>
                <span className="font-bold">
                  {slot.locationName || "Downtown"}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-700">Status:</span>
                <span className="font-bold text-green-600">✓ Available</span>
              </p>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <p className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Reserved for:</span>
                  <span className={`font-bold text-lg ${
                    isVehicleTypeMatch ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {getVehicleIcon(slotRequiredType)} {getVehicleName(slotRequiredType)}
                  </span>
                </p>
                {selectedVehicleType && !isVehicleTypeMatch && (
                  <p className="text-xs text-red-600 mt-2 font-semibold flex items-center gap-1">
                    ❌ Your selected vehicle doesn't match this slot's requirement
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="text-xs text-gray-500 text-center bg-gray-50 p-2 rounded">
            💡 You can checkout anytime and pay the parking fee based on your duration
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleBook}
            disabled={loading || !!success || !selectedVehicleId || !isVehicleTypeMatch}
            className={`flex-1 py-2 rounded-lg font-semibold text-white ${
              !isVehicleTypeMatch
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50`}
            title={!isVehicleTypeMatch ? `This slot is only for ${getVehicleName(slotRequiredType)} vehicles` : ''}
          >
            {success ? "Booked" : loading ? "Booking..." : "✓ Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
