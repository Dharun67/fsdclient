import { Package, Truck, Clock, Warehouse, CheckCircle, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { chartData, activityFeed, shipments } from "@/lib/mock-data";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your supply chain operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Shipments" value="284" change="+12% from last month" changeType="positive" icon={Truck} />
        <StatCard title="Delivered" value="198" change="+8% from last month" changeType="positive" icon={CheckCircle} iconColor="text-success" />
        <StatCard title="Pending Orders" value="43" change="+3 new today" changeType="neutral" icon={Clock} iconColor="text-warning" />
        <StatCard title="Inventory Items" value="1,247" change="2 items low stock" changeType="negative" icon={Warehouse} iconColor="text-info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-lg p-5"
        >
          <h3 className="font-semibold mb-4">Shipment Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData.shipmentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="shipped" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="delivered" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-lg p-5"
        >
          <h3 className="font-semibold mb-4">Orders by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData.ordersByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-lg p-5"
        >
          <h3 className="font-semibold mb-4">Recent Shipments</h3>
          <div className="space-y-3">
            {shipments.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{s.id}</p>
                  <p className="text-xs text-muted-foreground">{s.origin} → {s.destination}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-lg p-5"
        >
          <h3 className="font-semibold mb-4">Activity Feed</h3>
          <div className="space-y-3">
            {activityFeed.map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                <div className="mt-0.5 h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  {a.icon === "check" && <CheckCircle className="h-4 w-4 text-success" />}
                  {a.icon === "package" && <Package className="h-4 w-4 text-primary" />}
                  {a.icon === "warehouse" && <Warehouse className="h-4 w-4 text-info" />}
                  {a.icon === "alert" && <AlertTriangle className="h-4 w-4 text-warning" />}
                  {a.icon === "truck" && <Truck className="h-4 w-4 text-primary" />}
                  {a.icon === "user" && <Users className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
