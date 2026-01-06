import { useState } from "react";
import { authService } from "../services/authService";

export default function UserRegister({ onBack }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!form.name || !form.email || !form.password || !form.phone) {
      setError("Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.register(form);
      setSuccess(true);
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(errorMsg);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header with Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">✍️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-start gap-3 animate-fade-in">
            <span className="text-lg">⚠️</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm flex items-start gap-3 animate-fade-in">
            <span className="text-lg">✅</span>
            <span className="flex-1">Registration successful! Redirecting to login...</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl shadow-sm border border-blue-200 mb-6">
          <div className="space-y-4">
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
              className="w-full bg-white p-4 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
              className="w-full bg-white p-4 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <input
              type="tel"
              placeholder="Phone Number (+1234567890)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={loading}
              className="w-full bg-white p-4 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
              onKeyPress={(e) => e.key === "Enter" && handleRegister()}
              className="w-full bg-white p-4 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl mt-6 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registering...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                ✍️ Create Account
              </span>
            )}
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={loading}
          className="w-full text-gray-600 py-3 rounded-xl hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
