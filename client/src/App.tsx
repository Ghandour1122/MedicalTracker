import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import ProjectOwnerDashboard from "./pages/project-owner/dashboard";
import DoctorDashboard from "./pages/doctor/dashboard";
import PatientSearch from "./pages/patient/search";
import { UserRole } from "@shared/schema";

function RoleBasedRoute({ 
  role, 
  path, 
  component: Component 
}: { 
  role: typeof UserRole[keyof typeof UserRole]; 
  path: string; 
  component: React.ComponentType 
}) {
  return (
    <Route path={path}>
      {() => {
        const { user } = useAuth();
        if (!user) {
          return <Redirect to="/auth" />;
        }
        if (user.role !== role) {
          return <Redirect to="/" />;
        }
        return <Component />;
      }}
    </Route>
  );
}

function Router() {
  return (
    <Switch>
      <RoleBasedRoute path="/" role={UserRole.PROJECT_OWNER} component={ProjectOwnerDashboard} />
      <RoleBasedRoute path="/doctor" role={UserRole.DOCTOR} component={DoctorDashboard} />
      <RoleBasedRoute path="/patient" role={UserRole.PATIENT} component={PatientSearch} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;