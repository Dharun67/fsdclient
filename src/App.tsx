import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard  from "@/pages/Dashboard";
import Profile    from "@/pages/Profile";
import Login      from "@/pages/Login";
import NotFound   from "@/pages/NotFound";
import AIChatBot  from "@/components/AIChatBot";

// Retailer pages
import RetailerOrders    from "@/pages/retailer/RetailerOrders";
import RetailerInventory from "@/pages/retailer/RetailerInventory";
import RetailerSales     from "@/pages/retailer/RetailerSales";
import RetailerTrack     from "@/pages/retailer/RetailerTrack";

// Distributor pages
import DistributorOrders    from "@/pages/distributor/DistributorOrders";
import DistributorInventory from "@/pages/distributor/DistributorInventory";
import DistributorShipments from "@/pages/distributor/DistributorShipments";
import DistributorReturns   from "@/pages/distributor/DistributorReturns";

const queryClient = new QueryClient();

function isLoggedIn(): boolean {
  try {
    const token = localStorage.getItem("cf_token");
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (Date.now() / 1000 > payload.exp) {
      localStorage.removeItem("cf_token");
      localStorage.removeItem("cf_user");
      return false;
    }
    return true;
  } catch { return false; }
}

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
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
      <AIChatBot />
    </AuthGuard>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />

          {/* Common */}
          <Route path="/"        element={<Protected><Dashboard /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />

          {/* Retailer */}
          <Route path="/retail/orders"    element={<Protected><RetailerOrders /></Protected>} />
          <Route path="/retail/inventory" element={<Protected><RetailerInventory /></Protected>} />
          <Route path="/retail/sales"     element={<Protected><RetailerSales /></Protected>} />
          <Route path="/retail/track"     element={<Protected><RetailerTrack /></Protected>} />

          {/* Distributor */}
          <Route path="/dist/orders"    element={<Protected><DistributorOrders /></Protected>} />
          <Route path="/dist/inventory" element={<Protected><DistributorInventory /></Protected>} />
          <Route path="/dist/shipments" element={<Protected><DistributorShipments /></Protected>} />
          <Route path="/dist/returns"   element={<Protected><DistributorReturns /></Protected>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
