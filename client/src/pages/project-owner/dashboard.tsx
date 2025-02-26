import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Loader2, Users, Activity, Calendar } from "lucide-react";

export default function ProjectOwnerDashboard() {
  const { data: doctors, isLoading } = useQuery<User[]>({
    queryKey: ["/api/doctors"],
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const metrics = [
    {
      title: "Total Doctors",
      value: doctors?.length || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Active Clinics",
      value: "12", // Placeholder
      icon: Activity,
      color: "text-green-500",
    },
    {
      title: "Today's Appointments",
      value: "28", // Placeholder
      icon: Calendar,
      color: "text-purple-500",
    },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Project Owner Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {doctors?.slice(0, 5).map((doctor) => (
              <div key={doctor.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{doctor.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {doctor.specialization}
                  </p>
                </div>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  {doctor.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
