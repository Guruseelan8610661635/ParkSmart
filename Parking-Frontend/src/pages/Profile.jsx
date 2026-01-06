import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserLogin from "../components/UserLogin";
import UserRegister from "../components/UserRegister";
import AdminLogin from "../components/AdminLogin";
import { isLoggedIn, getCurrentUser } from "../utils/auth";
import { authService } from "../services/authService";
import { vehicleService } from "../services/vehicleService";
import { logout } from "../utils/auth";

export default function Profile() {
  const [mode, setMode] = useState("home"); // modes: home | login | register | admin | profile
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Logout confirmation
  const [toast, setToast] = useState(null); // {type: 'success'|'error', message: string}
  const [vehicleForm, setVehicleForm] = useState({
    vehicleType: "CAR",
    registrationNumber: "",
    make: "",
    model: "",
    color: "",
  });
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  // Helper function to get vehicle icon based on type
  const getVehicleIcon = (vehicleType) => {
    const icons = {
      CAR: '🚗',
      BIKE: '🏍️',
      SUV: '🚙',
      TRUCK: '🚚'
    };
    return icons[vehicleType] || '🚗';
  };

  // Helper function to show toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    if (isLoggedIn()) {
      // Don't redirect admins - they should use direct /admin link
      setMode("profile");
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    if (loading) return; // Prevent multiple simultaneous calls
    try {
      setLoading(true);
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (err) {
      console.error("Profile fetch error:", err);
      // If we can't fetch profile, use cached user data
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    authService.logout();
    setMode("home");
    setUser(null);
    setShowLogoutConfirm(false);
    showToast("👋 Logged out successfully", 'success');
  };

  const handleAddVehicle = () => {
    setEditingVehicleId(null);
    setVehicleForm({
      vehicleType: "CAR",
      registrationNumber: "",
      make: "",
      model: "",
      color: "",
    });
    setShowVehicleModal(true);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setVehicleForm({
      vehicleType: vehicle.vehicleType,
      registrationNumber: vehicle.registrationNumber,
      make: vehicle.make || "",
      model: vehicle.model || "",
      color: vehicle.color || "",
    });
    setShowVehicleModal(true);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    try {
      await vehicleService.deleteVehicle(vehicleId);
      // Refresh profile
      await fetchProfile();
      showToast("🗑️ Vehicle deleted successfully!", 'success');
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      showToast(err.response?.data?.error || "Failed to delete vehicle", 'error');
    }
  };

  const handleSetDefaultVehicle = async (vehicleId) => {
    try {
      await vehicleService.setDefaultVehicle(vehicleId);
      // Refresh profile
      await fetchProfile();
      showToast("✅ Default vehicle updated!", 'success');
    } catch (err) {
      console.error("Error setting default vehicle:", err);
      showToast(err.response?.data?.error || "Failed to set default vehicle", 'error');
    }
  };

  const handleSaveVehicle = async () => {
    if (!vehicleForm.registrationNumber.trim()) {
      showToast("⚠️ Please enter registration number", 'error');
      return;
    }

    // Debug: Check if token exists
    const token = localStorage.getItem("token");
    console.log("🔑 Token before vehicle save:", token ? "✅ Present" : "❌ Missing");
    if (token) {
      console.log("🔑 Token (first 20 chars):", token.substring(0, 20) + "...");
    }

    try {
      if (editingVehicleId) {
        await vehicleService.updateVehicle(editingVehicleId, vehicleForm);
      } else {
        await vehicleService.addVehicle(vehicleForm);
      }
      
      setShowVehicleModal(false);
      await fetchProfile();
      showToast(editingVehicleId ? "✏️ Vehicle updated!" : "🚗 Vehicle added!", 'success');
    } catch (err) {
      console.error("Error saving vehicle:", err);
      console.log("🔐 Response status:", err.response?.status);
      console.log("🔐 Response data:", err.response?.data);
      showToast(err.response?.data?.error || "Failed to save vehicle", 'error');
    }
  };

  // AUTH HOME PAGE - when not logged in
  if (mode === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20 flex flex-col">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 text-white px-6 py-12 text-center">
          <div className="text-6xl mb-4">🅿️</div>
          <h1 className="text-3xl font-bold mb-2">ParkSmart</h1>
          <p className="text-blue-100 text-lg">Smart Parking Solutions</p>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-8">
          <div className="bg-white p-6 rounded-2xl border border-blue-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Welcome to Smart Parking
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Find, book, and manage your parking spaces effortlessly. Join thousands of users enjoying seamless parking experience.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm font-semibold text-gray-700">Quick Booking</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
              <div className="text-3xl mb-2">💰</div>
              <p className="text-sm font-semibold text-gray-700">Best Prices</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
              <div className="text-3xl mb-2">🔒</div>
              <p className="text-sm font-semibold text-gray-700">Secure</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-sm font-semibold text-gray-700">Instant</p>
            </div>
          </div>

          {/* AUTH OPTIONS */}
          <div className="space-y-3">
            <button
              onClick={() => setMode("login")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold text-lg transition hover:shadow-lg"
            >
              👤 User Login
            </button>

            <button
              onClick={() => setMode("register")}
              className="w-full bg-white border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-bold text-lg transition hover:bg-blue-50"
            >
              ✍️ Create Account
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={() => setMode("admin")}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg transition hover:shadow-lg"
            >
              🔐 Admin Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGIN MODE
  if (mode === "login") {
    return (
      <div className="p-6 pb-20">
        <UserLogin
          onBack={() => setMode("home")}
        />
      </div>
    );
  }

  // REGISTER MODE
  if (mode === "register") {
    return (
      <div className="p-6 pb-20">
        <UserRegister onBack={() => setMode("home")} />
      </div>
    );
  }

  // ADMIN LOGIN MODE
  if (mode === "admin") {
    return (
      <div className="p-6 pb-20">
        <AdminLogin onBack={() => setMode("home")} />
      </div>
    );
  }

  // PROFILE PAGE - when logged in
  if (mode === "profile" && user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-28">
        {/* Profile Header - Enhanced */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-b-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-4xl">👤</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-blue-100 text-sm">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div>
              <p className="text-blue-100 text-xs mb-1">Account Type</p>
              <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                {user.role === "ADMIN" ? "ADMIN" : "USER"}
              </span>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-xs mb-1">User ID</p>
              <p className="text-white font-bold">{user.id}</p>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-4">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span>📋</span>
                Personal Information
              </h3>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600 font-medium">Name</span>
                <span className="text-sm text-gray-900 font-semibold">{user.name}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600 font-medium">Email</span>
                <span className="text-sm text-gray-900 font-semibold text-right max-w-[200px] break-words">{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">Phone</span>
                  <span className="text-sm text-gray-900 font-semibold">{user.phone}</span>
                </div>
              )}
              
              {user.createdAt && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 font-medium">Member Since</span>
                  <span className="text-sm text-gray-900 font-semibold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Vehicles Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <span>🚗</span>
                    Registered Vehicles
                  </h3>
                  <p className="text-xs text-green-100 mt-1">
                    💡 Your default vehicle is auto-selected when booking parking
                  </p>
                </div>
                <button
                  onClick={handleAddVehicle}
                  className="bg-white text-green-600 px-3 py-1 rounded-lg font-bold text-sm hover:bg-green-50 transition shadow-sm"
                >
                  + Add
                </button>
              </div>
            </div>

            <div className="p-4">
              {user.vehicles && user.vehicles.length > 0 ? (
                <div className="space-y-3">
                  {user.vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900 text-base">
                              {vehicle.isDefault && <span className="text-green-600">Default </span>}
                              {vehicle.vehicleType}
                            </p>
                          </div>
                          <p className="text-sm text-gray-700 font-semibold">
                            {vehicle.registrationNumber}
                          </p>
                          {(vehicle.make || vehicle.model) && (
                            <p className="text-xs text-gray-600 mt-1">
                              {vehicle.make} {vehicle.model}
                            </p>
                          )}
                          {vehicle.color && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Color: {vehicle.color}
                            </p>
                          )}
                        </div>
                        <div className="text-4xl">
                          {getVehicleIcon(vehicle.vehicleType)}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-blue-200">
                        {!vehicle.isDefault && (
                          <button
                            onClick={() => handleSetDefaultVehicle(vehicle.id)}
                            className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg font-semibold text-xs transition"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg font-semibold text-xs transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg font-semibold text-xs transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <p className="text-5xl mb-3">🚗</p>
                  <p className="text-gray-600 font-semibold mb-1">No vehicles registered</p>
                  <p className="text-gray-500 text-sm mb-4">Add your vehicle to get started</p>
                  <button
                    onClick={handleAddVehicle}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition shadow-md"
                  >
                    Add Your First Vehicle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button - Enhanced */}
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>

        {/* Vehicle Modal */}
        {showVehicleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-5">
                {editingVehicleId ? "Edit Vehicle" : "Add New Vehicle"}
              </h3>

              <div className="space-y-4">
                {/* Vehicle Type */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleForm.vehicleType}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="CAR">🚗 Car</option>
                    <option value="BIKE">🏍️ Motorcycle</option>
                    <option value="SUV">🚙 SUV</option>
                    <option value="TRUCK">🚚 Truck</option>
                  </select>
                </div>

                {/* Registration Number */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    value={vehicleForm.registrationNumber}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value })
                    }
                    placeholder="ABC-1234"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Make (Optional) */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Make (Optional)
                  </label>
                  <input
                    type="text"
                    value={vehicleForm.make}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, make: e.target.value })
                    }
                    placeholder="Toyota, Honda, etc."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Model (Optional) */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Model (Optional)
                  </label>
                  <input
                    type="text"
                    value={vehicleForm.model}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, model: e.target.value })
                    }
                    placeholder="Camry, Civic, etc."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Color (Optional) */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Color (Optional)
                  </label>
                  <input
                    type="text"
                    value={vehicleForm.color}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, color: e.target.value })
                    }
                    placeholder="Black, White, etc."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowVehicleModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVehicle}
                  className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
                >
                  {editingVehicleId ? "Update" : "Add"} Vehicle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">🚪 Confirm Logout</h3>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to logout? You'll need to login again to access your account.
              </p>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed left-1/2 top-24 -translate-x-1/2 w-[90%] max-w-md px-5 py-4 rounded-xl shadow-lg text-white font-semibold z-50 animate-pulse text-center ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 text-center pb-24">
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}
