import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { bookingService } from "../services/bookingService";
import { promotionService } from "../services/promotionService";
import { pricingService } from "../services/pricingService";
import PaymentModal from "../components/PaymentModal";

export default function Payments() {
  const [pastBookings, setPastBookings] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("history");
  const [pendingPayment, setPendingPayment] = useState(null);
  const [pendingLiveMinutes, setPendingLiveMinutes] = useState(null);
  const [pendingLiveAmount, setPendingLiveAmount] = useState(null);
  const [pendingRatePerHour, setPendingRatePerHour] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const location = useLocation();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [vehicleType, setVehicleType] = useState("CAR");
  const [durationHours, setDurationHours] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(null);

  useEffect(() => {
    fetchData();
    
    // Check if coming from Bookings page after checkout
    if (location.state?.openPaymentModal && location.state?.pendingBooking) {
      console.log('📋 Opening PaymentModal for booking:', location.state.pendingBooking);
      setPendingPayment(location.state.pendingBooking);
      setShowPaymentModal(true);
      // Clear location state to prevent re-opening on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [bookings, promos] = await Promise.all([
        bookingService.getPastBookings(0, 50),
        promotionService.getActivePromotions(),
      ]);
      const allBookings = bookings.bookings || [];
      setPastBookings(allBookings);
      
      const unpaid = allBookings.find((b) => {
        const isPaid = b?.paymentStatus === 'PAID' || !!b?.transactionId;
        const isLikelyUnpaidStatus = b?.paymentStatus === 'PENDING_PAYMENT' || b?.status === 'ACTIVE';
        const hasNonzeroFee = (b?.parkingFee || 0) > 0;
        return !isPaid && isLikelyUnpaidStatus && hasNonzeroFee;
      });

      setPendingPayment(unpaid || null);
    // initialize live pending values
    if (unpaid) {
      try {
        const minutes = unpaid.exitTime ? (unpaid.durationMinutes || 0) : Math.max(0, Math.floor((Date.now() - new Date(unpaid.entryTime).getTime()) / 60000));
        setPendingLiveMinutes(minutes);
        setPendingLiveAmount(unpaid.parkingFee || 0);
      } catch (e) {
        setPendingLiveMinutes(null);
        setPendingLiveAmount(null);
      }
    } else {
      setPendingLiveMinutes(null);
      setPendingLiveAmount(null);
    }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load payment data";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Live update pending payment amount & duration every 30s
  useEffect(() => {
    let mounted = true;
    const loadRateAndTick = async () => {
      if (!pendingPayment) return;
      try {
        const data = await pricingService.getPricingByType(pendingPayment.vehicleType || 'CAR');
        if (!mounted) return;
        setPendingRatePerHour(data.hourlyRate || 0);
        // initial compute
        let minutes = 0;
        try {
          minutes = pendingPayment.exitTime ? (pendingPayment.durationMinutes || 0) : (pendingPayment.entryTime ? Math.max(0, Math.floor((Date.now() - new Date(pendingPayment.entryTime).getTime()) / 60000)) : (pendingPayment.durationMinutes || 0));
        } catch (e) { minutes = pendingPayment.durationMinutes || 0; }
        setPendingLiveMinutes(minutes);
        setPendingLiveAmount(((data.hourlyRate || 0) * minutes) / 60 || pendingPayment.parkingFee || 0);
      } catch (e) {
        if (!mounted) return;
        setPendingRatePerHour(0);
      }
    };

    loadRateAndTick();

    const interval = setInterval(() => {
      if (!pendingPayment) return;
      let minutes = 0;
      try {
        minutes = pendingPayment.exitTime ? (pendingPayment.durationMinutes || 0) : (pendingPayment.entryTime ? Math.max(0, Math.floor((Date.now() - new Date(pendingPayment.entryTime).getTime()) / 60000)) : (pendingPayment.durationMinutes || 0));
      } catch (e) { minutes = pendingPayment.durationMinutes || 0; }
      setPendingLiveMinutes(minutes);
      setPendingLiveAmount(((pendingRatePerHour || 0) * minutes) / 60 || pendingPayment.parkingFee || 0);
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pendingPayment, pendingRatePerHour]);

  const calculateFee = async () => {
    try {
      const totalMinutes = durationHours * 60 + parseInt(durationMinutes || 0);
      const priceData = await pricingService.getPricingByType(vehicleType);
    // support both legacy (hourlyRate) and new (ratePerHour) keys
    const hourlyRate = priceData?.hourlyRate ?? priceData?.ratePerHour ?? 0;
      const hours = totalMinutes / 60;
      let fee = hourlyRate * hours;
      if (promoDiscount) {
        fee = fee * (1 - promoDiscount.discountPercentage / 100);
      }
      setCalculatedFee(fee);
    } catch (err) {
      showToast("Failed to calculate fee", 'error');
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) {
      showToast("Please enter a promotion code", 'error');
      return;
    }
    try {
      const result = await promotionService.validatePromoCode(promoCode);
      if (result.valid) {
        setPromoDiscount(result);
        showToast(`Promo applied! ${result.discountPercentage}% discount`, 'success');
        calculateFee();
      } else {
        showToast(result.error || "Invalid promotion code", 'error');
      }
    } catch (err) {
      showToast("Failed to apply promotion code", 'error');
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    showToast("Payment successful!", 'success');
    setShowPaymentModal(false);
    fetchData();
  };

  const totalPaid = pastBookings.reduce((sum, b) => {
    const isPaid = b?.paymentStatus === 'PAID' || !!b?.transactionId;
    return sum + (isPaid ? (b?.parkingFee || 0) : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Clean Header */}
      <div className="border-b border-gray-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💳</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-sm text-gray-500">Track your parking history</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-900 p-4 rounded-lg mb-6">
            <p className="font-semibold text-sm mb-3">⚠️ {error}</p>
            <button
              onClick={fetchData}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Clean Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-2 rounded-md font-semibold text-sm transition-all ${
              activeTab === "history"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📜 History
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-5 py-2 rounded-md font-semibold text-sm transition-all ${
              activeTab === "calculator"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🧮 Calculate
          </button>
          <button
            onClick={() => setActiveTab("promotions")}
            className={`px-5 py-2 rounded-md font-semibold text-sm transition-all ${
              activeTab === "promotions"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🎟️ Promos
          </button>
        </div>

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {/* Pending Payment */}
            {pendingPayment && (
              <>
                {/* Desktop / larger screens */}
                <div className="hidden md:block bg-amber-50 border-2 border-amber-300 p-5 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-amber-900 flex items-center gap-2">
                      <span className="text-xl">⏳</span> Pending Payment
                    </h3>
                    <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Action Required
                    </span>
                  </div>
                  <p className="text-sm text-amber-800 mb-4">Slot {pendingPayment.slotNumber} • {pendingPayment.locationName}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-amber-900">₹{(pendingLiveAmount != null ? pendingLiveAmount : (pendingPayment.parkingFee || 0)).toFixed(2)}</p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-semibold transition text-sm"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>

                {/* Mobile B/W */}
                <div className="md:hidden bg-white rounded-xl p-4 border border-black/10 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">⏳</div>
                      <div>
                        <p className="font-bold text-slate-900">Pending Payment</p>
                        <p className="text-xs text-gray-500">Slot {pendingPayment.slotNumber} • {pendingPayment.locationName}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-semibold border border-black text-slate-900 bg-white">Action</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xl font-bold text-slate-900">₹{(pendingLiveAmount != null ? pendingLiveAmount : (pendingPayment.parkingFee || 0)).toFixed(2)}</p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="bg-black text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Pay
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Total Amount */}
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg">
              <p className="text-sm text-blue-600 font-semibold mb-2">Total Paid</p>
              <p className="text-4xl font-bold text-blue-900">₹{totalPaid.toFixed(2)}</p>
              <p className="text-xs text-blue-600 mt-2">{pastBookings.filter(b => b?.paymentStatus === 'PAID' || !!b?.transactionId).length} transactions</p>
            </div>

            {/* Transactions */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading...</p>
                </div>
              </div>
            ) : pastBookings.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg py-12 text-center">
                <p className="text-3xl mb-3">💸</p>
                <p className="font-bold text-gray-900">No transactions yet</p>
                <p className="text-sm text-gray-500 mt-1">Your payment history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="hidden md:block space-y-3">
                {pastBookings.map((booking) => {
                  const isPaid = booking?.paymentStatus === 'PAID' || !!booking?.transactionId;
                  return (
                    <div key={booking.id} className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900">Slot {booking.slotNumber}</p>
                          <p className="text-xs text-gray-500 mt-1">📍 {booking.locationName}</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900">₹{(booking.parkingFee || 0).toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{booking.vehicleType || 'CAR'}</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{booking.durationMinutes || 0}m</span>
                        <span className={`px-2 py-1 rounded font-semibold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {isPaid ? '✓ Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile B/W */}
              <div className="md:hidden space-y-3">
                {pastBookings.map((booking) => {
                  const isPaid = booking?.paymentStatus === 'PAID' || !!booking?.transactionId;
                  return (
                    <div key={booking.id} className="bg-white rounded-xl p-4 border border-black/10 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">{(booking.locationName || 'L').charAt(0).toUpperCase()}</div>
                          <div>
                            <p className="font-bold text-slate-900">Slot {booking.slotNumber}</p>
                            <p className="text-xs text-gray-500">{booking.locationName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">₹{(booking.parkingFee || 0).toFixed(2)}</p>
                          <p className="text-xs text-gray-500 mt-1">{isPaid ? '✓ Paid' : 'Pending'}</p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <p className="text-gray-500">Vehicle</p>
                          <p className="font-semibold text-slate-900">{booking.vehicleType || 'CAR'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Duration</p>
                          <p className="font-semibold text-slate-900">{booking.durationMinutes || 0}m</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === "calculator" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 p-5 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CAR">🚗 Car</option>
                  <option value="BIKE">🏍️ Bike</option>
                  <option value="TRUCK">🚚 Truck</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Hours</label>
                  <input
                    type="number"
                    value={durationHours}
                    onChange={(e) => setDurationHours(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full border border-gray-300 p-3 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Minutes</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-full border border-gray-300 p-3 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="59"
                  />
                </div>
              </div>

              <button
                onClick={calculateFee}
                className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 rounded-lg transition"
              >
                Calculate Fee
              </button>

              {calculatedFee > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Estimated Fee</p>
                  <p className="text-3xl font-bold text-blue-900">₹{calculatedFee.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Promotions Tab */}
        {activeTab === "promotions" && (
          <div className="space-y-4">
            {/* Apply Promo */}
            <div className="bg-white border border-gray-200 p-5 rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎟️</span>
                <h3 className="font-bold text-gray-900">Promo Code</h3>
              </div>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE"
                className="w-full border border-gray-300 p-3 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-600 uppercase"
              />
              <button
                onClick={handleApplyPromo}
                className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 rounded-lg transition"
              >
                Apply Code
              </button>
              {promoDiscount && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
                  <p className="text-sm font-bold text-green-700">✓ {promoDiscount.discountPercentage}% Discount Applied</p>
                </div>
              )}
            </div>

            {/* Promos List */}
            {promotions.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg py-12 text-center">
                <p className="text-3xl mb-3">🎯</p>
                <p className="font-bold text-gray-900">No active promotions</p>
                <p className="text-sm text-gray-500 mt-1">Check back later for amazing deals!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    onClick={() => setPromoCode(promo.code)}
                    className="bg-white border border-gray-200 p-4 rounded-lg hover:border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">🎟️</span>
                        <div>
                          <p className="font-bold text-gray-900">{promo.code}</p>
                          <p className="text-xs text-gray-500 mt-1">{promo.description}</p>
                        </div>
                      </div>
                      <div className="bg-gray-100 text-slate-700 px-3 py-1 rounded-lg font-bold text-sm border border-gray-200">
                        {promo.discountPercentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed left-1/2 top-20 -translate-x-1/2 w-[90%] max-w-sm px-6 py-4 rounded-lg shadow-lg text-white font-bold z-50 text-center border ${
            toast.type === 'success' 
              ? 'bg-green-600 border-green-700' 
              : 'bg-red-600 border-red-700'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && pendingPayment && (
        <PaymentModal 
          booking={pendingPayment}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
