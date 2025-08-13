import React, { useState } from "react";
import { User, LogOut, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getButtonClasses } from "@/lib/styles";

interface UserMenuProps {
  onSignOut: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onSignOut }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();

  const handleSignOut = () => {
    onSignOut();
    setIsUserMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className={getButtonClasses(isDarkMode, "ghost")}
      >
        <User size={20} />
      </button>

      {/* Dropdown Menu */}
      {isUserMenuOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-lg border z-50 ${
            isDarkMode
              ? "bg-slate-900/95 border-slate-700/50 backdrop-blur-xl"
              : "bg-white/95 border-gray-200/50 backdrop-blur-xl"
          }`}
        >
          <div className="py-2">
            {user ? (
              <>
                <div
                  className={`px-4 py-3 border-b ${
                    isDarkMode ? "border-slate-700/50" : "border-gray-200/50"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-slate-200" : "text-gray-800"
                    }`}
                  >
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className={`w-full flex items-center px-4 py-3 text-sm transition-colors ${
                    isDarkMode
                      ? "text-slate-300 hover:bg-slate-800/50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <LogOut size={16} className="mr-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className={`flex items-center px-4 py-3 text-sm transition-colors ${
                    isDarkMode
                      ? "text-slate-300 hover:bg-slate-800/50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <UserCircle size={16} className="mr-3" />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`flex items-center px-4 py-3 text-sm transition-colors ${
                    isDarkMode
                      ? "text-slate-300 hover:bg-slate-800/50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <UserCircle size={16} className="mr-3" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </div>
  );
};
