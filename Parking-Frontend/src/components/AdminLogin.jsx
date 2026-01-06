import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function AdminLogin({ onBack }) {
  const [step, setStep] = useState(1); // 1 = email/password, 2 = OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const navigate = useNavigate();

  // Step 1: Verify email/password and request OTP
  const handleRequestOTP = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.adminLoginRequestOTP({
        email,
        password,
      });

      if (response.requiresOTP) {
        setStep(2);
        setOtpMessage(`OTP sent to ${response.email}. Check your email or console.`);
        console.log("✅ Step 1 Complete: OTP sent to", response.email);
      }
      setLoading(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        "Invalid admin credentials";
      setError(errorMsg);
      console.error("Admin login error:", err);
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and complete login
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.adminVerifyOTP({
        email,
        otp,
      });

      if (response.role === "ADMIN" && response.token) {
        console.log("✅ Step 2 Complete: Admin logged in with 2FA");
        navigate("/admin", { replace: true });
      } else {
        setError("Invalid response from server");
      }
      setLoading(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        "Invalid or expired OTP";
      setError(errorMsg);
      console.error("OTP verification error:", err);
      setLoading(false);
    }
  };

  const handleKeyPress = (e, handler) => {
    if (e.key === "Enter") handler();
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header with Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">{step === 1 ? "🔐" : "🔑"}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 1 ? "Admin Login" : "Verify OTP"}
          </h2>
          {step === 2 && (
            <p className="text-sm text-gray-600 mt-2">Step {step} of 2</p>
          )}
        </div>

        {/* Success/Info Message */}
        {otpMessage && step === 2 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-start gap-3">
            <span className="text-lg">✅</span>
            <span className="flex-1">{otpMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Step 1: Email/Password */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                onKeyPress={(e) => handleKeyPress(e, handleRequestOTP)}
                className="w-full bg-white p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                onKeyPress={(e) => handleKeyPress(e, handleRequestOTP)}
                className="w-full bg-white p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleRequestOTP}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg mt-6 font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-digit OTP
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={loading}
                  onKeyPress={(e) => handleKeyPress(e, handleVerifyOTP)}
                  className="w-full bg-white p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-center text-2xl tracking-widest font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  maxLength={6}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  OTP valid for 5 minutes • {3 - (otp.length > 0 ? 1 : 0)} attempts remaining
                </p>
              </div>
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg mt-6 font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify & Login"
              )}
            </button>

            <button
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setOtpMessage("");
              }}
              disabled={loading}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg mt-3 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Back to Login
            </button>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={loading}
          className="w-full text-gray-600 py-3 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          ← Back
        </button>

        {/* Info Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center flex items-center justify-center gap-2">
            💡 Admin login requires 2-factor authentication via email
          </p>
        </div>
      </div>
    </div>
  );
}
