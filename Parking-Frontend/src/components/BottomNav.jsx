import { NavLink, useLocation } from "react-router-dom";

export default function BottomNav() {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  
  // Admin-specific tabs
  const adminTabs = [
    { id: "profile", label: "Profile", icon: "👤", onclick: "admin-tab" },
    { id: "dashboard", label: "Dashboard", icon: "📊", onclick: "admin-tab" },
    { id: "slots", label: "Manage Slots", icon: "🅿️", onclick: "admin-tab" },
    { id: "locations", label: "Manage Locations", icon: "📍", onclick: "admin-tab" },
    { id: "bookings", label: "Bookings", icon: "📅", onclick: "admin-tab" },
  ];

  // Regular user tabs
  const userTabs = [
    { to: "/", label: "Profile", icon: "👤" },
    { to: "/map", label: "Map", icon: "🗺️" },
    { to: "/slots", label: "Slots", icon: "🅿️" },
    { to: "/bookings", label: "Bookings", icon: "📄" },
    ...(role === "ADMIN" ? [{ to: "/admin", label: "Admin", icon: "⚙️" }] : []),
    { to: "/payments", label: "Pay", icon: "💳" },
  ];

  const tabs = role === "ADMIN" && isAdminPage ? adminTabs : userTabs;

  return (
    <div className="h-16 border-t flex justify-around items-center bg-white">
      {tabs.map(tab => {
        if (tab.onclick === "admin-tab") {
          // Admin tab button (Dashboard, Slots, Bookings)
          return (
            <button
              key={tab.id}
              onClick={() => {
                const event = new CustomEvent("adminTabChange", { detail: { tab: tab.id } });
                window.dispatchEvent(event);
              }}
              className="flex flex-col items-center text-xs text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          );
        }
        
        // Regular NavLink (Profile, Map, etc.)
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-blue-600" : "text-gray-400"
              }`
            }
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </NavLink>
        );
      })}
    </div>
  );
}
