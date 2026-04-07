import { useState } from "react";
import { ShoppingBag, Search, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialOrders = [
  { id: "ORD-R-201", product: "Cotton Fabric x10m", distributor: "KovaiDist",   total: "₹4,500",  status: "delivered",  date: "2026-07-15" },
  { id: "ORD-R-202", product: "Silk Saree x5",      distributor: "MaduraiDist", total: "₹14,000", status: "shipped",    date: "2026-07-18" },
  { id: "ORD-R-203", product: "Linen Shirt x20",    distributor: "KovaiDist",   total: "₹13,600", status: "processing", date: "2026-07-20" },
  { id: "ORD-R-204", product: "Polyester Roll x5m", distributor: "SalemDist",   total: "₹1,600",  status: "pending",    date: "2026-07-21" },
];

const distributors = ["KovaiDist", "MaduraiDist", "SalemDist", "ChennaiDist"];

export default function RetailerOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [open, setOpen]     = useState(false);
  const [form, setForm]     = useState({ product: "", distributor: "", qty: "", price: "" });

  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.product.toLowerCase().includes(search.toLowerCase())
  );

  const placeOrder = () => {
    if (!form.product || !form.distributor || !form.qty || !form.price) {
      toast({ title: "Fill all fields", variant: "destructive" }); return;
    }
    const newOrder = {
      id: `ORD-R-${200 + orders.length + 1}`,
      product: `${form.product} x${form.qty}`,
      distributor: form.distributor,
      total: `₹${(parseInt(form.qty) * parseInt(form.price)).toLocaleString()}`,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };
    setOrders([newOrder, ...orders]);
    setOpen(false);
    setForm({ product: "", distributor: "", qty: "", price: "" });
    toast({ title: "Order placed!", description: `${newOrder.id} submitted successfully.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">Place and track orders from distributors</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Place Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Place New Order</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Product Name</Label>
                <Input placeholder="e.g. Cotton Fabric" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Distributor</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={form.distributor} onChange={e => setForm({ ...form, distributor: e.target.value })}>
                  <option value="">Select distributor</option>
                  {distributors.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="0" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Price per unit (₹)</Label>
                  <Input type="number" placeholder="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
              </div>
              {form.qty && form.price && (
                <p className="text-sm font-semibold text-primary">Total: ₹{(parseInt(form.qty || "0") * parseInt(form.price || "0")).toLocaleString()}</p>
              )}
              <Button className="w-full" onClick={placeOrder}>Confirm Order</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.map((order, i) => (
          <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.product}</p>
                  <p className="text-xs text-muted-foreground">{order.distributor} · {order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{order.total}</span>
                <StatusBadge status={order.status} />
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card rounded-lg p-8 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
