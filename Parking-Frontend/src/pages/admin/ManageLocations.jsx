import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocationFormInline from "../../components/admin/LocationFormInline";

export default function ManageLocations() {
    const navigate = useNavigate();
    const BACKEND_URL = "http://localhost:8080";
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/locations`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setLocations(res.data || []);
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this location?")) return;

        try {
            await axios.delete(`${BACKEND_URL}/api/locations/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchLocations();
        } catch (error) {
            console.error("Error deleting location:", error);
            alert("Failed to delete location");
        }
    };

    const handleEdit = (location) => {
        setEditingLocation(location);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingLocation(null);
        fetchLocations();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="text-5xl mb-3">⏳</div>
                    <p className="text-gray-500">Loading locations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
            <div className="max-w-6xl mx-auto space-y-5">
                {/* Add Button - Emerald Green */}
                <button
                    onClick={() => {
                        setEditingLocation(null);
                        setShowForm(true);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                    <span className="text-xl">+</span>
                    <span>Add New Location</span>
                </button>

                {/* Form Modal */}
                {showForm && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                        <LocationFormInline
                            location={editingLocation}
                            onSubmit={async (locationId, formData) => {
                                const url = locationId
                                    ? `${BACKEND_URL}/api/locations/${locationId}`
                                    : `${BACKEND_URL}/api/locations`;
                                const method = locationId ? 'put' : 'post';

                                await axios[method](url, formData, {
                                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                                });

                                handleFormSuccess();
                            }}
                            onClose={() => {
                                setShowForm(false);
                                setEditingLocation(null);
                            }}
                        />
                    </div>
                )}

                {/* Locations Grid */}
                {locations.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {locations.map((location) => (
                            <div
                                key={location.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
                            >
                                {/* White Header */}
                                <div className="bg-white px-6 py-6 border-b border-gray-200">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">📍</span>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2 text-gray-900">{location.name}</h3>
                                            <p className="text-sm text-gray-600 flex items-start gap-2">
                                                <span>📍</span>
                                                <span>{location.address || "No address provided"}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* White Body with Stats */}
                                <div className="p-6 bg-white">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        {/* Total Slots */}
                                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                                                    <span className="text-lg">🅿️</span>
                                                </div>
                                                <span className="text-3xl font-bold text-blue-600">
                                                    {location.totalSlots || 0}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 font-medium uppercase">Total Slots</p>
                                        </div>

                                        {/* Has Slots */}
                                        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                                                    <span className="text-lg">⚠️</span>
                                                </div>
                                                <span className="text-3xl font-bold text-amber-600">
                                                    {location.hasSlots || 0}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 font-medium uppercase">Has Slots</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons - White Theme */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => handleEdit(location)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span>✏️</span>
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => navigate('/admin/slots', { state: { selectedLocationId: location.id } })}
                                            className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span>👁️</span>
                                            <span>View Slots</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(location.id)}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center"
                                        >
                                            <span>🗑️</span>
                                            <span className="hidden sm:inline">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">📍</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Locations Yet</h3>
                        <p className="text-gray-500 mb-6">Get started by adding your first parking location</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors shadow-sm hover:shadow-md"
                        >
                            + Add Your First Location
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
