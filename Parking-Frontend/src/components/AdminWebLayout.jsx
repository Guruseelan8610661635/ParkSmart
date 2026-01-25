import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function AdminWebLayout({ children }) {
  const location = useLocation();

  const NavItem = ({ to, label, icon }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${isActive
          ? "bg-slate-700 text-white"
          : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 admin-theme">
      {/* Sidebar - Fixed/Sticky */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 bottom-0 z-30">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">ParkEase</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable if needed */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
            Main Menu
          </h3>
          <nav className="space-y-1">
            <NavItem to="/admin" label="Dashboard" icon="📊" />
            <NavItem to="/admin/locations" label="Manage Locations" icon="📍" />
            <NavItem to="/admin/slots" label="Parking Slots" icon="🅿️" />
            <NavItem to="/admin/bookings" label="Bookings" icon="📅" />
            <NavItem to="/admin/reports" label="Reports" icon="📈" />
            <NavItem to="/admin/users" label="Users" icon="👥" />
          </nav>
          <div className="pt-4">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Settings</p>
            <NavItem to="/admin/profile" label="Profile" icon="⚙️" />
          </div>
        </nav>

        {/* User Section - Always visible at bottom */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@parkease.com</p>
            </div>
          </div>
        </div>
      </aside>
    
      {/* Main Content - Offset by sidebar width */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {location.pathname.startsWith("/admin/reports") && "Analytics & Reports" ||
                  location.pathname.startsWith("/admin/slots") && "Parking Slot Management" ||
                  location.pathname.startsWith("/admin/bookings") && "Booking Management" ||
                  location.pathname.startsWith("/admin/locations") && "Location Management" ||
                  location.pathname.startsWith("/admin/users") && "User Management" ||
                  location.pathname.startsWith("/admin/profile") && "Profile Settings" ||
                  "Dashboard Overview"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Welcome back, here's what's happening today</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                🔔
              </button>
              <button className="px-4 py-2 text-sm bg-slate-700 text-white hover:bg-slate-800 rounded-lg transition-colors font-medium">
                + New Booking
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
