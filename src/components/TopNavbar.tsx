import React, { useState } from "react";
import {
  Moon,
  Sun,
  Settings,
  User,
  LogOut,
  UserCircle,
  Calendar,
  Menu,
} from "lucide-react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const TopNavbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
      setIsUserMenuOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-950/80 border-slate-800/50"
          : "bg-white/80 border-gray-200/50"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="CodeTracker Pro Logo"
              className="w-10 h-10"
            />
            <div>
              <h1
                className={`text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent`}
              >
                CodeTracker Pro
              </h1>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Management System
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-3 rounded-2xl flex items-center space-x-2 transition-all duration-300 hover:scale-105",
                      isActive
                        ? isDarkMode
                          ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        : isDarkMode
                        ? "text-slate-300"
                        : "text-gray-700"
                    )
                  }
                >
                  <span className="font-medium">Dashboard</span>
                </NavLink>
                <NavLink
                  to="/manage"
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-3 rounded-2xl flex items-center space-x-2 transition-all duration-300 hover:scale-105",
                      isActive
                        ? isDarkMode
                          ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        : isDarkMode
                        ? "text-slate-300"
                        : "text-gray-700"
                    )
                  }
                >
                  <Settings size={18} />
                  <span className="font-medium">Manage</span>
                </NavLink>
                <NavLink
                  to="/calendar"
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-3 rounded-2xl flex items-center space-x-2 transition-all duration-300 hover:scale-105",
                      isActive
                        ? isDarkMode
                          ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        : isDarkMode
                        ? "text-slate-300"
                        : "text-gray-700"
                    )
                  }
                >
                  <Calendar size={18} />
                  <span className="font-medium">Calendar</span>
                </NavLink>
                <NavLink
                  to="/cp-sheet"
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-3 rounded-2xl flex items-center space-x-2 transition-all duration-300 hover:scale-105",
                      isActive
                        ? isDarkMode
                          ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        : isDarkMode
                        ? "text-slate-300"
                        : "text-gray-700"
                    )
                  }
                >
                  <span className="font-medium">CP Sheet</span>
                </NavLink>
                <AddStudentDialog />
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
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
                            isDarkMode
                              ? "border-slate-700/50"
                              : "border-gray-200/50"
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
            </div>

            {/* Mobile Menu */}
            {user && (
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu size={24} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <nav className="flex flex-col space-y-4 mt-8">
                      <SheetClose asChild>
                        <NavLink to="/dashboard" className="text-lg">
                          Dashboard
                        </NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/manage" className="text-lg">
                          Manage
                        </NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/calendar" className="text-lg">
                          Calendar
                        </NavLink>
                      </SheetClose>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default TopNavbar;
