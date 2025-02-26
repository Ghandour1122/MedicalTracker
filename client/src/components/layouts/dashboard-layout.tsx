import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { UserRole } from "@shared/schema";
import { Link } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  UserPlus,
  Search,
  FileText
} from "lucide-react";
import { ClinicSelector } from "../doctor/clinic-selector";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();

  const menuItems = {
    [UserRole.PROJECT_OWNER]: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/" },
      { icon: UserPlus, label: "Manage Doctors", href: "/doctors" },
      { icon: Settings, label: "Settings", href: "/settings" },
    ],
    [UserRole.DOCTOR]: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/doctor" },
      { icon: Calendar, label: "Appointments", href: "/doctor/appointments" },
      { icon: FileText, label: "Patient Records", href: "/doctor/patients" },
    ],
    [UserRole.PATIENT]: [
      { icon: Search, label: "Find Doctor", href: "/patient" },
      { icon: Calendar, label: "My Appointments", href: "/patient/appointments" },
    ],
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-border">
        <div className="p-6">
          <h1 className="text-xl font-bold text-sidebar-foreground">Medical System</h1>
        </div>
        <nav className="px-4 py-2">
          {menuItems[user!.role].map((item) => (
            <Link key={item.href} href={item.href}>
              <a className="flex items-center gap-2 px-4 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md">
                <item.icon className="h-5 w-5" />
                {item.label}
              </a>
            </Link>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start mt-4 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-background">
        {/* Header with clinic selector for doctors */}
        {user?.role === UserRole.DOCTOR && (
          <div className="border-b border-border p-4">
            <ClinicSelector />
          </div>
        )}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}