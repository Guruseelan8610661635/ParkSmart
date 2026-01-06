import { useState } from 'react';
import { paymentService } from '../services/paymentService';

export default function PaymentModal({ booking, onClose, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const amount = booking.parkingFee || 0;

  const handlePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setLoading(true);
    setError('');

    try {
      console.log('💳 Processing payment for booking:', booking.id, 'Amount:', amount, 'Method:', paymentMethod);
      
      const response = await paymentService.processPayment(
        booking.id,
        amount,
        paymentMethod
      );

      console.log('✅ Payment response:', response);

      if (response.success) {
        setTransactionId(response.transactionId);
        // Call success callback
        onPaymentSuccess(response);
      } else {
        setError(response.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('❌ Payment error:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to process payment. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  // Success screen
  if (transactionId) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center space-y-6">
          <div className="text-6xl">✅</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Your parking fee has been processed.</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-2 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono font-bold text-green-700">{transactionId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-bold text-gray-900">₹{amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-bold text-gray-900">
                {paymentMethod === 'CARD' ? '💳 Card' : '📱 UPI'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Slot Released:</span>
              <span className="font-bold text-green-700">✓ Yes</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Payment options screen
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">💳 Complete Payment</h2>
          <p className="text-gray-600 text-sm">
            {booking.locationName} • Slot #{booking.slotNumber}
          </p>
        </div>

        {/* Amount Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
          <p className="text-gray-600 text-sm mb-2">Amount Due</p>
          <p className="text-4xl font-bold text-gray-900">₹{amount.toFixed(2)}</p>
          <p className="text-gray-500 text-xs mt-2">
            ⏱️ Duration: {booking.durationMinutes} minutes
          </p>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <p className="font-semibold text-gray-800">Select Payment Method</p>
          
          {/* Card Option */}
          <button
            onClick={() => setPaymentMethod('CARD')}
            className={`w-full p-4 rounded-xl border-2 transition flex items-center gap-3 ${
              paymentMethod === 'CARD'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-3xl">💳</div>
            <div className="text-left flex-1">
              <p className="font-bold text-gray-900">Credit/Debit Card</p>
              <p className="text-xs text-gray-500">Visa, Mastercard, Amex</p>
            </div>
            {paymentMethod === 'CARD' && <span className="text-2xl">✓</span>}
          </button>

          {/* UPI Option */}
          <button
            onClick={() => setPaymentMethod('UPI')}
            className={`w-full p-4 rounded-xl border-2 transition flex items-center gap-3 ${
              paymentMethod === 'UPI'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-3xl">📱</div>
            <div className="text-left flex-1">
              <p className="font-bold text-gray-900">UPI</p>
              <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
            </div>
            {paymentMethod === 'UPI' && <span className="text-2xl">✓</span>}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-red-700 text-sm font-semibold">❌ {error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-bold transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading || isProcessing}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span> Processing...
              </>
            ) : (
              <>Pay ₹{amount.toFixed(2)}</>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          🔒 Your payment is secure and encrypted
        </p>
      </div>
    </div>
  );
}
