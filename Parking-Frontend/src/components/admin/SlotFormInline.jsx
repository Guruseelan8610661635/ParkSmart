/**
 * SlotFormInline Component
 * Inline form for adding/editing parking slots within mobile layout
 */
import { useState, useEffect } from "react";

export default function SlotFormInline({ slot, locations, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    slotNumber: "",
    locationId: "",
    slotType: "CAR",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (slot) {
      setFormData({
        slotNumber: slot.slotNumber || "",
        locationId: slot.location?.id || slot.locationId || "",
        slotType: slot.slotType || slot.vehicleType || "CAR",
      });
    } else {
      setFormData({
        slotNumber: "",
        locationId: "",
        slotType: "CAR",
      });
    }
    setError("");
  }, [slot]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.slotNumber.trim()) {
      setError("Slot number is required");
      return;
    }
    if (!formData.locationId) {
      setError("Location is required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      if (slot) {
        // Edit mode
        await onSubmit(slot.id, formData);
      } else {
        // Create mode
        await onSubmit(formData);
      }
      
      setIsLoading(false);
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to save slot";
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-800">
          {slot ? "✏️ Edit Slot" : "➕ Add New Slot"}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm font-semibold">⚠️ {error}</p>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-3">
        {/* Slot Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Slot Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., A-101, B-05"
            value={formData.slotNumber}
            onChange={(e) =>
              setFormData({ ...formData, slotNumber: e.target.value })
            }
            disabled={isLoading}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100 text-base"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.locationId}
            onChange={(e) =>
              setFormData({ ...formData, locationId: e.target.value })
            }
            disabled={isLoading}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100 text-base"
          >
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Slot Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Slot Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.slotType}
            onChange={(e) =>
              setFormData({ ...formData, slotType: e.target.value })
            }
            disabled={isLoading}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100 text-base"
          >
            <option value="CAR">🚗 Car</option>
            <option value="BIKE">🏍️ Bike</option>
            <option value="TRUCK">🚚 Truck</option>
            <option value="EV">⚡ Electric Vehicle</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition text-base"
        >
          {isLoading ? "⏳ Saving..." : "💾 Save Slot"}
        </button>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-semibold py-2.5 rounded-lg transition text-base"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
