import { Users, Package, Truck, ShieldAlert, TrendingUp, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useRole } from "@/hooks/use-role";
import ReportDownloadButton from "@/components/ReportDownloadButton";

const shipmentTrend = [
  { month: "Jan", shipped: 45, delivered: 42 },
  { month: "Feb", shipped: 52, delivered: 48 },
  { month: "Mar", shipped: 61, delivered: 55 },
  { month: "Apr", shipped: 38, delivered: 30 },
  { month: "May", shipped: 70, delivered: 62 },
  { month: "Jun", shipped: 58, delivered: 54 },
];

const userDist = [
  { name: "Suppliers", value: 12, color: "#6366f1" },
  { name: "Distributors", value: 8, color: "#f59e0b" },
  { name: "Retailers", value: 24, color: "#10b981" },
];

const recentActivity = [
  { id: 1, action: "New supplier registered", user: "Priya Textiles", time: "5 min ago", type: "info" },
  { id: 2, action: "Shipment delayed", user: "SHP-TN-042", time: "20 min ago", type: "warning" },
  { id: 3, action: "Order dispute raised", user: "ORD-2041", time: "1 hr ago", type: "error" },
  { id: 4, action: "Delivery completed", user: "SHP-TN-038", time: "2 hr ago", type: "success" },
  { id: 5, action: "Low stock alert", user: "Cotton Fabric SKU-09", time: "3 hr ago", type: "warning" },
];

const productFlow = [
  { id: "PRD-001", name: "Cotton Fabric", supplier: "Priya Textiles", distributor: "KovaiDist", retailer: "Chennai Store", status: "delivered" },
  { id: "PRD-002", name: "Silk Saree", supplier: "Kanchipuram Co", distributor: "MaduraiDist", retailer: "Tirupur Shop", status: "shipped" },
  { id: "PRD-003", name: "Polyester Roll", supplier: "Erode Mills", distributor: "SalemDist", retailer: "Vellore Mart", status: "processing" },
];

export default function AdminDashboard() {
  const { user } = useRole();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name} — Full system overview</p>
        </div>
        <ReportDownloadButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users"      value="44"   change="+3 this week"      changeType="positive" icon={Users} />
        <StatCard title="Active Shipments" value="28"   change="4 delayed"         changeType="negative" icon={Truck} iconColor="text-warning" />
        <StatCard title="Total Orders"     value="312"  change="+18 today"         changeType="positive" icon={Package} iconColor="text-info" />
        <StatCard title="Fraud Alerts"     value="2"    change="Needs attention"   changeType="negative" icon={ShieldAlert} iconColor="text-destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass-card rounded-lg p-5">
          <h3 className="font-semibold mb-4">Shipment Trends</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={shipmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend />
              <Line type="monotone" dataKey="shipped" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={userDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                {userDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {userDist.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold mb-4">Product Flow Tracker</h3>
          <div className="space-y-3">
            {productFlow.map((p) => (
              <div key={p.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{p.name}</span>
                  <StatusBadge status={p.status} />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">{p.supplier}</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">{p.distributor}</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">{p.retailer}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-lg p-5">
          <h3 className="font-semibold mb-4">System Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                <div className={`mt-0.5 h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                  a.type === "success" ? "bg-emerald-100 dark:bg-emerald-950/40" :
                  a.type === "warning" ? "bg-amber-100 dark:bg-amber-950/40" :
                  a.type === "error"   ? "bg-red-100 dark:bg-red-950/40" :
                  "bg-blue-100 dark:bg-blue-950/40"
                }`}>
                  {a.type === "success" && <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />}
                  {a.type === "warning" && <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />}
                  {a.type === "error"   && <ShieldAlert className="h-3.5 w-3.5 text-red-600" />}
                  {a.type === "info"    && <Users className="h-3.5 w-3.5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.user} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
