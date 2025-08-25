import React from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  BarChart3,
  Users,
  Calendar,
  BookOpen,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useDarkMode } from "@/contexts/DarkModeContext";

export const MobileMenu: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  const navItems = [
    { to: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { to: "/manage", icon: Users, label: "Manage" },
    { to: "/calendar", icon: Calendar, label: "Calendar" },
    { to: "/cp-sheet", icon: BookOpen, label: "CP Sheet" },
    { to: "/explore", icon: Target, label: "Explore" },
  ];

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className={isDarkMode ? "bg-slate-900" : "bg-white"}
        >
          <nav className="flex flex-col space-y-2 mt-8">
            {navItems.map((item) => (
              <SheetClose key={item.to} asChild>
                <NavLink
                  to={item.to}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isDarkMode
                      ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-lg font-medium">{item.label}</span>
                </NavLink>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};
