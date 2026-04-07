import { useState } from "react";
import { ClipboardList, Search, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialOrders = [
  { id: "ORD-S-101", supplier: "Priya Textiles",  product: "Cotton Fabric x100m", total: "₹45,000", status: "delivered",  date: "2026-07-10" },
  { id: "ORD-S-102", supplier: "Erode Mills",      product: "Polyester Roll x50m", total: "₹16,000", status: "shipped",    date: "2026-07-14" },
  { id: "ORD-S-103", supplier: "Kanchipuram Co",   product: "Silk Saree x20",      total: "₹56,000", status: "processing", date: "2026-07-18" },
  { id: "ORD-S-104", supplier: "Tirupur Garments", product: "Linen Shirt x50",     total: "₹34,000", status: "pending",    date: "2026-07-21" },
];

const suppliers = ["Priya Textiles", "Erode Mills", "Kanchipuram Co", "Tirupur Garments"];

export default function DistributorOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [open, setOpen]     = useState(false);
  const [form, setForm]     = useState({ supplier: "", product: "", qty: "", price: "" });

  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.supplier.toLowerCase().includes(search.toLowerCase()) ||
    o.product.toLowerCase().includes(search.toLowerCase())
  );

  const placeOrder = () => {
    if (!form.supplier || !form.product || !form.qty || !form.price) {
      toast({ title: "Fill all fields", variant: "destructive" }); return;
    }
    const newOrder = {
      id: `ORD-S-${100 + orders.length + 1}`,
      supplier: form.supplier,
      product: `${form.product} x${form.qty}`,
      total: `₹${(parseInt(form.qty) * parseInt(form.price)).toLocaleString()}`,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };
    setOrders([newOrder, ...orders]);
    setOpen(false);
    setForm({ supplier: "", product: "", qty: "", price: "" });
    toast({ title: "Order placed!", description: `${newOrder.id} sent to ${newOrder.supplier}.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders to Suppliers</h1>
          <p className="text-muted-foreground">Place and track orders from suppliers</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Place Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Place Order to Supplier</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Supplier</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}>
                  <option value="">Select supplier</option>
                  {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Product Name</Label>
                <Input placeholder="e.g. Cotton Fabric" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
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
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.product}</p>
                  <p className="text-xs text-muted-foreground">{order.supplier} · {order.date}</p>
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
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
