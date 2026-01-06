import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileLayout from "./components/MobileLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Profile from "./pages/Profile";
import MapPage from "./pages/MapPage";
import Slots from "./pages/Slots";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <MobileLayout>
        <Routes>
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

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MobileLayout>
    </BrowserRouter>
  );
}
