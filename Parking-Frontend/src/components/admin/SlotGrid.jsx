/**
 * SlotGrid Component
 * Displays parking slots in a responsive grid layout
 * Auto-refreshes every 10 seconds
 */
import { useEffect, useState } from "react";
import SlotCard from "./SlotCard";

export default function SlotGrid({ slots, onEdit, onToggle, onDelete, onDisable, onEnable, loading, error, onRefresh }) {
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(() => {
      onRefresh();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, onRefresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-gray-600 text-sm">Loading slots...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-700 text-sm font-semibold">❌ Error loading slots</p>
        <p className="text-red-600 text-[11px] mt-1">{error}</p>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600 text-sm">No slots found</p>
        <p className="text-gray-500 text-[11px] mt-1">Add your first slot to get started</p>
      </div>
    );
  }

  // Calculate statistics
  const availableCount = slots.filter((s) => !s.isDisabled && (s.status === "AVAILABLE" || s.available)).length;
  const occupiedCount = slots.filter((s) => !s.isDisabled && (s.status === "OCCUPIED" || !s.available)).length;
  const disabledCount = slots.filter((s) => s.isDisabled || s.status === "DISABLED").length;

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{availableCount}</p>
          <p className="text-[10px] text-green-700 font-semibold">Available</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{occupiedCount}</p>
          <p className="text-[10px] text-red-700 font-semibold">Occupied</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-gray-600">{disabledCount}</p>
          <p className="text-[10px] text-gray-700 font-semibold">Disabled</p>
        </div>
      </div>

      {/* Auto-refresh toggle */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
        <span className="text-[11px] text-blue-700 font-semibold">🔄 Auto-refresh: {autoRefreshEnabled ? "ON" : "OFF"}</span>
        <button
          onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
          className={`text-[10px] font-semibold px-3 py-1.5 rounded transition ${
            autoRefreshEnabled
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          {autoRefreshEnabled ? "Disable" : "Enable"}
        </button>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-2 gap-3">
        {slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            onEdit={onEdit}
            onToggle={onToggle}
            onDelete={onDelete}
            onDisable={onDisable}
            onEnable={onEnable}
          />
        ))}
      </div>
    </div>
  );
}
