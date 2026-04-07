import { ShoppingBag, Truck, ClipboardList, CheckCircle, AlertTriangle, Package } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useRole } from "@/hooks/use-role";

const weeklySales = [
  { day: "Mon", sales: 4500 }, { day: "Tue", sales: 5600 },
  { day: "Wed", sales: 2800 }, { day: "Thu", sales: 7200 },
  { day: "Fri", sales: 3400 }, { day: "Sat", sales: 9100 },
];

const myOrders = [
  { id: "ORD-R-201", product: "Cotton Fabric x10m", distributor: "KovaiDist",   total: "₹4,500",  status: "delivered" },
  { id: "ORD-R-202", product: "Silk Saree x5",      distributor: "MaduraiDist", total: "₹14,000", status: "shipped" },
  { id: "ORD-R-203", product: "Linen Shirt x20",    distributor: "KovaiDist",   total: "₹13,600", status: "processing" },
];

const stockAlerts = [
  { name: "Silk Saree",  sku: "SS-002", qty: 18,  threshold: 50 },
  { name: "Linen Shirt", sku: "LS-003", qty: 0,   threshold: 30 },
];

const tracking = [
  { id: "SHP-TN-088", product: "Silk Saree x5",   from: "MaduraiDist", status: "shipped", eta: "2026-07-22" },
  { id: "SHP-TN-089", product: "Linen Shirt x20", from: "KovaiDist",   status: "packed",  eta: "2026-07-24" },
];

export default function RetailerDashboard() {
  const { user } = useRole();
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Retailer Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.name} — {user?.company || "Your Store"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Orders"    value="12"    change="2 pending"          changeType="neutral"  icon={ClipboardList} />
        <StatCard title="In Transit"   value="3"     change="ETA this week"      changeType="positive" icon={Truck} iconColor="text-info" />
        <StatCard title="Delivered"    value="8"     change="This month"         changeType="positive" icon={CheckCircle} iconColor="text-success" />
        <StatCard title="Total Spent"  value="₹82K"  change="+12% vs last month" changeType="positive" icon={ShoppingBag} iconColor="text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold mb-4">Weekly Sales (₹)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(v: any) => [`₹${v.toLocaleString()}`, "Sales"]} />
              <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold">Inventory Alerts</h3>
          </div>
          <div className="space-y-3">
            {stockAlerts.map(item => (
              <div key={item.sku} className={`p-3 rounded-lg border ${item.qty === 0 ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40"}`}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className={`text-xs font-semibold ${item.qty === 0 ? "text-red-600" : "text-amber-600"}`}>{item.qty === 0 ? "Out of Stock" : `${item.qty} left`}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${item.qty === 0 ? "bg-red-500" : "bg-amber-500"}`} style={{ width: `${Math.min((item.qty / item.threshold) * 100, 100)}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">SKU: {item.sku} · Threshold: {item.threshold}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {myOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <p className="text-sm font-semibold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.product} · {o.distributor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{o.total}</span>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold mb-4">Live Tracking</h3>
          <div className="space-y-3">
            {tracking.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">{t.id}</p>
                    <p className="text-xs text-muted-foreground">{t.product} · From: {t.from} · ETA: {t.eta}</p>
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
