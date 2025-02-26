import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string; 
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Form Section */}
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{title || "Medical Management System"}</CardTitle>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>

      {/* Hero Section */}
      <div className="hidden md:flex items-center justify-center bg-primary p-8">
        <div className="text-white max-w-lg space-y-6">
          <h1 className="text-4xl font-bold">
            Welcome to Medical Management System
          </h1>
          <p className="text-lg opacity-90">
            A comprehensive platform for managing medical practices, appointments, and patient records.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">For Doctors</h3>
              <p className="text-sm opacity-90">
                Manage your practice, appointments, and patient records efficiently.
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">For Patients</h3>
              <p className="text-sm opacity-90">
                Book appointments and access your medical history with ease.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-6">
            <svg 
              className="h-8 w-8 text-white opacity-90"
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            <div>
              <h3 className="font-semibold">Trusted Healthcare Platform</h3>
              <p className="text-sm opacity-90">
                Join thousands of healthcare professionals and patients
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
