import { Package, ClipboardList, Truck, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useRole } from "@/hooks/use-role";
import ReportDownloadButton from "@/components/ReportDownloadButton";

const monthlySales = [
  { month: "Jan", orders: 12 }, { month: "Feb", orders: 18 },
  { month: "Mar", orders: 15 }, { month: "Apr", orders: 22 },
  { month: "May", orders: 28 }, { month: "Jun", orders: 20 },
];

const incomingOrders = [
  { id: "ORD-2041", from: "KovaiDist", items: 5, total: "₹42,000", status: "pending" },
  { id: "ORD-2042", from: "MaduraiDist", items: 3, total: "₹18,500", status: "processing" },
  { id: "ORD-2043", from: "SalemDist", items: 8, total: "₹67,200", status: "shipped" },
];

const lowStock = [
  { name: "Cotton Fabric", sku: "CF-001", qty: 45, threshold: 100 },
  { name: "Silk Thread", sku: "ST-004", qty: 12, threshold: 50 },
];

const myShipments = [
  { id: "SHP-TN-041", to: "KovaiDist, Coimbatore", status: "shipped", eta: "2026-07-20" },
  { id: "SHP-TN-042", to: "MaduraiDist, Madurai", status: "packed", eta: "2026-07-22" },
  { id: "SHP-TN-043", to: "SalemDist, Salem", status: "delivered", eta: "2026-07-18" },
];

export default function SupplierDashboard() {
  const { user } = useRole();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Supplier Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.name} — {user?.company || "Your Company"}</p>
        </div>
        <ReportDownloadButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Products"     value="24"  change="3 low stock"     changeType="negative" icon={Package} />
        <StatCard title="Incoming Orders" value="8"   change="2 need action"   changeType="neutral"  icon={ClipboardList} iconColor="text-warning" />
        <StatCard title="Active Shipments" value="5"  change="1 delayed"       changeType="negative" icon={Truck} iconColor="text-info" />
        <StatCard title="Revenue (Jun)"   value="₹2.1L" change="+14% vs May"  changeType="positive" icon={TrendingUp} iconColor="text-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Incoming Orders</h3>
            <span className="text-xs text-muted-foreground">From distributors</span>
          </div>
          <div className="space-y-3">
            {incomingOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <p className="text-sm font-semibold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.from} · {o.items} items · {o.total}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={o.status} />
                  {o.status === "pending" && (
                    <div className="flex gap-1">
                      <button className="text-[10px] px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold">Accept</button>
                      <button className="text-[10px] px-2 py-1 rounded bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-semibold">Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {lowStock.map((item) => (
              <div key={item.sku} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className="text-xs text-amber-600 font-semibold">{item.qty} left</span>
                </div>
                <div className="w-full bg-amber-200 dark:bg-amber-900/40 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(item.qty / item.threshold) * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">SKU: {item.sku} · Threshold: {item.threshold}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold mb-4">My Shipments</h3>
          <div className="space-y-3">
            {myShipments.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <p className="text-sm font-semibold">{s.id}</p>
                  <p className="text-xs text-muted-foreground">{s.to} · ETA: {s.eta}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
