import { useState } from "react";
import { Truck, Search, Plus, Package, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialShipments = [
  { id: "SHP-TN-041", to: "Chennai Store",  product: "Cotton Fabric x50m", status: "delivered", eta: "2026-07-18", generated: "2026-07-14" },
  { id: "SHP-TN-042", to: "Tirupur Shop",   product: "Silk Saree x10",     status: "shipped",   eta: "2026-07-22", generated: "2026-07-18" },
  { id: "SHP-TN-043", to: "Vellore Mart",   product: "Linen Shirt x30",    status: "packed",    eta: "2026-07-24", generated: "2026-07-20" },
  { id: "SHP-TN-044", to: "Salem Retail",   product: "Polyester Roll x20m",status: "ordered",   eta: "2026-07-26", generated: "2026-07-21" },
];

const retailers = ["Chennai Store", "Tirupur Shop", "Vellore Mart", "Salem Retail", "Madurai Bazaar"];
const products  = ["Cotton Fabric", "Silk Saree", "Linen Shirt", "Polyester Roll"];
const statuses  = ["ordered", "packed", "shipped", "delivered"];

export default function DistributorShipments() {
  const { toast } = useToast();
  const [shipments, setShipments] = useState(initialShipments);
  const [search, setSearch]       = useState("");
  const [open, setOpen]           = useState(false);
  const [form, setForm]           = useState({ retailer: "", product: "", qty: "", eta: "" });

  const filtered = shipments.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.to.toLowerCase().includes(search.toLowerCase()) ||
    s.product.toLowerCase().includes(search.toLowerCase())
  );

  const dispatch = () => {
    if (!form.retailer || !form.product || !form.qty || !form.eta) {
      toast({ title: "Fill all fields", variant: "destructive" }); return;
    }
    const id = `SHP-TN-${String(40 + shipments.length + 1).padStart(3, "0")}`;
    setShipments([{
      id, to: form.retailer,
      product: `${form.product} x${form.qty}`,
      status: "ordered", eta: form.eta,
      generated: new Date().toISOString().split("T")[0],
    }, ...shipments]);
    setOpen(false);
    setForm({ retailer: "", product: "", qty: "", eta: "" });
    toast({ title: `Shipment ${id} created!`, description: `Dispatching to ${form.retailer}.` });
  };

  const updateStatus = (id: string, status: string) => {
    setShipments(shipments.map(s => s.id === id ? { ...s, status } : s));
    toast({ title: "Status updated!", description: `${id} → ${status}` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shipments to Retailers</h1>
          <p className="text-muted-foreground">Dispatch products and manage delivery status</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Shipment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Shipment</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Retailer</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={form.retailer} onChange={e => setForm({ ...form, retailer: e.target.value })}>
                  <option value="">Select retailer</option>
                  {retailers.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Product</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}>
                  <option value="">Select product</option>
                  {products.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="0" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>ETA Date</Label>
                  <Input type="date" value={form.eta} onChange={e => setForm({ ...form, eta: e.target.value })} />
                </div>
              </div>
              <Button className="w-full" onClick={dispatch}>Generate & Dispatch</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search shipments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{s.id}</p>
                  <p className="text-xs text-muted-foreground">{s.product} → {s.to}</p>
                  <p className="text-xs text-muted-foreground">ETA: {s.eta} · Created: {s.generated}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={s.status} />
                {s.status !== "delivered" && (
                  <select className="h-7 px-2 rounded-md border border-input bg-background text-xs" value={s.status} onChange={e => updateStatus(s.id, e.target.value)}>
                    {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card rounded-lg p-8 text-center">
            <Truck className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No shipments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
