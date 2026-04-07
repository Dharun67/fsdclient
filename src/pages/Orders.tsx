import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { ordersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getAll(search);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">View and manage all orders</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="glass-card rounded-lg p-8 text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading orders...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{order.code}</p>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium hidden sm:block">{order.total}</span>
                  <StatusBadge status={order.status} />
                  {expanded === order._id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              <AnimatePresence>
                {expanded === order._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-border/50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                        {[
                          { label: "Order Date", value: order.order_date || 'N/A' },
                          { label: "Items", value: `${order.items} products` },
                          { label: "Destination", value: order.destination || 'N/A' },
                          { label: "Total", value: order.total },
                        ].map((d) => (
                          <div key={d.label}>
                            <p className="text-xs text-muted-foreground">{d.label}</p>
                            <p className="text-sm font-medium mt-0.5">{d.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          {orders.length === 0 && !loading && (
            <div className="glass-card rounded-lg p-8 text-center">
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No orders found</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first order to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
