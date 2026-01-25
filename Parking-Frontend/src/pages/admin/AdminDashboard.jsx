/**
 * Admin Dashboard
 * Main admin page with slot management, booking monitoring, and statistics
 * Uses MobileLayout for consistent mobile design
 */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SlotCard from "../../components/admin/SlotCard";
import SlotGrid from "../../components/admin/SlotGrid";
import SlotFormInline from "../../components/admin/SlotFormInline";
import LocationFormInline from "../../components/admin/LocationFormInline";
import BookingList from "../../components/admin/BookingList";
import axios from "../../api/axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Sync tab with route path for desktop admin layout
  useEffect(() => {
    const path = location.pathname || "/admin";
    const mapping = {
      "/admin": "dashboard",
      "/admin/dashboard": "dashboard",
      "/admin/slots": "slots",
      "/admin/bookings": "bookings",
      "/admin/locations": "locations",
      "/admin/users": "users",
      "/admin/profile": "profile",
    };
    const tab = mapping[path];
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.pathname]);

  // Auto-select location when navigating from Manage Locations
  useEffect(() => {
    if (location.state?.selectedLocationId) {
      setSelectedFilterLocation(String(location.state.selectedLocationId));
      setActiveTab("slots"); // Ensure we're on the slots tab
      // Clear the state so it doesn't persist on back navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // State management
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, slots, bookings, locations, users, profile
  const [slots, setSlots] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
  // Search/filter for users list
  const [userSearch, setUserSearch] = useState("");
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
  const [selectedFilterLocation, setSelectedFilterLocation] = useState("all"); // Filter by location
  const [selectedSlotId, setSelectedSlotId] = useState("all"); // Filter by slot in selected location

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
      let slotsWithStatus = [];
      try {
        console.log("📊 [FETCH] Getting admin slots from /admin/slots");
        const slotsRes = await axios.get("/admin/slots");
        const slotsData = Array.isArray(slotsRes.data) ? slotsRes.data : [];
        console.log("📦 [FETCH] Raw slot data:", slotsData);

        // ✅ FIX: Convert boolean 'available' to string 'status' for UI
        slotsWithStatus = slotsData.map((slot) => ({
          ...slot,
          status: slot.isDisabled ? "MAINTENANCE" : (slot.available ? "AVAILABLE" : "OCCUPIED"),
        }));
        console.log("📦 [FETCH] Slots with status:", slotsWithStatus);
        setSlots(slotsWithStatus);
        console.log("✅ [FETCH] Slots received:", slotsWithStatus.length);
      } catch (slotsErr) {
        console.warn("⚠️ [FETCH] Failed to fetch slots (non-critical):", slotsErr.message);
        setSlots([]);
      }

      // Fetch locations
      let locationsData = [];
      try {
        console.log("📊 [FETCH] Getting locations from /map/locations");
        const locationsRes = await axios.get("/map/locations");
        locationsData = Array.isArray(locationsRes.data) ? locationsRes.data : [];
        setLocations(locationsData);
        console.log("✅ [FETCH] Locations received:", locationsData.length);
      } catch (locationsErr) {
        console.warn("⚠️ [FETCH] Failed to fetch locations (non-critical):", locationsErr.message);
        setLocations([]);
      }

      // Fetch all users (admin scope)
      console.log("📊 [FETCH] Getting all users from /auth/admin/users");
      try {
        const usersRes = await axios.get("/auth/admin/users");
        const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
        setUsers(usersData);
        console.log("✅ [FETCH] Users received:", usersData.length);
      } catch (usersErr) {
        console.warn("⚠️ [FETCH] Failed to fetch users (non-critical):", usersErr.message);
        // Don't fail the entire dashboard if users endpoint fails
        setUsers([]);
      }

      // Fetch current bookings (admin scope)
      let currentBookingsData = [];
      let pastBookingsData = [];
      try {
        console.log("📊 [FETCH] Getting active bookings from /admin/bookings/status/ACTIVE");
        const currentRes = await axios.get("/admin/bookings/status/ACTIVE");
        const currentBookingsRaw = Array.isArray(currentRes.data) ? currentRes.data : [];
        currentBookingsData = currentBookingsRaw.map(normalizeBooking);
        setCurrentBookings(currentBookingsData);
        console.log("✅ [FETCH] Current bookings received:", currentBookingsData.length);

        // Fetch past bookings (completed)
        console.log("📊 [FETCH] Getting past bookings from /admin/bookings/status/COMPLETED");
        const pastRes = await axios.get("/admin/bookings/status/COMPLETED");
        const pastBookingsRaw = Array.isArray(pastRes.data) ? pastRes.data : [];
        pastBookingsData = pastBookingsRaw.map(normalizeBooking);
        setPastBookings(pastBookingsData);
        console.log("✅ [FETCH] Past bookings received:", pastBookingsData.length);
      } catch (bookingsErr) {
        console.warn("⚠️ [FETCH] Failed to fetch bookings (non-critical):", bookingsErr.message);
        currentBookingsData = [];
        pastBookingsData = [];
        setCurrentBookings([]);
        setPastBookings([]);
      }

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

      // Check if it's an auth error (401/403) - then redirect
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.error("❌ [FETCH] Authorization error - redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/", { replace: true });
        return;
      }

      // For other errors, show notification but don't redirect
      setError("Failed to load some dashboard data. Please refresh.");
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

  // User actions
  const handleEditUser = (user) => {
    window.alert(`Edit user flow (TODO): ${user?.name || user?.email} (ID: ${user?.id})`);
  };

  const handleRemoveUser = (user) => {
    showConfirm(
      "Remove User",
      `Are you sure you want to remove ${user.name || user.email}? This action cannot be undone.`,
      async () => {
        try {
          await axios.delete(`/auth/admin/users/${user.id}`);
          showNotification("success", "✅ User removed");
          await fetchAllData();
        } catch (err) {
          const msg = err.response?.data?.message || err.message || "Failed to remove user";
          showNotification("error", `❌ ${msg}`);
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
        <p className="text-rose-600 text-center">Loading...</p>
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
              className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-semibold animate-pulse ${notification.type === 'success'
                ? 'bg-emerald-600'
                : notification.type === 'error'
                  ? 'bg-red-600'
                  : 'bg-amber-600'
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

      {/* Header with Shuttle theme */}
      <div className="px-6 pt-6">
        <div className="max-w-7xl mx-auto bg-slate-50 border border-slate-100 rounded-3xl shadow-md p-8 relative overflow-hidden">


          <div className="flex items-center justify-between gap-4 relative z-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1 flex items-center gap-3">
                <span className="text-4xl">📊</span>
                Admin Dashboard
              </h1>
              <p className="text-slate-600 text-base font-medium">Manage parking operations efficiently</p>
            </div>
            <span className="hidden md:inline-flex px-5 py-2.5 rounded-full bg-slate-600 text-white text-sm font-bold shadow">Desktop View</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex justify-between items-center">
          <p className="text-red-700 font-semibold">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 font-bold hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{confirmDialog.title}</h3>
            <p className="text-gray-600 text-base mb-8">{confirmDialog.message}</p>
            <div className="flex gap-4">
              <button
                onClick={confirmDialog.onCancel}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area - Enhanced Desktop Layout */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Slot Form Inline - Show above content when adding/editing in Slots tab */}
          {showSlotModal && activeTab === "slots" && (
            <div ref={slotFormRef} className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 mb-4 p-4 rounded-2xl shadow-md">
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
            <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 mb-4 p-4 rounded-2xl shadow-md">
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
            <div className="space-y-6 pb-8">
              {/* Page Header */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">📊</span>
                      <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                    </div>
                    <p className="text-slate-600">Manage parking operations efficiently</p>
                  </div>
                  <span className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium text-sm">Desktop View</span>
                </div>
              </div>

              {/* Occupancy Card */}
              <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">📊</span>
                  <h2 className="text-xl font-bold text-gray-800">Parking Occupancy Rate</h2>
                </div>
                <p className="text-6xl font-bold text-slate-700 mb-2">
                  {totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0}%
                </p>
                <p className="text-gray-500">{occupiedSlots} of {totalSlots} slots occupied</p>
              </div>

              {/* Stats Grid - Muted Colors */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                  <span className="text-4xl block mb-2">🅿️</span>
                  <p className="text-3xl font-bold text-slate-700 mb-1">{stats.availableSlots}</p>
                  <p className="text-sm font-medium text-slate-600">Available Slots</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                  <span className="text-4xl block mb-2">🚗</span>
                  <p className="text-3xl font-bold text-slate-700 mb-1">{occupiedSlots}</p>
                  <p className="text-sm font-medium text-slate-600">Occupied Slots</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                  <span className="text-4xl block mb-2">🔧</span>
                  <p className="text-3xl font-bold text-slate-700 mb-1">{stats.maintenanceSlots || 0}</p>
                  <p className="text-sm font-medium text-slate-600">In Maintenance</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                  <span className="text-4xl block mb-2">📋</span>
                  <p className="text-3xl font-bold text-slate-700 mb-1">{currentBookings.length}</p>
                  <p className="text-sm font-medium text-slate-600">Active Bookings</p>
                </div>
              </div>

              {/* Grid Layout for Stats Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Locations Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">Locations Overview</h3>
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-5 text-center">
                      <p className="text-sm font-medium mb-2 text-slate-600">Total Locations</p>
                      <p className="text-4xl font-bold text-slate-700">{stats.totalLocations}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-5 text-center">
                      <p className="text-sm font-medium mb-2 text-slate-600">Total Bookings</p>
                      <p className="text-4xl font-bold text-slate-700">{stats.totalBookings}</p>
                    </div>
                  </div>
                </div>

                {/* Efficiency Metrics Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">Efficiency Metrics</h3>
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Available Slots</span>
                        <span className="text-lg font-bold text-gray-900">{stats.availableSlots}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-slate-500"
                          style={{
                            width: `${totalSlots > 0 ? Math.round((stats.availableSlots / totalSlots) * 100) : 0}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{totalSlots > 0 ? Math.round((stats.availableSlots / totalSlots) * 100) : 0}% of total</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Occupied Slots</span>
                        <span className="text-lg font-bold text-gray-900">{occupiedSlots}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0}% of total</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Bookings Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <h3 className="text-lg font-semibold text-gray-900">Active Bookings</h3>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-medium text-sm">{currentBookings.length} Active</span>
                </div>
                {currentBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                    {currentBookings.slice(0, 9).map((booking, idx) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{booking.vehicleNumber || `Booking #${idx + 1}`}</p>
                            <p className="text-sm text-gray-500 mt-1">📍 Slot: <span className="font-medium">{booking.slotNumber || 'N/A'}</span></p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Active</span>
                        </div>
                      </div>
                    ))}
                    {currentBookings.length > 9 && (
                      <div className="col-span-full text-center py-3 border-t border-gray-200 mt-2">
                        <p className="text-sm font-medium text-gray-500">+ {currentBookings.length - 9} more bookings</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">📋</div>
                    <p className="text-gray-500">No active bookings at the moment</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Slots Tab */}
          {activeTab === "slots" && (
            <div className="space-y-6 pb-8">
              {/* Controls - Enhanced with Better Layout */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-700">📍 Filter by Location:</label>
                    <select
                      id="locationFilter"
                      value={selectedFilterLocation}
                      onChange={(e) => {
                        setSelectedFilterLocation(e.target.value);
                        setSelectedSlotId("all"); // Reset slot selection when location changes
                      }}
                      className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Locations</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-gray-700">🅿️ Filter by Slot:</label>
                    <select
                      id="slotFilter"
                      value={selectedSlotId}
                      onChange={(e) => setSelectedSlotId(e.target.value)}
                      className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={selectedFilterLocation === "all"}
                    >
                      <option value="all">All Slots</option>
                      {selectedFilterLocation !== "all" &&
                        slots
                          .filter((s) => (s.location?.id || s.locationId) === parseInt(selectedFilterLocation))
                          .map((slot) => (
                            <option key={slot.id} value={slot.id}>
                              {slot.slotNumber} - {slot.status}
                            </option>
                          ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          id="autoRefresh"
                          checked={autoRefresh}
                          onChange={(e) => setAutoRefresh(e.target.checked)}
                          className="w-5 h-5 cursor-pointer accent-blue-600"
                        />
                        <label
                          htmlFor="autoRefresh"
                          className="text-base font-semibold text-gray-700 cursor-pointer"
                        >
                          Auto-refresh
                        </label>
                      </div>
                      <button
                        onClick={fetchAllData}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-emerald-700 transition-colors"
                      >
                        🔄 Refresh
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats - Shuttle White Theme */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center">
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stats.availableSlots}</p>
                  <p className="text-sm font-semibold text-gray-600">Available Slots</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center">
                  <p className="text-4xl font-bold text-gray-900 mb-2">{occupiedSlots}</p>
                  <p className="text-sm font-semibold text-gray-600">Occupied Slots</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center">
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stats.totalSlots}</p>
                  <p className="text-sm font-semibold text-gray-600">Total Slots</p>
                </div>
              </div>

              {/* Add New Slot Button - Emerald Green */}
              <button
                onClick={() => {
                  setEditingSlot(null);
                  setShowSlotModal(true);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3"
              >
                <span className="text-lg">➕</span>
                <span>Create New Slot</span>
              </button>

              {/* Slots Grouped by Location */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <p className="text-gray-600 text-lg font-semibold">Loading slots...</p>
                </div>
              ) : slots.length > 0 ? (
                <div className="space-y-6">
                  {locations.length > 0 ? (
                    locations
                      .filter((location) => {
                        // Filter by selected location
                        if (selectedFilterLocation === "all") return true;
                        return location.id === parseInt(selectedFilterLocation);
                      })
                      .map((location) => {
                        const locationId = location.id;
                        let locationSlots = slots.filter(s => s.location?.id === locationId || s.locationId === locationId);

                        // Apply slot filter if a specific slot is selected
                        if (selectedSlotId !== "all") {
                          locationSlots = locationSlots.filter(s => s.id === parseInt(selectedSlotId));
                        }

                        if (locationSlots.length === 0) return null;

                        const availableInLocation = locationSlots.filter(s => s.status === "AVAILABLE" && !s.isDisabled).length;
                        const occupiedInLocation = locationSlots.filter(s => s.status === "OCCUPIED" && !s.isDisabled).length;
                        const maintenanceInLocation = locationSlots.filter(s => s.isDisabled).length;

                        return (
                          <div key={location.id} data-location-id={location.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition scroll-mt-24">
                            {/* Location Header - Shuttle White */}
                            <div className="bg-white px-8 py-6 border-b border-gray-200 rounded-t-2xl">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg text-gray-900 mb-1">📍 {location.name}</h3>
                                  <p className="text-sm text-gray-600">{location.address}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-base font-bold text-gray-900 mb-3">{locationSlots.length} Slots</p>
                                  <div className="flex flex-col gap-2">
                                    <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">{availableInLocation} Available</span>
                                    <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200">{occupiedInLocation} Occupied</span>
                                    {maintenanceInLocation > 0 && (
                                      <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">{maintenanceInLocation} Maintenance</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Slots List - Grid Layout for Desktop */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {locationSlots.map((slot) => (
                                <div
                                  key={slot.id}
                                  className={`rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition`}
                                >
                                  {/* Top Row - Slot Info and Status */}
                                  <div className="flex items-start justify-between p-4">
                                    <div className="flex-1">
                                      <p className="font-bold text-lg text-gray-900">Slot {slot.slotNumber}</p>
                                      <p className="text-sm text-gray-600 mt-2">{slot.slotType || "Standard Car"}</p>
                                    </div>

                                    <span
                                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ml-3 flex-shrink-0 ${slot.isDisabled
                                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                                        : slot.status === "AVAILABLE"
                                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                          : "bg-gray-100 text-gray-800 border border-gray-200"
                                        }`}
                                    >
                                      {slot.isDisabled ? "🔧" : slot.status === "AVAILABLE" ? "✅" : "🚗"}
                                    </span>
                                  </div>

                                  {/* Bottom Row - Quick Actions */}
                                  <div className="flex items-center gap-2 px-4 pb-4 flex-wrap border-t pt-3">
                                    <button
                                      onClick={() => handleEditSlot(slot)}
                                      className="p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold flex-shrink-0"
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    {slot.isDisabled ? (
                                      <button
                                        onClick={() => handleEnableSlot(slot.id)}
                                        className="p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold flex-shrink-0"
                                        title="Enable Slot"
                                      >
                                        ✅
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleShowDisableModal(slot)}
                                        className="p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold flex-shrink-0"
                                        title="Disable for Maintenance"
                                      >
                                        🔧
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleToggleSlot(slot.id, slot.status === "AVAILABLE")}
                                      className="p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold flex-shrink-0"
                                      title="Toggle"
                                    >
                                      🔄
                                    </button>
                                    <button
                                      onClick={() => handleConfirmDelete(slot)}
                                      className="p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold flex-shrink-0"
                                      title="Delete"
                                    >
                                      🗑️
                                    </button>
                                  </div>

                                  {/* Maintenance Notes */}
                                  {slot.isDisabled && slot.maintenanceNotes && (
                                    <div className="px-4 pb-4">
                                      <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                                        <p className="text-sm text-teal-700 font-semibold mb-2">📝 Maintenance Notes:</p>
                                        <p className="text-sm text-gray-700">{slot.maintenanceNotes}</p>
                                      </div>
                                    </div>
                                  )}
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
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold shadow-sm transition mt-4 flex items-center justify-center gap-2"
                            >
                              <span>➕</span>
                              <span>Add Slot to {location.name}</span>
                            </button>
                          </div>
                        );
                      })
                  ) : (
                    // Fallback: Show all slots without location grouping if no locations exist
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                        <p className="text-base text-gray-700 font-semibold flex items-center justify-center gap-3">
                          <span className="text-2xl">⚠️</span>
                          Create locations first to organize slots
                        </p>
                      </div>
                      {slots
                        .filter(slot => {
                          // Filter by location
                          if (selectedFilterLocation !== "all") {
                            const slotLocationId = slot.location?.id || slot.locationId;
                            if (slotLocationId !== parseInt(selectedFilterLocation)) return false;
                          }
                          // Filter by specific slot
                          if (selectedSlotId !== "all") {
                            return slot.id === parseInt(selectedSlotId);
                          }
                          return true;
                        })
                        .map((slot) => {
                          return (
                            <div
                              key={slot.id}
                              className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white shadow-sm`}
                            >
                              <div className="flex-1">
                                <p className="font-bold text-base text-gray-900">Slot {slot.slotNumber}</p>
                                <p className="text-xs text-gray-600 mt-1">{slot.slotType || "Standard Car"}</p>
                                {slot.isDisabled && slot.maintenanceNotes && (
                                  <p className="text-xs text-indigo-700 mt-1 italic">🔧 {slot.maintenanceNotes}</p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-lg text-xs font-semibold border ${slot.status === "MAINTENANCE"
                                    ? "bg-amber-100 text-amber-800 border-amber-200"
                                    : slot.status === "AVAILABLE"
                                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                    }`}
                                >
                                  {slot.status === "MAINTENANCE" ? "Maintenance" : slot.status === "AVAILABLE" ? "Available" : "Occupied"}
                                </span>
                              </div>

                              {/* Quick Actions */}
                              <div className="flex gap-2 ml-3">
                                <button
                                  onClick={() => handleEditSlot(slot)}
                                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleToggleSlot(slot.id, slot.status === "AVAILABLE")}
                                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold"
                                  title="Toggle"
                                >
                                  🔄
                                </button>
                                <button
                                  onClick={() => handleConfirmDelete(slot)}
                                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold"
                                  title="Delete"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-16">
                  <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
                    <p className="text-lg text-gray-800 font-semibold flex items-center justify-center gap-3">
                      <span className="text-3xl">🔍</span>
                      No slots available
                    </p>
                    <p className="text-sm text-gray-600 mt-3">Create your first slot using the button above</p>
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

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6 pb-20">
              {/* Header - with search and invite CTA */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-3xl">👥</span>
                    System Users
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Search, manage and invite users</p>
                  <p className="text-gray-500 text-sm mt-2">{userSearch ? `${users.filter(u => ((u.name||'').toLowerCase().includes(userSearch.toLowerCase()) || (u.email||'').toLowerCase().includes(userSearch.toLowerCase()) || (u.phone||'').toLowerCase().includes(userSearch.toLowerCase()))).length} of ${users.length} matching` : `${users.length} total users`}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search by name, email or phone..."
                      className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm w-72 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                    {userSearch ? (
                      <button
                        onClick={() => setUserSearch("")}
                        className="absolute right-3 top-2 text-gray-500 font-bold"
                        aria-label="Clear search"
                      >
                        ✕
                      </button>
                    ) : (
                      <span className="absolute right-3 top-2 text-gray-400">🔎</span>
                    )}
                  </div>
                  <button
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                    onClick={() => window.alert('Invite user flow (to be implemented)')}
                  >
                    + Invite User
                  </button>
                </div>
              </div>

              {/* Users Table/List - filtered */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <p className="text-gray-600 text-lg font-semibold">Loading users...</p>
                </div>
              ) : (() => {
                const query = userSearch?.trim().toLowerCase();
                const filtered = query ? users.filter(u => (
                  (u.name || '')?.toLowerCase().includes(query) ||
                  (u.email || '')?.toLowerCase().includes(query) ||
                  (u.phone || '')?.toLowerCase().includes(query)
                )) : users;

                return filtered.length > 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white border-b border-gray-100 text-slate-700">
                          <tr>
                            <th className="px-6 py-4 text-left font-semibold text-sm">Name</th>
                            <th className="px-6 py-4 text-left font-semibold text-sm">Email</th>
                            <th className="px-6 py-4 text-left font-semibold text-sm">Phone</th>
                            <th className="px-6 py-4 text-left font-semibold text-sm">Role</th>
                            <th className="px-6 py-4 text-left font-semibold text-sm">Joined</th>
                            <th className="px-6 py-4 text-right font-semibold text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filtered.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-medium flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 font-semibold">
                                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                  <div className="text-sm text-slate-800">{user.name || 'N/A'}</div>
                                  <div className="text-xs text-gray-500">ID: {user.id}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">{user.phone || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-800'}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                              <td className="px-6 py-4 text-right text-sm">
                                <button onClick={() => handleEditUser(user)} className="px-3 py-1 text-slate-700 hover:bg-slate-100 rounded-lg mr-2">Edit</button>
                                <button onClick={() => handleRemoveUser(user)} className="px-3 py-1 text-rose-600 hover:bg-rose-50 rounded-lg">Remove</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View - Black & White Theme */}
                    <div className="md:hidden space-y-3 p-4">
                      {filtered.map((user) => (
                        <div key={user.id} className="bg-white rounded-xl p-4 border border-black/10 shadow-md">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-semibold text-lg">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 truncate">{user.name || 'N/A'}</p>
                              <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded text-xs font-semibold border border-black text-slate-900 bg-white`}>{user.role}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <button onClick={() => handleEditUser(user)} className="flex-1 px-3 py-2 bg-black text-white rounded-lg shadow-sm">Edit</button>
                            <button onClick={() => handleRemoveUser(user)} className="flex-1 px-3 py-2 bg-white border border-black text-black rounded-lg">Remove</button>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>
                              <p className="text-gray-500">Phone</p>
                              <p className="font-semibold text-slate-900">{user.phone || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-500">Joined</p>
                              <p className="font-semibold text-slate-900">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center bg-slate-50 rounded-2xl p-12 shadow-md border border-slate-100">
                      <div className="text-8xl mb-6">👤</div>
                      <p className="text-gray-600 font-semibold mb-3 text-lg">No users match your search</p>
                      <p className="text-gray-500 text-sm">Try a different name, email or phone</p>
                    </div>
                  </div>
                )
              })() }
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4 pb-20">
              {/* Admin Profile Card - Enhanced */}
              <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 rounded-3xl p-8 shadow-2xl text-white border-2 border-slate-700">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl">👤</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{localStorage.getItem("name") || "Administrator"}</h2>
                    <p className="text-slate-100 text-base mt-1">{localStorage.getItem("email") || "admin@smartparking.com"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg">
                  <div>
                    <p className="text-slate-100 text-xs font-bold mb-2 tracking-widest uppercase">Role</p>
                    <span className="bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-lg inline-block">
                      {localStorage.getItem("role") || "ADMIN"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-100 text-xs mb-1">User ID</p>
                    <p className="text-white font-bold">{localStorage.getItem("userId") || "1"}</p>
                  </div>
                </div>
              </div>

              {/* Account Details Card */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
                <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 px-8 py-6 shadow-lg">
                  <h3 className="font-bold text-white text-2xl flex items-center gap-3">
                    <span className="text-3xl">📋</span>
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
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-5 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-300 flex items-center justify-center gap-3 text-lg"
              >
                <span className="text-lg">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Locations Tab */}
          {activeTab === "locations" && (
            <div className="space-y-6 pb-20">
              {/* Add Location Button - Enhanced */}
              <button
                onClick={() => {
                  setEditingLocation(null);
                  setShowLocationModal(true);
                }}
                className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white py-5 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
              >
                <span className="text-lg">➕</span>
                <span>Add New Location</span>
              </button>

              {/* Locations List - Grid Layout for Desktop */}
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <div className="text-center">
                    <div className="w-20 h-20 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin mx-auto mb-6 shadow-lg"></div>
                    <p className="text-slate-700 text-xl font-bold">Loading locations...</p>
                    <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
                  </div>
                </div>
              ) : locations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {locations.map((location) => {
                    const locationSlots = slots.filter(s => s.location?.id === location.id || s.locationId === location.id);
                    const availableSlots = locationSlots.filter(s => s.status === "AVAILABLE").length;
                    const occupiedSlots = locationSlots.length - availableSlots;
                    const canDelete = locationSlots.length === 0;

                    return (
                      <div key={location.id} className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
                        {/* Location Header - Simplified */}
                        <div className="bg-slate-700 text-white p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-11 h-11 bg-white/15 rounded-lg flex items-center justify-center">
                                  <span className="text-2xl">📍</span>
                                </div>
                                <h3 className="font-bold text-xl text-white leading-snug">{location.name}</h3>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-slate-100 mt-1">📍</span>
                                <p className="text-sm text-slate-50 leading-relaxed">{location.address || "No address provided"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50">
                          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700">
                                <span className="text-2xl">🅿️</span>
                              </div>
                              <div>
                                <p className="text-3xl font-bold text-slate-700 leading-none">{locationSlots.length}</p>
                                <p className="text-xs text-gray-600 font-semibold tracking-wide mt-1">TOTAL SLOTS</p>
                              </div>
                            </div>
                          </div>

                          <div className={`bg-white rounded-xl p-5 shadow-sm border ${canDelete ? 'border-green-200' : 'border-amber-200'
                            }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${canDelete ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                <span className="text-2xl">{canDelete ? '✅' : '⚠️'}</span>
                              </div>
                              <div>
                                <p className={`text-2xl font-bold leading-none ${canDelete ? 'text-green-700' : 'text-amber-700'}`}>
                                  {canDelete ? '✓' : '✕'}
                                </p>
                                <p className={`text-xs font-semibold tracking-wide mt-1 ${canDelete ? 'text-green-600' : 'text-amber-600'}`}>
                                  {canDelete ? 'CAN DELETE' : 'HAS SLOTS'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-3 px-6 pb-6 bg-white">
                          <button
                            onClick={() => handleEditLocation(location)}
                            className="bg-slate-700 text-white py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <span className="text-lg">✏️</span>
                            <span className="text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => setSelectedLocationId(selectedLocationId === location.id ? null : location.id)}
                            className="bg-slate-600 text-white py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <span className="text-lg">{selectedLocationId === location.id ? '🔼' : '🔽'}</span>
                            <span className="text-sm">{selectedLocationId === location.id ? 'Hide' : 'View'} Slots</span>
                          </button>
                          <button
                            onClick={() => handleDeleteLocation(location.id)}
                            disabled={!canDelete}
                            className={`py-3 rounded-xl font-semibold shadow-sm transition-colors duration-200 flex items-center justify-center gap-2 ${canDelete
                              ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            title={canDelete ? "Delete location" : `Cannot delete: ${locationSlots.length} slot(s) exist`}
                          >
                            <span className="text-lg">🗑️</span>
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>

                        {/* Expanded Slots View for Selected Location */}
                        {/* Expanded Slots Section - Fixed Layout */}
                        {selectedLocationId === location.id && locationSlots.length > 0 && (
                          <div className="bg-white p-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700">
                                    <span className="text-2xl">📋</span>
                                  </div>
                                  <h4 className="font-bold text-xl text-gray-800">Slots in {location.name}</h4>
                                </div>
                                <p className="text-xs text-gray-600">Manage all parking slots for this location</p>
                              </div>
                              {locationSlots.length > 0 && (
                                <button
                                  onClick={() => handleBulkDeleteSlotsForLocation(location.id)}
                                  className="bg-rose-600 text-white px-4 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors duration-200 flex items-center gap-2"
                                  title="Delete all slots for this location"
                                >
                                  <span className="text-lg">🗑️</span>
                                  <span>Delete All Slots</span>
                                </button>
                              )}
                            </div>

                            {/* Slots Grid - Fixed Alignment */}
                            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
                              {locationSlots.map((slot) => (
                                <div
                                  key={slot.id}
                                  className={`flex items-center justify-between p-4 rounded-xl shadow-sm border ${slot.status === "AVAILABLE"
                                    ? 'bg-green-50 border-green-200'
                                    : slot.status === "MAINTENANCE"
                                      ? 'bg-purple-50 border-purple-200'
                                      : 'bg-slate-50 border-slate-200'
                                    }`}
                                >
                                  <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className={`w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center shadow-md ${slot.status === "AVAILABLE"
                                      ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                      : slot.status === "MAINTENANCE"
                                        ? 'bg-gradient-to-br from-purple-400 to-indigo-500'
                                        : 'bg-gradient-to-br from-slate-400 to-slate-600'
                                      }`}>
                                      <span className="text-2xl text-white font-bold">🅿️</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-xl text-gray-900 truncate">{slot.slotNumber}</p>
                                      <p className="text-sm text-gray-600 mt-1 font-semibold truncate">{slot.slotType || 'Standard Car'}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <span
                                      className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white whitespace-nowrap ${slot.status === "AVAILABLE"
                                        ? 'bg-green-600'
                                        : slot.status === "MAINTENANCE"
                                          ? 'bg-purple-600'
                                          : 'bg-slate-600'
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
                                      className="p-3 text-slate-600 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors duration-150"
                                      title="Edit slot"
                                    >
                                      <span className="text-xl">✏️</span>
                                    </button>
                                    <button
                                      onClick={() => handleConfirmDelete(slot)}
                                      className="p-3 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-lg transition-colors duration-150"
                                      title="Delete slot"
                                    >
                                      <span className="text-xl">🗑️</span>
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
                              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors duration-200 mt-5 flex items-center justify-center gap-2"
                            >
                              <span className="text-2xl">➕</span>
                              <span className="text-sm">Add Slot to {location.name}</span>
                            </button>
                          </div>
                        )}

                        {/* Empty Slots Message */}
                        {selectedLocationId === location.id && locationSlots.length === 0 && (
                          <div className="bg-slate-50 rounded-lg mx-6 mb-6 p-6 border-2 border-slate-100 text-center">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-lg text-gray-700 font-semibold mb-4">No slots in this location</p>
                            <button
                              onClick={() => {
                                setEditingSlot(null);
                                setShowSlotModal(true);
                                setActiveTab('slots');
                              }}
                              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all"
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
                <div className="flex items-center justify-center py-20">
                  <div className="text-center bg-white rounded-2xl p-12 shadow-lg border-2 border-gray-200">
                    <div className="text-8xl mb-6">📍</div>
                    <p className="text-gray-600 font-semibold mb-3 text-lg">No locations available</p>
                    <p className="text-gray-500 text-sm">Create your first location to get started!</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-emerald-500 resize-none"
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
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
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
