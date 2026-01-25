import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileLayout from "./components/MobileLayout";
import AdminWebLayout from "./components/AdminWebLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Profile from "./pages/Profile";
import MapPage from "./pages/MapPage";
import Slots from "./pages/Slots";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageLocations from "./pages/admin/ManageLocations";
import Reports from "./pages/admin/Reports";
import AdminProfile from "./pages/admin/AdminProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mobile/User routes */}
        <Route element={<MobileLayout />}>
          <Route path="/" element={<Profile />} />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/slots"
            element={
              <ProtectedRoute>
                <Slots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin routes (desktop layout) */}
        <Route element={<AdminWebLayout />}>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/slots"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/locations"
            element={
              <ProtectedRoute>
                <ManageLocations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
