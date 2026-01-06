import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../services/bookingService";

export default function Bookings() {
  const [currentBookings, setCurrentBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("current"); // current | past
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingOut, setCheckingOut] = useState(null);
  const [toast, setToast] = useState(null); // {type: 'success'|'error', message: string}
  const [confirmModal, setConfirmModal] = useState(null); // {type: 'checkout'|'cancel', bookingId}
  const [isProcessing, setIsProcessing] = useState(false); // Prevent double-clicks
  const navigate = useNavigate();

  // Helper function to show toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper function to format duration
  const formatDuration = (minutes) => {
    if (!minutes || minutes < 0) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return `${mins}m`;
    }
    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const [current, past] = await Promise.all([
        bookingService.getCurrentBookings(0, 20),
        bookingService.getPastBookings(0, 20),
      ]);

      setCurrentBookings(current.bookings || []);
      setPastBookings(past.bookings || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to load bookings";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (bookingId) => {
    console.log('🔵 handleCheckout called with bookingId:', bookingId);
    if (isProcessing || confirmModal) {
      console.warn('⚠️ Already processing or modal already open');
      return;
    }
    console.log('✅ Setting confirmModal with checkout request');
    setConfirmModal({ type: 'checkout', bookingId });
    setIsProcessing(true);
  };

  const confirmCheckoutAction = async () => {
    console.log('🟢 confirmCheckoutAction called');
    console.log('📋 confirmModal:', confirmModal);
    const bookingId = confirmModal.bookingId;
    setConfirmModal(null);
    setIsProcessing(false);

    try {
      setCheckingOut(bookingId);
      console.log('📤 Calling bookingService.checkout with bookingId:', bookingId);
      const response = await bookingService.checkout(bookingId);
      console.log('✅ Checkout response:', response);

      showToast(
        `💳 Checkout Successful! Duration: ${response.durationMinutes}m | Fee: ₹${response.parkingFee}`,
        'success'
      );

      // Navigate to Payments page with booking data to open PaymentModal automatically
      setTimeout(() => {
        navigate('/payments', {
          state: {
            pendingBooking: response,
            openPaymentModal: true
          }
        });
      }, 1500);
    } catch (err) {
      console.error('❌ Checkout error:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Checkout failed. Please try again.";
      showToast(errorMsg, 'error');
    } finally {
      setCheckingOut(null);
    }
  };

  const handleCancel = async (bookingId) => {
    console.log('🔵 handleCancel called with bookingId:', bookingId);
    if (isProcessing || confirmModal) {
      console.warn('⚠️ Already processing or modal already open');
      return;
    }
    console.log('✅ Setting confirmModal with cancel request');
    setConfirmModal({ type: 'cancel', bookingId });
    setIsProcessing(true);
  };

  const confirmCancelAction = async () => {
    const bookingId = confirmModal.bookingId;
    setConfirmModal(null);
    setIsProcessing(false);

    try {
      await bookingService.cancelBooking(bookingId);
      showToast("✅ Booking cancelled successfully", 'success');
      fetchBookings();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to cancel booking";
      showToast(errorMsg, 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-semibold">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error && currentBookings.length === 0 && pastBookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-6 shadow-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">📋</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Bookings</h1>
              <p className="text-sm text-indigo-100">Track your parking history</p>
            </div>
          </div>
        </div>
        <div className="px-6">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-5 rounded-2xl shadow-lg border border-red-300">
            <p className="font-semibold flex items-center gap-2 mb-3">
              <span className="text-xl">⚠️</span>
              {error}
            </p>
            <button
              onClick={fetchBookings}
              className="bg-white text-red-600 hover:bg-red-50 px-5 py-2 rounded-xl font-semibold transition shadow-md"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">📋</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Bookings</h1>
            <p className="text-sm text-indigo-100">Track your parking history</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {error && currentBookings.length > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-5 rounded-2xl mb-6 shadow-lg border border-red-300">
            <p className="font-semibold text-sm flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              {error}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 bg-white p-3 rounded-xl border border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("current")}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
              activeTab === "current"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🟢 Active ({currentBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
              activeTab === "past"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📋 History ({pastBookings.length})
          </button>
        </div>

        {/* Current Bookings */}
        {activeTab === "current" && (
          <div className="space-y-4">
            {currentBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-blue-300 py-12 text-center">
                <p className="text-5xl mb-3">🅿️</p>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  No Active Bookings
                </p>
                <p className="text-gray-500 mb-6">
                  Book a parking slot to get started
                </p>
                <button
                  onClick={() => navigate("/map")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition"
                >
                  Find Parking
                </button>
              </div>
            ) : (
              currentBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCheckout={handleCheckout}
                  onCancel={handleCancel}
                  isChecking={checkingOut === booking.id}
                  formatDuration={formatDuration}
                />
              ))
            )}
          </div>
        )}

        {/* Past Bookings */}
        {activeTab === "past" && (
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 py-12 text-center">
                <p className="text-5xl mb-3">📭</p>
                <p className="text-lg font-semibold text-gray-700">
                  No Past Bookings
                </p>
                <p className="text-gray-500 mt-2">
                  Your booking history will appear here
                </p>
              </div>
            ) : (
              pastBookings.map((booking) => (
                <PastBookingCard
                  key={booking.id}
                  booking={booking}
                  formatDuration={formatDuration}
                />
              ))
            )}
          </div>
        )}
      </div>

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

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {confirmModal.type === 'checkout' ? '💳 Confirm Checkout' : '❌ Confirm Cancellation'}
            </h2>
            <p className="text-gray-600 mb-6">
              {confirmModal.type === 'checkout' 
                ? 'Proceed with checkout and payment? This will finalize your parking session.' 
                : 'Are you sure you want to cancel this booking? This action cannot be undone.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmModal(null);
                  setIsProcessing(false);
                }}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition"
              >
                No, Cancel
              </button>
              <button
                onClick={confirmModal.type === 'checkout' ? confirmCheckoutAction : confirmCancelAction}
                className={`flex-1 px-4 py-3 text-white rounded-lg font-semibold transition ${
                  confirmModal.type === 'checkout' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Yes, {confirmModal.type === 'checkout' ? 'Checkout' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, onCheckout, onCancel, isChecking, formatDuration }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-5 border-2 border-blue-100 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center font-bold text-blue-600 text-lg border-2 border-blue-200">
            {booking.slotNumber}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">{booking.locationName}</p>
            <p className="text-sm text-gray-600">Slot {booking.slotNumber}</p>
          </div>
        </div>
        <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold border border-green-300">
          🟢 Active
        </span>
      </div>

      {/* Vehicle Type */}
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold">
          {booking.vehicleType}
        </span>
      </div>

      {/* Duration Box */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl mb-4 border border-yellow-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 font-semibold">⏱️ Duration</span>
          <span className="font-bold text-2xl text-yellow-700">
            {formatDuration(booking.durationMinutes)}
          </span>
        </div>
        <p className="text-xs text-gray-600">
          Entry: {new Date(booking.entryTime).toLocaleTimeString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          onClick={() => onCheckout(booking.id)}
          disabled={isChecking}
          className="col-span-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition"
        >
          {isChecking ? "⏳ Processing..." : "💳 Checkout"}
        </button>
        <button
          onClick={() => onCancel(booking.id)}
          className="bg-red-100 hover:bg-red-200 text-red-600 py-3 rounded-xl font-bold transition"
          title="Cancel booking"
        >
          ✖
        </button>
      </div>

      {/* Details Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-blue-600 text-sm font-semibold w-full text-center py-2 hover:text-blue-700"
      >
        {showDetails ? "▲ Hide Details" : "▼ Show Details"}
      </button>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Vehicle Type:</span>
            <span className="font-bold text-gray-900">{booking.vehicleType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Entry Time:</span>
            <span className="font-bold text-gray-900">
              {new Date(booking.entryTime).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-bold text-gray-900">{booking.durationMinutes} mins</span>
          </div>
        </div>
      )}
    </div>
  );
}

function PastBookingCard({ booking, formatDuration }) {
  const [showDetails, setShowDetails] = useState(false);
  const isCancelled = booking.status === "CANCELLED";
  const statusLabel = isCancelled ? "Cancelled" : "Completed";
  const statusStyles = isCancelled
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-300";
  const parkingFee = booking.parkingFee ?? 0;

  return (
    <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center font-bold text-gray-600 text-lg border-2 border-gray-200">
            {booking.slotNumber}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">{booking.locationName}</p>
            <p className="text-sm text-gray-600">Slot {booking.slotNumber}</p>
          </div>
        </div>
        <span className={`${statusStyles} px-4 py-2 rounded-full text-xs font-bold border`}>
          {isCancelled ? "✖" : "✓"} {statusLabel}
        </span>
      </div>

      {/* Vehicle & Fee */}
      <div className="flex justify-between items-center mb-4">
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold">
          {booking.vehicleType}
        </span>
        <span className={`text-3xl font-bold ${isCancelled ? "text-red-600" : "text-green-600"}`}>
          ₹{parkingFee?.toFixed ? parkingFee.toFixed(2) : parkingFee}
        </span>
      </div>

      {/* Duration */}
      <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">
          ⏱️ Duration: <span className="font-bold">{formatDuration(booking.durationMinutes)}</span>
        </p>
      </div>

      {/* Details Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-blue-600 text-sm font-semibold w-full text-center py-2 hover:text-blue-700"
      >
        {showDetails ? "▲ Hide Details" : "▼ Show Details"}
      </button>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Entry Time:</span>
            <span className="font-bold text-gray-900">
              {new Date(booking.entryTime).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Exit Time:</span>
            <span className="font-bold text-gray-900">
              {new Date(booking.exitTime).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-bold text-gray-900">{booking.durationMinutes} mins</span>
          </div>
        </div>
      )}
    </div>
  );
}
