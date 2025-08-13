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
          ? "bg-slate-950/80 border-slate-800/50"
          : "bg-white/80 border-gray-200/50"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <div className="hidden md:flex items-center space-x-2">
              <NavigationLinks isDarkMode={isDarkMode} />
              <AddStudentDialog />
            </div>

            <UserMenu onSignOut={handleSignOut} />
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
