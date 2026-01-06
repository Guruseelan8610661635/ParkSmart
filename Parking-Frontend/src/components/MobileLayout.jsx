import { useState, useEffect } from "react";
import BottomNav from "./BottomNav";
import { isLoggedIn } from "../utils/auth";

export default function MobileLayout({ children }) {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  // Re-check login status when localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      setLoggedIn(isLoggedIn());
    };

    // Check on route changes and storage changes
    window.addEventListener("storage", checkLoginStatus);
    const interval = setInterval(checkLoginStatus, 500);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-2">
      <div className="w-[430px] h-[800px] bg-white/95 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pt-5 pb-20 scrollbar-hide">
          {children}
        </div>

        {/* 🔒 SHOW ONLY AFTER LOGIN */}
        {loggedIn && <BottomNav />}
      </div>
    </div>
  );
}
