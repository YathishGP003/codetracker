import React, { useState } from "react";
import { User, LogOut, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getCodeforcesProfilePicture } from "@/lib/codeforces";
import ProfileAvatar from "@/components/ui/ProfileAvatar";

interface UserMenuProps {
  onSignOut: () => void;
  codeforcesHandle?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onSignOut,
  codeforcesHandle,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();

  const handleSignOut = () => {
    onSignOut();
    setIsUserMenuOpen(false);
  };

  // Get profile picture URL. Only use Codeforces avatar; otherwise fall back to icon.
  const getProfilePicture = () => {
    if (codeforcesHandle) {
      return getCodeforcesProfilePicture(codeforcesHandle);
    }
    return undefined;
  };

  const profilePic = getProfilePicture();

  return (
    <div className="relative">
      <ProfileAvatar
        size={40}
        imageUrl={profilePic}
        alt={user?.email || "Profile"}
        className="cursor-pointer outline-none"
        variant="solid"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      />

      {/* Dropdown Menu */}
      {isUserMenuOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-lg border z-50 ${
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
                  <div className="flex items-center space-x-3">
                    <ProfileAvatar
                      size={40}
                      imageUrl={profilePic}
                      alt={user?.email || "Profile"}
                      variant="solid"
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-slate-200" : "text-gray-800"
                        }`}
                      >
                        {user.email}
                      </p>
                      {codeforcesHandle && (
                        <p className="text-xs text-blue-400">
                          @{codeforcesHandle}
                        </p>
                      )}
                    </div>
                  </div>
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
