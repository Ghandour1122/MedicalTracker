import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Appointment, Clinic } from "@shared/schema";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, Users, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function DoctorDashboard() {
  const { data: appointments, isLoading: loadingAppointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments/doctor"],
  });

  const { data: clinics, isLoading: loadingClinics } = useQuery<Clinic[]>({
    queryKey: ["/api/clinics"],
  });

  if (loadingAppointments || loadingClinics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const todayAppointments = appointments?.filter(
    (apt) => format(new Date(apt.datetime), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {todayAppointments?.length === 0 ? (
                <p className="text-muted-foreground">No appointments today</p>
              ) : (
                <div className="space-y-4">
                  {todayAppointments?.map((apt) => (
                    <div key={apt.id} className="flex items-center gap-4 p-4 bg-accent/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">
                          {format(new Date(apt.datetime), "h:mm a")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {apt.reason || "Regular checkup"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Clinics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinics?.map((clinic) => (
                  <div key={clinic.id} className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{clinic.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {clinic.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={new Date()}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
