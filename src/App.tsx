import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Shipments from "@/pages/Shipments";
import Inventory from "@/pages/Inventory";
import Orders    from "@/pages/Orders";
import Profile   from "@/pages/Profile";
import Login     from "@/pages/Login";
import NotFound  from "@/pages/NotFound";

const queryClient = new QueryClient();

/* ── Token helpers ──────────────────────────────────────── */
function isLoggedIn(): boolean {
  try {
    const token = localStorage.getItem("cf_token");
    if (!token) return false;
    const { exp } = JSON.parse(atob(token));
    if (Date.now() > exp) {
      localStorage.removeItem("cf_token");
      localStorage.removeItem("cf_user");
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/* ── Guards ─────────────────────────────────────────────── */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!isLoggedIn()) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

function GuestGuard({ children }: { children: React.ReactNode }) {
  if (isLoggedIn()) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function Protected({ children }: { children: React.ReactNode }) {
  return <AuthGuard><AppLayout>{children}</AppLayout></AuthGuard>;
}

/* ── App ────────────────────────────────────────────────── */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
          <Route path="/"          element={<Protected><Dashboard /></Protected>} />
          <Route path="/shipments" element={<Protected><Shipments /></Protected>} />
          <Route path="/inventory" element={<Protected><Inventory /></Protected>} />
          <Route path="/orders"    element={<Protected><Orders /></Protected>} />
          <Route path="/profile"   element={<Protected><Profile /></Protected>} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
