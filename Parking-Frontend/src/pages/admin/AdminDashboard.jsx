/**
 * Admin Dashboard
 * Main admin page with slot management, booking monitoring, and statistics
 * Uses MobileLayout for consistent mobile design
 */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SlotCard from "../../components/admin/SlotCard";
import SlotGrid from "../../components/admin/SlotGrid";
import SlotFormInline from "../../components/admin/SlotFormInline";
import LocationFormInline from "../../components/admin/LocationFormInline";
import BookingList from "../../components/admin/BookingList";
import axios from "../../api/axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const slotFormRef = useRef(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check authorization
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    
    if (role === "ADMIN" && token) {
      setIsAuthorized(true);
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Listen to BottomNav tab changes
  useEffect(() => {
    const handleTabChange = (event) => {
      setActiveTab(event.detail.tab);
    };
    
    window.addEventListener("adminTabChange", handleTabChange);
    return () => window.removeEventListener("adminTabChange", handleTabChange);
  }, []);

  // State management
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, slots, bookings, locations, profile
  const [slots, setSlots] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [stats, setStats] = useState({
    totalSlots: 0,
    availableSlots: 0,
    occupiedSlots: 0,
    maintenanceSlots: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalLocations: 0,
  });

  // UI state
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedLocationId, setSelectedLocationId] = useState(null); // For viewing/managing slots by location
  const [slotFilter, setSlotFilter] = useState("all"); // Filter for slots: all, available, occupied

  // Notification system state
  const [notifications, setNotifications] = useState([]); // Array of {id, type, message, autoClose}
  const [confirmDialog, setConfirmDialog] = useState(null); // {title, message, onConfirm, onCancel}

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);

  // Disable slot state
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [slotToDisable, setSlotToDisable] = useState(null);
  const [maintenanceNotes, setMaintenanceNotes] = useState("");

  const formatDurationFromMinutes = (minutes) => {
    if (minutes === null || minutes === undefined || Number.isNaN(minutes)) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = Math.max(0, Math.round(minutes - hours * 60));
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const normalizeBooking = (booking) => ({
    ...booking,
    slotNumber: booking.slotNumber || booking.slot?.slotNumber,
    slot: booking.slot || (booking.slotNumber ? { slotNumber: booking.slotNumber } : undefined),
    totalCost: booking.totalCost ?? booking.parkingFee ?? booking.totalFee ?? 0,
    duration: booking.duration ?? formatDurationFromMinutes(booking.durationMinutes),
    entryTime: booking.entryTime || booking.startTime,
    checkInTime: booking.entryTime || booking.startTime,
  });

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📊 [FETCH] Starting data fetch...");
      console.log("📊 [FETCH] Axios baseURL:", axios.defaults.baseURL);

      // Fetch slots
      console.log("📊 [FETCH] Getting admin slots from /admin/slots");
      const slotsRes = await axios.get("/admin/slots");
      const slotsData = Array.isArray(slotsRes.data) ? slotsRes.data : [];
      console.log("📦 [FETCH] Raw slot data:", slotsData);
      
      // ✅ FIX: Convert boolean 'available' to string 'status' for UI
      const slotsWithStatus = slotsData.map((slot) => ({
        ...slot,
        status: slot.isDisabled ? "MAINTENANCE" : (slot.available ? "AVAILABLE" : "OCCUPIED"),
      }));
      console.log("📦 [FETCH] Slots with status:", slotsWithStatus);
      setSlots(slotsWithStatus);
      console.log("✅ [FETCH] Slots received:", slotsWithStatus.length);

      // Fetch locations
      console.log("📊 [FETCH] Getting locations from /map/locations");
      const locationsRes = await axios.get("/map/locations");
      const locationsData = Array.isArray(locationsRes.data) ? locationsRes.data : [];
      setLocations(locationsData);
      console.log("✅ [FETCH] Locations received:", locationsData.length);

      // Fetch current bookings (admin scope)
      console.log("📊 [FETCH] Getting active bookings from /admin/bookings/status/ACTIVE");
      const currentRes = await axios.get("/admin/bookings/status/ACTIVE");
      const currentBookingsRaw = Array.isArray(currentRes.data) ? currentRes.data : [];
      const currentBookingsData = currentBookingsRaw.map(normalizeBooking);
      setCurrentBookings(currentBookingsData);
      console.log("✅ [FETCH] Current bookings received:", currentBookingsData.length);

      // Fetch past bookings (completed)
      console.log("📊 [FETCH] Getting past bookings from /admin/bookings/status/COMPLETED");
      const pastRes = await axios.get("/admin/bookings/status/COMPLETED");
      const pastBookingsRaw = Array.isArray(pastRes.data) ? pastRes.data : [];
      const pastBookingsData = pastBookingsRaw.map(normalizeBooking);
      setPastBookings(pastBookingsData);
      console.log("✅ [FETCH] Past bookings received:", pastBookingsData.length);

      // Update stats - use slotsWithStatus instead of slotsData
      // Exclude disabled/maintenance slots from occupied and available counts
      const occupied = slotsWithStatus.filter((s) => s.status === "OCCUPIED" && !s.isDisabled).length;
      const available = slotsWithStatus.filter((s) => s.status === "AVAILABLE" && !s.isDisabled).length;
      const maintenance = slotsWithStatus.filter((s) => s.isDisabled === true).length;

      setStats({
        totalSlots: slotsWithStatus.length,
        availableSlots: available,
        occupiedSlots: occupied,
        maintenanceSlots: maintenance,
        totalBookings: currentBookingsData.length + pastBookingsData.length,
        activeBookings: currentBookingsData.length,
        totalLocations: locationsData.length,
      });

      setLoading(false);
      console.log("✅ [FETCH] All data loaded successfully");
    } catch (err) {
      console.error("❌ [FETCH] Error fetching data:", err);
      console.error("❌ [FETCH] Full error object:", err);
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  // Notification helpers
  const showNotification = (type, message, duration = 4000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message, autoClose: duration > 0 }]);
    
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showConfirm = (title, message, onConfirm, onCancel) => {
    setConfirmDialog({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(null);
      },
      onCancel: () => {
        onCancel?.();
        setConfirmDialog(null);
      },
    });
  };

  // Initial fetch
  useEffect(() => {
    if (isAuthorized) {
      fetchAllData();
    }
  }, [isAuthorized]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh || !isAuthorized) return;

    const interval = setInterval(() => {
      fetchAllData();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, isAuthorized]);

  // Handle slot creation
  const handleAddSlot = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        showNotification("error", "❌ Authentication required. Please login again.");
        navigate("/", { replace: true });
        return;
      }
      
      // axios interceptor will add Authorization header
      await axios.post("/admin/slots", formData);
      
      setShowSlotModal(false);
      showNotification("success", "✅ Slot created successfully!");
      await fetchAllData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create slot";
      showNotification("error", `❌ ${errorMsg}`);
      throw err; // Re-throw so form component can handle it
    }
  };

  // Handle slot update
  const handleUpdateSlot = async (slotId, formData) => {
    try {
      await axios.put(`/admin/slots/${slotId}`, formData);
      
      setShowSlotModal(false);
      setEditingSlot(null);
      showNotification("success", "✅ Slot updated successfully!");
      await fetchAllData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to update slot";
      showNotification("error", `❌ ${errorMsg}`);
      throw err;
    }
  };

  // Handle slot deletion
  const handleDeleteSlot = async (slotId) => {
    try {
      console.log("🔴 [DELETE SLOT] Starting deletion for slot ID:", slotId);
      console.log("🔴 [DELETE SLOT] Making DELETE request to: /admin/slots/" + slotId);
      
      const response = await axios.delete(`/admin/slots/${slotId}`);
      console.log("✅ [DELETE SLOT] Response received:", response);
      
      setShowDeleteConfirm(false);
      setSlotToDelete(null);
      showNotification("success", "✅ Slot deleted successfully!");
      console.log("✅ [DELETE SLOT] Fetching updated data...");
      await fetchAllData();
    } catch (err) {
      console.error("❌ [DELETE SLOT] Error occurred:", err);
      console.error("❌ [DELETE SLOT] Error response:", err.response);
      const errorMsg = err.response?.data?.message || "Failed to delete slot";
      showNotification("error", `❌ ${errorMsg}`);
    }
  };

  // Handle slot toggle (enable/disable)
  const handleToggleSlot = async (slotId, currentState) => {
    try {
      await axios.put(`/admin/slots/${slotId}/toggle`, {});
      await fetchAllData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to toggle slot";
      showNotification("error", `❌ ${errorMsg}`);
    }
  };

  // Handle disable slot - show modal
  const handleShowDisableModal = (slot) => {
    setSlotToDisable(slot);
    setMaintenanceNotes("");
    setShowDisableModal(true);
  };

  // Handle disable slot with notes
  const handleDisableSlot = async () => {
    if (!slotToDisable) return;
    
    try {
      await axios.put(`/admin/slots/${slotToDisable.id}/disable`, {
        maintenanceNotes: maintenanceNotes.trim() || null,
      });
      setShowDisableModal(false);
      setSlotToDisable(null);
      setMaintenanceNotes("");
      showNotification("success", "🔧 Slot disabled for maintenance!");
      await fetchAllData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to disable slot";
      showNotification("error", `❌ ${errorMsg}`);
    }
  };

  // Handle enable slot
  const handleEnableSlot = async (slotId) => {
    try {
      await axios.put(`/admin/slots/${slotId}/enable`);
      showNotification("success", "✅ Slot enabled and ready for use!");
      await fetchAllData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to enable slot";
      showNotification("error", `❌ ${errorMsg}`);
    }
  };

  // Handle edit slot
  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setShowSlotModal(true);
    
    // Scroll to form after state updates
    setTimeout(() => {
      slotFormRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  // Handle delete confirmation
  const handleConfirmDelete = (slot) => {
    showConfirm(
      "Delete Slot",
      `Are you sure you want to delete slot ${slot.slotNumber}?`,
      () => handleDeleteSlot(slot.id),
      null
    );
  };

  // Location Management Functions
  const handleAddLocation = async (locationId, formData) => {
    try {
      await axios.post("/locations", formData);
      setShowLocationModal(false);
      setEditingLocation(null);
      showNotification("success", "✅ Location created successfully!");
      await fetchAllData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create location";
      showNotification("error", `❌ ${errorMsg}`);
      throw err;
    }
  };

  const handleUpdateLocation = async (locationId, formData) => {
    try {
      await axios.put(`/locations/${locationId}`, formData);
      setShowLocationModal(false);
      setEditingLocation(null);
      showNotification("success", "✅ Location updated successfully!");
      await fetchAllData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update location";
      showNotification("error", `❌ ${errorMsg}`);
      throw err;
    }
  };

  const handleDeleteLocation = async (locationId) => {
    const location = locations.find(l => l.id === locationId);
    showConfirm(
      "Delete Location",
      `Are you sure you want to delete "${location?.name}"?`,
      async () => {
        try {
          console.log("🔴 [DELETE] Starting location deletion for ID:", locationId);
          console.log("🔴 [DELETE] Making DELETE request to: /locations/" + locationId);
          console.log("🔴 [DELETE] Full URL:", axios.defaults.baseURL + "/locations/" + locationId);
          
          const response = await axios.delete(`/locations/${locationId}`);
          console.log("✅ [DELETE] Response received:", response);
          
          showNotification("success", "✅ Location deleted successfully!");
          console.log("✅ [DELETE] Notification shown, fetching updated data...");
          await fetchAllData();
        } catch (err) {
          console.error("❌ [DELETE] Error occurred:", err);
          console.error("❌ [DELETE] Error response:", err.response);
          console.error("❌ [DELETE] Error message:", err.message);
          
          // Provide user-friendly error messages
          let errorMsg = err.response?.data?.message || "Failed to delete location";
          if (err.response?.status === 500) {
            const locationSlots = slots.filter(s => s.location?.id === locationId || s.locationId === locationId);
            if (locationSlots.length > 0) {
              errorMsg = `Cannot delete: This location has ${locationSlots.length} slot(s). Delete slots first.`;
            }
          }
          showNotification("error", `❌ ${errorMsg}`);
        }
      },
      null
    );
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setShowLocationModal(true);
  };

  // Bulk delete slots for a location
  const handleBulkDeleteSlotsForLocation = async (locationId) => {
    const locationSlots = slots.filter(s => s.location?.id === locationId || s.locationId === locationId);
    if (locationSlots.length === 0) {
      showNotification("warning", "⚠️ No slots to delete for this location");
      return;
    }

    showConfirm(
      "Delete All Slots",
      `Are you sure you want to delete all ${locationSlots.length} slot(s) for this location?`,
      async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          
          // Delete all slots for this location
          await Promise.all(
            locationSlots.map(slot =>
              axios.delete(`/admin/slots/${slot.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            )
          );
          
          setSelectedLocationId(null);
          showNotification("success", `✅ ${locationSlots.length} slot(s) deleted successfully!`);
          await fetchAllData();
        } catch (err) {
          console.error("Error deleting slots:", err);
          showNotification("error", "❌ Failed to delete some slots. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      null
    );
  };

  // Helper variables
  const totalSlots = stats.totalSlots || 0;
  const occupiedSlots = stats.occupiedSlots || 0;

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600 text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden relative">
        {/* Notifications Container - Inside Layout */}
        {notifications.length > 0 && (
          <div className="absolute top-4 right-4 z-40 space-y-2 max-w-[calc(100%-32px)] pointer-events-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-semibold animate-pulse ${
                  notification.type === 'success'
                    ? 'bg-green-500'
                    : notification.type === 'error'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              >
                <div className="flex justify-between items-center gap-3">
                  <span>{notification.message}</span>
                  {notification.autoClose && (
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="text-white hover:text-gray-200 font-bold text-lg flex-shrink-0"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4">
          <h1 className="font-bold text-lg">📊 Admin Dashboard</h1>
          <p className="text-blue-100 text-xs">Manage parking operations</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2 flex justify-between items-center">
            <p className="text-red-700 text-xs font-semibold">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-xs mx-4 animate-in">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{confirmDialog.title}</h3>
              <p className="text-gray-600 text-sm mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDialog.onCancel}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 pb-20">
          {/* Slot Form Inline - Show above content when adding/editing in Slots tab */}
          {showSlotModal && activeTab === "slots" && (
            <div ref={slotFormRef} className="sticky top-0 z-10 bg-white border-b border-gray-200 mb-3">
              <SlotFormInline
                locations={locations}
                slot={editingSlot}
                onSubmit={editingSlot ? handleUpdateSlot : handleAddSlot}
                onClose={() => {
                  setShowSlotModal(false);
                  setEditingSlot(null);
                }}
              />
            </div>
          )}

          {/* Location Form Inline - Show above content when adding/editing in Locations tab */}
          {showLocationModal && activeTab === "locations" && (
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 mb-3">
              <LocationFormInline
                location={editingLocation}
                onSubmit={editingLocation ? handleUpdateLocation : handleAddLocation}
                onClose={() => {
                  setShowLocationModal(false);
                  setEditingLocation(null);
                }}
              />
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-3 pb-5">
              {/* Main Occupancy Rate Card - Large & Prominent */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2">📊 Occupancy Rate</h3>
                  <p className="text-5xl font-bold mb-1">
                    {totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0}%
                  </p>
                  <p className="text-blue-100 text-sm">{occupiedSlots} of {totalSlots} slots occupied</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      Math.round((occupiedSlots / totalSlots) * 100) < 30 ? "bg-green-400" :
                      Math.round((occupiedSlots / totalSlots) * 100) < 70 ? "bg-yellow-400" :
                      "bg-red-400"
                    }`}
                    style={{ width: `${totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0}%` }}
                  />
                </div>
              </div>

              {/* Quick Stats - Larger Grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center shadow-sm">
                  <p className="text-3xl font-bold text-blue-600 mb-1">{stats.availableSlots}</p>
                  <p className="text-xs font-semibold text-blue-700">Available</p>
                </div>
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center shadow-sm">
                  <p className="text-3xl font-bold text-red-600 mb-1">{occupiedSlots}</p>
                  <p className="text-xs font-semibold text-red-700">Occupied</p>
                </div>
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 text-center shadow-sm">
                  <p className="text-3xl font-bold text-orange-600 mb-1">{stats.maintenanceSlots || 0}</p>
                  <p className="text-xs font-semibold text-orange-700">Maintenance</p>
                </div>
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center shadow-sm">
                  <p className="text-3xl font-bold text-purple-600 mb-1">{currentBookings.length}</p>
                  <p className="text-xs font-semibold text-purple-700">Active</p>
                </div>
              </div>

              {/* Locations Overview - Larger Cards */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 text-base">🏢 Locations Overview</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-lg p-4">
                    <p className="text-xs font-semibold text-white opacity-90 mb-2">Total Locations</p>
                    <p className="text-4xl font-bold">{stats.totalLocations}</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg p-4">
                    <p className="text-xs font-semibold text-white opacity-90 mb-2">Total Bookings</p>
                    <p className="text-4xl font-bold">{stats.totalBookings}</p>
                  </div>
                </div>
              </div>

              {/* Efficiency Metrics - Larger Layout */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 text-base">⚡ Efficiency Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Available Slots</span>
                      <span className="text-2xl font-bold text-green-600">{stats.availableSlots}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full transition-all"
                        style={{
                          width: `${totalSlots > 0 ? Math.round((stats.availableSlots / totalSlots) * 100) : 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{totalSlots > 0 ? Math.round((stats.availableSlots / totalSlots) * 100) : 0}% free</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Occupied Slots</span>
                      <span className="text-2xl font-bold text-red-600">{occupiedSlots}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-red-500 h-full rounded-full transition-all"
                        style={{
                          width: `${totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0}% occupied</p>
                  </div>
                </div>
              </div>

              {/* Active Bookings Section - Larger */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 text-base">📅 Active Bookings ({currentBookings.length})</h3>
                {currentBookings.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {currentBookings.slice(0, 5).map((booking, idx) => (
                      <div key={booking.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{booking.vehicleNumber || `Booking #${idx + 1}`}</p>
                            <p className="text-xs text-gray-600 mt-1">Slot: {booking.slotNumber || 'N/A'}</p>
                          </div>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        </div>
                      </div>
                    ))}
                    {currentBookings.length > 5 && (
                      <p className="text-xs text-gray-600 text-center py-2 font-semibold">+ {currentBookings.length - 5} more bookings</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-600">No active bookings at the moment</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Slots Tab */}
          {activeTab === "slots" && (
            <div className="space-y-3 pb-5">
              {/* Controls - Enhanced */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex gap-3 items-center justify-between">
                  <label className="text-sm font-bold text-gray-700">🔍 Filter:</label>
                  <select
                    id="slotFilter"
                    value={slotFilter}
                    onChange={(e) => setSlotFilter(e.target.value)}
                    className="text-sm px-3 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Slots</option>
                    <option value="available">Available Only</option>
                    <option value="occupied">Occupied Only</option>
                  </select>
                </div>
                
                <div className="flex gap-3 items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      id="autoRefresh"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="w-5 h-5 cursor-pointer accent-blue-600"
                    />
                    <label
                      htmlFor="autoRefresh"
                      className="text-sm font-bold text-gray-700 cursor-pointer"
                    >
                      Auto-refresh
                    </label>
                  </div>
                  <button
                    onClick={fetchAllData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {/* Quick Stats - Larger */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center shadow-sm">
                  <p className="text-3xl font-bold text-green-600 mb-1">{stats.availableSlots}</p>
                  <p className="text-xs font-bold text-green-700">Available</p>
                </div>
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center shadow-sm">
                  <p className="text-3xl font-bold text-red-600 mb-1">{occupiedSlots}</p>
                  <p className="text-xs font-bold text-red-700">Occupied</p>
                </div>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-center shadow-sm">
                  <p className="text-3xl font-bold text-gray-600 mb-1">{stats.totalSlots}</p>
                  <p className="text-xs font-bold text-gray-700">Total</p>
                </div>
              </div>

              {/* Add New Slot Button - Larger */}
              <button
                onClick={() => {
                  setEditingSlot(null);
                  setShowSlotModal(true);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-md"
              >
                ➕ Add New Slot
              </button>

              {/* Slots Grouped by Location */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-600 text-sm font-semibold">Loading slots...</p>
                </div>
              ) : slots.length > 0 ? (
                <div className="space-y-3">
                  {locations.length > 0 ? (
                    locations.map((location) => {
                      const locationId = location.id;
                      let locationSlots = slots.filter(s => s.location?.id === locationId || s.locationId === locationId);
                      
                      // Apply slot filter
                      if (slotFilter === "available") {
                        locationSlots = locationSlots.filter(s => s.status === "AVAILABLE");
                      } else if (slotFilter === "occupied") {
                        locationSlots = locationSlots.filter(s => s.status === "OCCUPIED");
                      }
                      
                      if (locationSlots.length === 0) return null;
                      
                      const availableInLocation = locationSlots.filter(s => s.status === "AVAILABLE" && !s.isDisabled).length;
                      const occupiedInLocation = locationSlots.filter(s => s.status === "OCCUPIED" && !s.isDisabled).length;
                      const maintenanceInLocation = locationSlots.filter(s => s.isDisabled).length;
                      
                      return (
                        <div key={location.id} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-md">
                          {/* Location Header - Enhanced */}
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3">
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex-1">
                                <h3 className="font-bold text-base mb-1">📍 {location.name}</h3>
                                <p className="text-xs text-purple-100">{location.address}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold mb-1">{locationSlots.length} Slots</p>
                                <div className="flex flex-col gap-1">
                                  <span className="bg-green-400 text-white px-2 py-1 rounded-lg text-xs font-bold">{availableInLocation} Available</span>
                                  <span className="bg-red-400 text-white px-2 py-1 rounded-lg text-xs font-bold">{occupiedInLocation} Occupied</span>
                                  {maintenanceInLocation > 0 && (
                                    <span className="bg-orange-400 text-white px-2 py-1 rounded-lg text-xs font-bold">{maintenanceInLocation} Maintenance</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Slots List */}
                          <div className="p-3 space-y-2">
                            {locationSlots.map((slot) => (
                              <div
                                key={slot.id}
                                className={`rounded-lg border-2 shadow-sm ${
                                  slot.isDisabled
                                    ? "bg-gray-50 border-gray-400"
                                    : slot.status === "AVAILABLE"
                                    ? "bg-green-50 border-green-300"
                                    : "bg-red-50 border-red-300"
                                }`}
                              >
                                {/* Top Row - Slot Info and Status */}
                                <div className="flex items-center justify-between p-3 pb-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-base text-gray-900">Slot {slot.slotNumber}</p>
                                    <p className="text-xs text-gray-600 mt-1">{slot.slotType || "Standard Car"}</p>
                                  </div>
                                  
                                  <span
                                    className={`px-3 py-1 rounded-lg text-xs font-bold text-white whitespace-nowrap ml-2 ${
                                      slot.isDisabled
                                        ? "bg-orange-500"
                                        : slot.status === "AVAILABLE"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                  >
                                    {slot.isDisabled ? "🔧 Maintenance" : slot.status === "AVAILABLE" ? "Available" : "Occupied"}
                                  </span>
                                </div>

                                {/* Bottom Row - Quick Actions */}
                                <div className="flex items-center gap-1 px-3 pb-2 flex-wrap">
                                  <button
                                    onClick={() => handleEditSlot(slot)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition font-bold flex-shrink-0"
                                    title="Edit"
                                  >
                                    ✏️
                                  </button>
                                  {slot.isDisabled ? (
                                    <button
                                      onClick={() => handleEnableSlot(slot.id)}
                                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition font-bold flex-shrink-0"
                                      title="Enable Slot"
                                    >
                                      ✅
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleShowDisableModal(slot)}
                                      className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition font-bold flex-shrink-0"
                                      title="Disable for Maintenance"
                                    >
                                      🔧
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleToggleSlot(slot.id, slot.status === "AVAILABLE")}
                                    className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition font-bold flex-shrink-0"
                                    title="Toggle"
                                  >
                                    🔄
                                  </button>
                                  <button
                                    onClick={() => handleConfirmDelete(slot)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition font-bold flex-shrink-0"
                                    title="Delete"
                                  >
                                    🗑️
                                  </button>
                                </div>

                                {/* Maintenance Notes */}
                                {slot.isDisabled && slot.maintenanceNotes && (
                                  <div className="px-3 pb-3">
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                                      <p className="text-xs text-orange-700 font-semibold mb-1">📝 Maintenance Notes:</p>
                                      <p className="text-xs text-gray-700">{slot.maintenanceNotes}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Fallback: Show all slots without location grouping if no locations exist
                    <div className="space-y-3">
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center shadow-sm">
                        <p className="text-sm text-blue-700 font-bold">⚠️ Create locations first to organize slots by location</p>
                      </div>
                      {slots
                        .filter(slot => {
                          if (slotFilter === "available") return slot.status === "AVAILABLE";
                          if (slotFilter === "occupied") return slot.status === "OCCUPIED";
                          if (slotFilter === "maintenance") return slot.status === "MAINTENANCE";
                          return true; // Show all if filter is "all"
                        })
                        .map((slot) => (
                        <div
                          key={slot.id}
                          className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                            slot.status === "MAINTENANCE"
                              ? "bg-orange-50 border-orange-300"
                              : slot.status === "AVAILABLE"
                              ? "bg-green-50 border-green-300"
                              : "bg-red-50 border-red-300"
                          } shadow-sm`}
                        >
                          <div className="flex-1">
                            <p className="font-bold text-base text-gray-900">Slot {slot.slotNumber}</p>
                            <p className="text-xs text-gray-600 mt-1">{slot.slotType || "Standard Car"}</p>
                            {slot.isDisabled && slot.maintenanceNotes && (
                              <p className="text-xs text-orange-700 mt-1 italic">🔧 {slot.maintenanceNotes}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${
                                slot.status === "MAINTENANCE" ? "bg-orange-500" : slot.status === "AVAILABLE" ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              {slot.status === "MAINTENANCE" ? "Maintenance" : slot.status === "AVAILABLE" ? "Available" : "Occupied"}
                            </span>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-2 ml-3">
                            <button
                              onClick={() => handleEditSlot(slot)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition font-bold"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleToggleSlot(slot.id, slot.status === "AVAILABLE")}
                              className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition font-bold"
                              title="Toggle"
                            >
                              🔄
                            </button>
                            <button
                              onClick={() => handleConfirmDelete(slot)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition font-bold"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-16">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center shadow-sm">
                    <p className="text-base text-gray-600 font-semibold">No slots available</p>
                    <p className="text-xs text-gray-500 mt-2">Create your first slot using the button above</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div>
              <BookingList
                currentBookings={currentBookings}
                pastBookings={pastBookings}
                loading={loading}
              />
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4 pb-20">
              {/* Admin Profile Card - Enhanced */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-3xl">👤</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{localStorage.getItem("name") || "Administrator"}</h2>
                    <p className="text-blue-100 text-sm">{localStorage.getItem("email") || "admin@smartparking.com"}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div>
                    <p className="text-blue-100 text-xs mb-1">Role</p>
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      {localStorage.getItem("role") || "ADMIN"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-xs mb-1">User ID</p>
                    <p className="text-white font-bold">{localStorage.getItem("userId") || "1"}</p>
                  </div>
                </div>
              </div>

              {/* Account Details Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <span>📋</span>
                    Account Details
                  </h3>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Email</span>
                    <span className="text-sm text-gray-900 font-semibold">{localStorage.getItem("email") || "N/A"}</span>
                  </div>
                  
                  {localStorage.getItem("phone") && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600 font-medium">Phone</span>
                      <span className="text-sm text-gray-900 font-semibold">{localStorage.getItem("phone")}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 font-medium">Account Type</span>
                    <span className="text-sm text-gray-900 font-semibold">Administrator</span>
                  </div>
                </div>
              </div>

              {/* Logout Button - Enhanced */}
              <button
                onClick={() => {
                  showConfirm(
                    "Logout",
                    "Are you sure you want to logout?",
                    () => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("userId");
                      localStorage.removeItem("email");
                      localStorage.removeItem("name");
                      localStorage.removeItem("role");
                      localStorage.removeItem("phone");
                      navigate("/");
                    },
                    null
                  );
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-lg">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Locations Tab */}
          {activeTab === "locations" && (
            <div className="space-y-4 pb-20">
              {/* Add Location Button - Enhanced */}
              <button
                onClick={() => {
                  setEditingLocation(null);
                  setShowLocationModal(true);
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="text-lg">➕</span>
                <span>Add Location</span>
              </button>

              {/* Locations List */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm font-semibold">Loading locations...</p>
                  </div>
                </div>
              ) : locations.length > 0 ? (
                <div className="space-y-4">
                  {locations.map((location) => {
                    const locationSlots = slots.filter(s => s.location?.id === location.id || s.locationId === location.id);
                    const availableSlots = locationSlots.filter(s => s.status === "AVAILABLE").length;
                    const occupiedSlots = locationSlots.length - availableSlots;
                    const canDelete = locationSlots.length === 0;
                    
                    return (
                      <div key={location.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100">
                        {/* Location Header - Gradient */}
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">📍</span>
                                <h3 className="font-bold text-lg">{location.name}</h3>
                              </div>
                              <p className="text-sm text-pink-100">{location.address || "No address provided"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-br from-gray-50 to-white">
                          <div className="bg-white rounded-xl p-3 shadow-md border-2 border-blue-100">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg">🅿️</span>
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-blue-600">{locationSlots.length}</p>
                                <p className="text-xs text-gray-600 font-semibold">Slots</p>
                              </div>
                            </div>
                          </div>

                          <div className={`rounded-xl p-3 shadow-md border-2 ${canDelete ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100'}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${canDelete ? 'bg-green-100' : 'bg-red-100'}`}>
                                <span className="text-lg">{canDelete ? '✅' : '⚠️'}</span>
                              </div>
                              <div>
                                <p className={`text-2xl font-bold ${canDelete ? 'text-green-600' : 'text-red-600'}`}>
                                  {canDelete ? '✓' : '✕'}
                                </p>
                                <p className={`text-xs font-semibold ${canDelete ? 'text-green-700' : 'text-red-700'}`}>
                                  {canDelete ? 'Can Delete' : 'Has Slots'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 px-4 pb-4">
                          <button
                            onClick={() => handleEditLocation(location)}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <span>✏️</span>
                            <span className="text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => setSelectedLocationId(selectedLocationId === location.id ? null : location.id)}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <span>{selectedLocationId === location.id ? '🔼' : '🔽'}</span>
                            <span className="text-sm">{selectedLocationId === location.id ? 'Hide' : 'Slots'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteLocation(location.id)}
                            disabled={!canDelete}
                            className={`flex-1 py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                              canDelete
                                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            title={canDelete ? "Delete location" : `Cannot delete: ${locationSlots.length} slot(s) exist`}
                          >
                            <span>🗑️</span>
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>

                        {/* Expanded Slots View for Selected Location */}
                        {selectedLocationId === location.id && locationSlots.length > 0 && (
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mx-4 mb-4 p-4 border-2 border-gray-200 shadow-inner">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                                <span>📋</span>
                                Slots in this location:
                              </h4>
                              {locationSlots.length > 0 && (
                                <button
                                  onClick={() => handleBulkDeleteSlotsForLocation(location.id)}
                                  className="text-xs bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded-lg font-bold shadow-md transition-all"
                                  title="Delete all slots for this location"
                                >
                                  🗑️ Delete All
                                </button>
                              )}
                            </div>
                            
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                              {locationSlots.map((slot) => (
                                <div
                                  key={slot.id}
                                  className={`flex items-center justify-between p-3 rounded-lg shadow-md border-2 transition-all hover:shadow-lg ${
                                    slot.status === "AVAILABLE"
                                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                                      : slot.status === "MAINTENANCE"
                                      ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
                                      : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
                                  }`}
                                >
                                  <div className="flex-1">
                                    <p className="font-bold text-sm text-gray-900">{slot.slotNumber}</p>
                                    <p className="text-xs text-gray-600">({slot.slotType || 'Car'})</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-3 py-1 rounded-lg text-xs font-bold text-white shadow-md ${
                                        slot.status === "AVAILABLE" 
                                          ? 'bg-green-500' 
                                          : slot.status === "MAINTENANCE"
                                          ? 'bg-orange-500'
                                          : 'bg-red-500'
                                      }`}
                                    >
                                      {slot.status === "AVAILABLE" ? 'Available' : slot.status === "MAINTENANCE" ? 'Maintenance' : 'Occupied'}
                                    </span>
                                    <button
                                      onClick={() => {
                                        setEditingSlot(slot);
                                        setActiveTab('slots');
                                        setShowSlotModal(true);
                                      }}
                                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                      title="Edit slot"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      onClick={() => handleConfirmDelete(slot)}
                                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                      title="Delete slot"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Quick Add Slot Button */}
                            <button
                              onClick={() => {
                                setEditingSlot(null);
                                setShowSlotModal(true);
                                setActiveTab('slots');
                              }}
                              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-bold shadow-md transition-all mt-3 flex items-center justify-center gap-2"
                            >
                              <span>➕</span>
                              <span className="text-sm">Add Slot to {location.name}</span>
                            </button>
                          </div>
                        )}

                        {/* Empty Slots Message */}
                        {selectedLocationId === location.id && locationSlots.length === 0 && (
                          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg mx-4 mb-4 p-4 border-2 border-yellow-200 text-center">
                            <div className="text-4xl mb-2">📭</div>
                            <p className="text-sm text-gray-700 font-semibold mb-3">No slots in this location</p>
                            <button
                              onClick={() => {
                                setEditingSlot(null);
                                setShowSlotModal(true);
                                setActiveTab('slots');
                              }}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all"
                            >
                              ➕ Create First Slot
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center bg-white rounded-xl p-8 shadow-lg border-2 border-gray-100">
                    <div className="text-6xl mb-4">📍</div>
                    <p className="text-gray-600 font-semibold mb-2">No locations available</p>
                    <p className="text-gray-500 text-sm">Create your first location to get started!</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disable Slot Modal */}
        {showDisableModal && slotToDisable && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🔧</span>
                <h3 className="text-xl font-bold text-gray-900">Disable Slot for Maintenance</h3>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Slot: <span className="font-bold">{slotToDisable.slotNumber}</span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  This slot will be marked as disabled and unavailable for booking.
                </p>
                
                <label className="block mb-2 font-semibold text-gray-700">
                  Maintenance Notes (Optional)
                </label>
                <textarea
                  value={maintenanceNotes}
                  onChange={(e) => setMaintenanceNotes(e.target.value)}
                  placeholder="e.g., Undergoing maintenance, Electrical repairs, etc."
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none"
                  rows="4"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDisableModal(false);
                    setSlotToDisable(null);
                    setMaintenanceNotes("");
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisableSlot}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                >
                  <span>🔧</span>
                  <span>Disable Slot</span>
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
