import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { NavigationLinks } from "./NavigationLinks";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";

const TopNavbar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDarkMode } = useDarkMode();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
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
          ? "bg-slate-950/95 border-slate-800/50 shadow-lg shadow-slate-900/20"
          : "bg-white/95 border-gray-200/50 shadow-lg shadow-gray-200/20"
      }`}
    >
      {/* Top header with logo and user menu */}
      <div className="container mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="flex items-center space-x-3 lg:space-x-4">
            <ThemeToggle />
            <AddStudentDialog />
            <UserMenu onSignOut={handleSignOut} />
            <MobileMenu />
          </div>
        </div>
      </div>

      {/* Navigation bar with rounded background */}
      <div className="container mx-auto px-4 lg:px-6 pb-4">
        <div
          className={`rounded-xl px-4 lg:px-6 py-3 shadow-sm ${
            isDarkMode
              ? "bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm"
              : "bg-gray-100/90 border border-gray-200/50 backdrop-blur-sm"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <NavigationLinks isDarkMode={isDarkMode} />
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
