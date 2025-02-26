import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Clock,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: appointments } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: doctors } = useQuery({
    queryKey: ["/api/doctors"],
    enabled: user?.role === "owner",
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {user?.role === "owner" && (
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Total Doctors</p>
                  <p className="text-2xl font-bold">{doctors?.length ?? 0}</p>
                </div>
              </div>
            </Card>
          )}

          {(user?.role === "doctor" || user?.role === "patient") && (
            <>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Appointments</p>
                    <p className="text-2xl font-bold">{appointments?.length ?? 0}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Upcoming</p>
                    <p className="text-2xl font-bold">
                      {appointments?.filter((apt: any) => 
                        new Date(apt.date) > new Date()
                      ).length ?? 0}
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
