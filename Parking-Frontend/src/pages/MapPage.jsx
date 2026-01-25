import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mapService from '../services/mapService';
import RealtimeMap from '../components/RealtimeMap';

function MapPage() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [showNearby, setShowNearby] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [mapViewMode, setMapViewMode] = useState('list'); // 'list' | 'map'

  useEffect(() => {
    loadLocations();
    getUserLocation();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadLocations, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await mapService.getAllLocations();
      setLocations(Array.isArray(data) ? data : data.locations || []);
    } catch (err) {
      console.error('Error loading locations:', err);
      
      // Handle specific error codes
      if (err.response?.status === 403) {
        setError('🔐 Access Denied - Please log in again to access parking locations');
      } else if (err.response?.status === 401) {
        setError('🔑 Unauthorized - Your session has expired. Please log in again');
      } else if (err.response?.status === 404) {
        setError('📍 No locations found. Please try again later');
      } else if (err.code === 'ERR_NETWORK') {
        setError('🌐 Network error - Check your connection');
      } else {
        setError('Failed to load parking locations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          // Silently fail for geolocation - it's optional
          if (error.code === 1) {
            console.log('Location permission denied by user');
          } else if (error.code === 2) {
            console.log('Location unavailable');
          } else if (error.code === 3) {
            console.log('Location request timeout');
          }
        }
      );
    }
  };

  const handleFindNearby = async () => {
    if (!userLocation) {
      setError('📍 Location services not available. Please enable GPS or search instead.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await mapService.getNearbyLocations(
        userLocation.lat,
        userLocation.lon,
        5
      );
      setLocations(Array.isArray(data) ? data : data.locations || []);
      setShowNearby(true);
    } catch (err) {
      console.error('Error finding nearby:', err);
      
      if (err.response?.status === 403) {
        setError('🔐 Access Denied - Please log in again');
      } else if (err.response?.status === 401) {
        setError('🔑 Session expired - Please log in again');
      } else {
        setError('Failed to find nearby locations. Try searching instead.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadLocations();
      setShowNearby(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await mapService.searchLocations(searchQuery);
      setLocations(Array.isArray(data) ? data : data.results || data.locations || []);
    } catch (err) {
      console.error('Error searching:', err);
      
      if (err.response?.status === 403) {
        setError('🔐 Access Denied - Please log in again');
      } else if (err.response?.status === 401) {
        setError('🔑 Session expired - Please log in again');
      } else {
        setError('Search failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = async (location) => {
    try {
      // Store the selected location ID and name for use in other pages (e.g., Slots)
      localStorage.setItem('selectedLocationId', location.id);
      localStorage.setItem('selectedLocationName', location.name);
      const details = await mapService.getLocationDetails(location.id);
      setSelectedLocation(details);
    } catch (err) {
      setSelectedLocation(location);
    }
  };

  const handleRefreshLocation = async (locationId) => {
    try {
      setRefreshing(true);
      await mapService.refreshLocationData(locationId);
      await loadLocations();
    } catch (err) {
      setError('Failed to refresh location');
    } finally {
      setRefreshing(false);
    }
  };

  const getOccupancyColor = (occupancyPercentage) => {
    // Use neutral filler for occupancy bar to match B/W theme
    return 'bg-gray-400';
  };

  const getOccupancyBgColor = (occupancyPercentage) => {
    // Keep card backgrounds neutral and use subtle gray borders for B/W look
    return 'bg-white border-gray-100';
  };

  if (loading && locations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-semibold">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Enhanced Header */}
      <div className="bg-white px-6 py-6 shadow-md mb-5 rounded-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100">
              <span className="text-3xl">🗺️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Parking Map</h1>
              <p className="text-sm text-gray-600">Find nearby parking spots</p>
            </div>
          </div>
          <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-100">
            <button
              onClick={() => setMapViewMode('list')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition ${ mapViewMode === 'list' ? 'bg-white text-purple-600 shadow-md' : 'text-white' }`}
            >
              📋
            </button>
            <button
              onClick={() => setMapViewMode('map')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition ${ mapViewMode === 'map' ? 'bg-white text-purple-600 shadow-md' : 'text-white' }`}
            >
              🗺️
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white shadow-md"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-3 bg-white/30 hover:bg-white/50 rounded-xl transition backdrop-blur-sm shadow-md"
          >
            🔍
          </button>
        </div>
      </div>

      <div className="px-6">
        {/* Control Buttons */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <button
            onClick={handleFindNearby}
            className="bg-black hover:bg-black text-white px-4 py-3 rounded-xl transition text-sm font-bold shadow-sm flex items-center justify-center gap-2"
          >
            <span>📍</span>
            Near Me
          </button>
          <button
            onClick={() => { setShowNearby(false); loadLocations(); }}
            className="bg-white border border-gray-200 px-4 py-3 rounded-xl transition text-sm font-bold shadow-sm flex items-center justify-center gap-2"
          >
            <span>⭐</span>
            All
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 bg-white p-5 rounded-2xl shadow-sm border border-red-100">
            <p className="font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              {error}
            </p>
            <div className="flex gap-3">
              <button
                onClick={loadLocations}
                className="bg-black hover:bg-gray-900 text-white px-5 py-2 rounded-xl font-semibold transition shadow-md"
              >
                🔄 Retry
              </button>
              {error.includes('log in again') && (
                <button
                  onClick={() => navigate('/')}
                  className="bg-white border border-gray-200 text-slate-900 px-5 py-2 rounded-xl font-semibold transition shadow-md"
                >
                  🔑 Go to Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Location Count Badge */}
      <div className="mx-6 mt-4 p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm inline-block">
        <p className="text-sm font-bold text-slate-900">
          📍 {locations.length} {showNearby ? 'nearby ' : ''}location{locations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* MAP VIEW */}
      {mapViewMode === 'map' && locations.length > 0 && (
        <div className="px-6 mt-5 mb-5">
          <RealtimeMap
            locations={locations}
            userLocation={userLocation}
            onMarkerClick={(location) => {
              console.log('🗺️ Map marker clicked:', location.name);
              const token = localStorage.getItem('token');
              console.log('🔑 Token exists:', !!token);
              if (!token) {
                console.error('❌ No token found, cannot navigate');
                setError('Session expired. Please log in again.');
                return;
              }
              localStorage.setItem('selectedLocationId', location.id);
              localStorage.setItem('selectedLocationName', location.name);
              console.log('📍 Navigating to /slots with locationId:', location.id);
              navigate('/slots', { state: { locationId: location.id } });
            }}
          />
        </div>
      )}

      {/* Locations List (only in list view) */}
      {mapViewMode === 'list' && (
        <div className="px-6 py-4 space-y-4">
          {locations.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-gray-300 text-center">
              <p className="text-5xl mb-4">🏙️</p>
              <p className="text-gray-600 font-semibold">No locations found</p>
              <p className="text-gray-500 text-sm mt-1">Try a different search or location</p>
            </div>
          ) : (
            <>
              {/* Desktop List */}
              <div className="hidden md:block space-y-4">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className={`bg-white p-6 rounded-2xl border-2 shadow-md hover:shadow-lg transition cursor-pointer ${getOccupancyBgColor(
                      location.occupancyPercentage || 0
                    )}`}
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{location.name}</h3>
                        <p className="text-xs text-gray-600 mt-2">📍 {location.address}</p>
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{Math.round(location.occupancyPercentage || 0)}%</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-gray-700">Availability</span>
                        <span className="text-gray-700">{location.availableSlots}/{location.totalSlots} slots</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${getOccupancyColor(location.occupancyPercentage || 0)}`} style={{ width: `${location.occupancyPercentage || 0}%` }} />
                      </div>
                    </div>

                    {location.amenities && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-3">🎯 Amenities:</p>
                        <div className="flex flex-wrap gap-3">
                          {location.amenities.split(',').map((amenity, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-slate-700 px-3 py-1.5 rounded-full font-semibold border border-gray-200">{amenity.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-gray-600 mb-4 pb-4 border-t border-gray-200">
                      <span>⏰ {location.operatingHours}</span>
                      {location.distance && <span className="text-slate-900 font-semibold">📏 {location.distance.toFixed(2)} km away</span>}
                    </div>

                    <div className="flex gap-3">
                      <button onClick={(e) => { e.stopPropagation(); handleRefreshLocation(location.id); }} disabled={refreshing} className="flex-1 px-3 py-2 bg-black hover:bg-gray-900 text-white text-xs font-bold rounded-lg transition disabled:opacity-50">{refreshing ? '⏳ Refreshing...' : '🔄 Refresh'}</button>
                      <button onClick={(e) => { e.stopPropagation(); localStorage.setItem('selectedLocationId', location.id); localStorage.setItem('selectedLocationName', location.name); navigate('/slots', { state: { locationId: location.id } }); }} className="flex-1 px-3 py-2 bg-black hover:bg-black text-white text-xs font-bold rounded-lg transition">🅿️ View Slots</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile List */}
              <div className="md:hidden space-y-3">
                {locations.map((location) => (
                  <div key={location.id} className="bg-white rounded-xl p-4 border border-black/10 shadow-md">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-900">{location.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">📍 {location.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{Math.round(location.occupancyPercentage || 0)}%</p>
                        <p className="text-xs text-gray-500 mt-1">{location.availableSlots}/{location.totalSlots}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleRefreshLocation(location.id); }} className="flex-1 px-3 py-2 bg-white border border-black text-black rounded-lg">Refresh</button>
                      <button onClick={(e) => { e.stopPropagation(); localStorage.setItem('selectedLocationId', location.id); localStorage.setItem('selectedLocationName', location.name); navigate('/slots', { state: { locationId: location.id } }); }} className="flex-1 px-3 py-2 bg-black text-white rounded-lg">View Slots</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mx-6 mt-6 p-4 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
                <p className="text-xs font-bold text-gray-900 mb-3">📊 Occupancy Legend:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <span className="text-xs text-gray-700 font-semibold">&lt; 30% - Available (Good)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-gray-700 font-semibold">30-70% - Medium (Moderate)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <span className="text-xs text-gray-700 font-semibold">&gt; 70% - Almost Full</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Location Details Panel */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedLocation(null)}
              className="float-right text-2xl text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Location Details */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLocation.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{selectedLocation.address}</p>

            {/* Key Info */}
            <div className="bg-gray-50 p-4 rounded-xl mb-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Available Slots</span>
                <span className="text-lg font-bold text-green-600">
                  {selectedLocation.availableSlots}/{selectedLocation.totalSlots}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Occupancy</span>
                <span className={`text-lg font-bold ${
                  selectedLocation.occupancyPercentage < 30 ? 'text-green-600' :
                  selectedLocation.occupancyPercentage < 70 ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {Math.round(selectedLocation.occupancyPercentage || 0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Operating Hours</span>
                <span className="text-gray-900 font-semibold">{selectedLocation.operatingHours}</span>
              </div>
            </div>

            {/* Amenities */}
            {selectedLocation.amenities && (
              <div className="mb-4">
                <p className="font-bold text-gray-900 mb-2">🎯 Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.amenities.split(',').map((amenity, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-slate-700 px-3 py-1 rounded-full font-semibold border border-gray-200"
                    >
                      {amenity.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={() => {
                setSelectedLocation(null);
                navigate('/slots', { state: { locationId: selectedLocation.id } });
              }}
              className="w-full py-3 bg-black text-white font-bold rounded-lg hover:shadow-md transition"
            >
              🅿️ View Available Slots
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapPage;
