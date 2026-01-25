/**
 * StatsPanel Component
 * Displays parking statistics with visual indicators
 */
export default function StatsPanel({ stats, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <p className="text-gray-600 text-sm">Loading statistics...</p>
      </div>
    );
  }

  // Calculate occupancy percentage
  const totalSlots = stats.totalSlots || 0;
  const occupiedSlots = stats.occupiedSlots || 0;
  const occupancyPercent = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  // Get occupancy status color
  const getOccupancyColor = () => {
    if (occupancyPercent < 30) return "text-green-600";
    if (occupancyPercent < 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      {/* Occupancy Rate */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 text-sm">📊 Occupancy Rate</h3>

        <div className="flex items-end justify-between mb-3">
          <p className={`text-3xl font-bold ${getOccupancyColor()}`}>
            {occupancyPercent}%
          </p>
          <p className="text-[11px] text-gray-600">
            {occupiedSlots} of {totalSlots} slots
          </p>
        </div>

        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              occupancyPercent < 30
                ? "bg-green-500"
                : occupancyPercent < 70
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>

        {/* Status Text */}
        <p className="text-[10px] text-gray-600 mt-3">
          {occupancyPercent < 30 && "✅ Parking available"}
          {occupancyPercent >= 30 && occupancyPercent < 70 && "⚠️ Moderate occupancy"}
          {occupancyPercent >= 70 && "🔴 High occupancy"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-slate-700">{stats.totalBookings || 0}</p>
          <p className="text-[10px] text-slate-700 font-semibold mt-1">Total Bookings</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.activeBookings || 0}</p>
          <p className="text-[10px] text-purple-700 font-semibold mt-1">Active Now</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-indigo-600">{stats.totalLocations || 0}</p>
          <p className="text-[10px] text-indigo-700 font-semibold mt-1">Locations</p>
        </div>
      </div>

      {/* Efficiency Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 text-sm">⚡ Efficiency</h3>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] text-gray-700">Available Slots</span>
              <span className="font-bold text-[11px] text-green-600">
                {stats.availableSlots || 0}
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full"
                style={{
                  width: `${totalSlots > 0 ? Math.round(((stats.availableSlots || 0) / totalSlots) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] text-gray-700">Occupied Slots</span>
              <span className="font-bold text-[11px] text-red-600">
                {occupiedSlots}
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full"
                style={{
                  width: `${totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
