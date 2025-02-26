import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  UserPlus,
  Calendar,
  LogOut,
  Users,
} from "lucide-react";

export function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const menuItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      roles: ["owner", "doctor", "patient"],
    },
    {
      title: "Doctors",
      href: "/doctors",
      icon: Users,
      roles: ["owner"],
    },
    {
      title: "Book Appointment",
      href: "/book",
      icon: Calendar,
      roles: ["patient"],
    },
  ].filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-sidebar-foreground">
          Medical System
        </h2>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  location === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
