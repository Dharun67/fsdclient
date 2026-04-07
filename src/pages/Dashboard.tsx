import { useRole } from "@/hooks/use-role";
import AdminDashboard from "./dashboards/AdminDashboard";
import SupplierDashboard from "./dashboards/SupplierDashboard";
import DistributorDashboard from "./dashboards/DistributorDashboard";
import RetailerDashboard from "./dashboards/RetailerDashboard";

export default function Dashboard() {
  const { role } = useRole();
  if (role === "admin")       return <AdminDashboard />;
  if (role === "supplier")    return <SupplierDashboard />;
  if (role === "distributor") return <DistributorDashboard />;
  return <RetailerDashboard />;
}
