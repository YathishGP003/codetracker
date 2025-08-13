import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export const MobileMenu: React.FC = () => {
  return (
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
  );
};
