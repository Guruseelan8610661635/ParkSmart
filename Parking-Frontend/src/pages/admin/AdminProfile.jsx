import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { logout } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function AdminProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const profile = await authService.getProfile();
            setUser(profile);
        } catch (err) {
            console.error('Error fetching profile:', err);
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
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-gray-500">Failed to load profile</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Profile Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-4xl text-white">👤</span>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-600 mt-1">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.role === 'ADMIN'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}>
                                    {user.role || 'USER'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">📋 Personal Information</h2>
                        <p className="text-sm text-gray-500">Your account details and information</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-gray-900 font-medium">{user.name}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-gray-900 font-medium">{user.email}</p>
                                </div>
                            </div>

                            {user.phone && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <p className="text-gray-900 font-medium">{user.phone}</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">User ID</label>
                                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-gray-900 font-medium font-mono">{user.id}</p>
                                </div>
                            </div>

                            {user.createdAt && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Member Since</label>
                                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <p className="text-gray-900 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Account Role</label>
                                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-gray-900 font-medium">{user.role || 'USER'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Actions Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">⚙️ Account Actions</h2>
                        <p className="text-sm text-gray-500">Manage your account settings</p>
                    </div>
                    <div className="p-6">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <span>🚪</span>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Logout Confirmation Modal */}
                {showLogoutConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">🚪 Confirm Logout</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                Are you sure you want to logout? You'll need to login again to access your account.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
