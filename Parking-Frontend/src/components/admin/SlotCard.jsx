/**
 * SlotCard Component
 * Displays individual parking slot with status and actions
 */
export default function SlotCard({ slot, onEdit, onToggle, onDelete, onDisable, onEnable }) {
  const getStatusColor = (slot) => {
    if (slot.isDisabled) {
      return "bg-gray-100 border-gray-400";
    }
    
    switch (slot.status) {
      case "AVAILABLE":
      case true: // For available boolean
        return "bg-green-100 border-green-300";
      case "OCCUPIED":
      case false: // For occupied boolean
        return "bg-red-100 border-red-300";
      case "DISABLED":
        return "bg-gray-100 border-gray-400";
      default:
        return slot.available ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300";
    }
  };

  const getStatusIcon = (slot) => {
    if (slot.isDisabled) {
      return "🔧";
    }
    
    switch (slot.status) {
      case "AVAILABLE":
      case true:
        return "✅";
      case "OCCUPIED":
      case false:
        return "🚗";
      case "DISABLED":
        return "🔧";
      default:
        return slot.available ? "✅" : "🚗";
    }
  };

  const getDisplayStatus = (slot) => {
    if (slot.isDisabled) {
      return "MAINTENANCE";
    }
    const statusText = slot.status || (slot.available ? "AVAILABLE" : "OCCUPIED");
    return statusText === true ? "AVAILABLE" : statusText === false ? "OCCUPIED" : statusText;
  };

  return (
    <div
      className={`p-3 rounded-lg border-2 shadow-sm transition hover:shadow-md ${getStatusColor(slot)}`}
    >
      {/* Slot Number */}
      <p className="font-bold text-gray-800 text-sm mb-1">{slot.slotNumber || `Slot ${slot.id}`}</p>

      {/* Location */}
      {slot.location && (
        <p className="text-[11px] text-gray-600 mb-2">{slot.location.name || "N/A"}</p>
      )}

      {/* Status Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${slot.isDisabled ? 'text-orange-700' : ''}`}>
          <span>{getStatusIcon(slot)}</span>
          <span>{getDisplayStatus(slot)}</span>
        </span>
      </div>

      {/* Maintenance Notes */}
      {slot.isDisabled && slot.maintenanceNotes && (
        <div className="mb-3 bg-orange-50 border border-orange-200 rounded p-2">
          <p className="text-[9px] text-orange-700 font-semibold mb-1">📝 Notes:</p>
          <p className="text-[9px] text-gray-700 line-clamp-2">{slot.maintenanceNotes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-1.5">
        <button
          onClick={() => onEdit(slot)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1.5 rounded text-[9px] font-medium transition"
        >
          ✏️ Edit
        </button>
        
        {slot.isDisabled ? (
          <button
            onClick={() => onEnable(slot.id)}
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1.5 rounded text-[9px] font-medium transition"
          >
            ✅ Enable
          </button>
        ) : (
          <button
            onClick={() => onDisable(slot)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1.5 rounded text-[9px] font-medium transition"
          >
            🔧 Disable
          </button>
        )}
        
        <button
          onClick={() => onToggle(slot.id)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1.5 rounded text-[9px] font-medium transition"
        >
          🔄 Toggle
        </button>
        <button
          onClick={() => onDelete(slot.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1.5 rounded text-[9px] font-medium transition"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
