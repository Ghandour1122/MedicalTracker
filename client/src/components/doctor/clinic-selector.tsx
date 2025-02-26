import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Clinic } from "@shared/schema";
import { ClinicForm } from "./clinic-form";
import { Loader2 } from "lucide-react";

export function ClinicSelector() {
  const { data: clinics, isLoading } = useQuery<Clinic[]>({
    queryKey: ["/api/clinics"],
  });

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  return (
    <div className="flex items-center gap-2">
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Clinic" />
        </SelectTrigger>
        <SelectContent>
          {clinics?.map((clinic) => (
            <SelectItem key={clinic.id} value={clinic.id.toString()}>
              {clinic.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ClinicForm />
    </div>
  );
}
