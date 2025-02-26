import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Loader2, Search, Calendar, Star } from "lucide-react";
import { useState } from "react";

export default function PatientSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: doctors, isLoading } = useQuery<User[]>({
    queryKey: ["/api/doctors/search"],
  });

  const filteredDoctors = doctors?.filter(doctor => 
    doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Find a Doctor</h1>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            className="pl-10"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDoctors?.map((doctor) => (
              <Card key={doctor.id}>
                <CardContent className="flex items-start gap-6 p-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {doctor.fullName}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {doctor.specialization}
                    </p>
                    <p className="text-sm mb-4">{doctor.bio}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>4.8/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Available Today</span>
                      </div>
                    </div>
                  </div>
                  <Button>
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
