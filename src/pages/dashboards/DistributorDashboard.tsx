import { Package, Truck, ClipboardList, CheckCircle, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useRole } from "@/hooks/use-role";
import ReportDownloadButton from "@/components/ReportDownloadButton";

const weeklyFlow = [
  { day: "Mon", received: 4, dispatched: 3 }, { day: "Tue", received: 6, dispatched: 5 },
  { day: "Wed", received: 3, dispatched: 4 }, { day: "Thu", received: 8, dispatched: 6 },
  { day: "Fri", received: 5, dispatched: 7 }, { day: "Sat", received: 2, dispatched: 2 },
];

const fromSuppliers = [
  { id: "ORD-S-101", supplier: "Priya Textiles",  product: "Cotton Fabric x100m", status: "delivered", eta: "2026-07-10" },
  { id: "ORD-S-102", supplier: "Erode Mills",      product: "Polyester Roll x50m", status: "shipped",   eta: "2026-07-24" },
  { id: "ORD-S-103", supplier: "Kanchipuram Co",   product: "Silk Saree x20",      status: "processing",eta: "2026-07-26" },
];

const toRetailers = [
  { id: "SHP-TN-041", retailer: "Chennai Store", product: "Cotton Fabric x50m", status: "delivered" },
  { id: "SHP-TN-042", retailer: "Tirupur Shop",  product: "Silk Saree x10",     status: "shipped" },
  { id: "SHP-TN-043", retailer: "Vellore Mart",  product: "Linen Shirt x30",    status: "packed" },
];

export default function DistributorDashboard() {
  const { user } = useRole();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Distributor Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.name} — Distribution overview</p>
        </div>
        <ReportDownloadButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Warehouse Stock"      value="1,840" change="3 items low"      changeType="negative" icon={Package} />
        <StatCard title="Orders from Suppliers" value="6"    change="2 in transit"     changeType="neutral"  icon={ClipboardList} iconColor="text-info" />
        <StatCard title="Shipments to Retailers" value="9"   change="3 pending"        changeType="neutral"  icon={Truck} iconColor="text-warning" />
        <StatCard title="Delivered This Week"   value="14"   change="+4 vs last week"  changeType="positive" icon={CheckCircle} iconColor="text-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold mb-4">Weekly Flow (Received vs Dispatched)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend />
              <Bar dataKey="received"   fill="#6366f1" radius={[4, 4, 0, 0]} name="Received" />
              <Bar dataKey="dispatched" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Dispatched" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold mb-4">Orders from Suppliers</h3>
          <div className="space-y-3">
            {fromSuppliers.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <p className="text-sm font-semibold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.product} · {o.supplier} · ETA: {o.eta}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-lg p-5">
        <h3 className="font-semibold mb-4">Shipments to Retailers</h3>
        <div className="space-y-3">
          {toRetailers.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{s.id}</p>
                  <p className="text-xs text-muted-foreground">{s.product} → {s.retailer}</p>
                </div>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
