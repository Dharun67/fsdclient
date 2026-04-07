import { useState } from "react";
import { Package, Search, Plus, AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialStock = [
  { id: 1, name: "Cotton Fabric",  sku: "CF-001", qty: 850, reserved: 200, warehouse: "WH-KOV-01", status: "in-stock" },
  { id: 2, name: "Silk Saree",     sku: "SS-002", qty: 45,  reserved: 20,  warehouse: "WH-KOV-01", status: "low" },
  { id: 3, name: "Polyester Roll", sku: "PR-004", qty: 0,   reserved: 0,   warehouse: "WH-KOV-02", status: "out" },
  { id: 4, name: "Linen Shirt",    sku: "LS-003", qty: 320, reserved: 50,  warehouse: "WH-KOV-02", status: "in-stock" },
];

export default function DistributorInventory() {
  const { toast } = useToast();
  const [stock, setStock]   = useState(initialStock);
  const [search, setSearch] = useState("");
  const [open, setOpen]     = useState(false);
  const [form, setForm]     = useState({ name: "", sku: "", qty: "", warehouse: "" });
  const [restockId, setRestockId] = useState<number | null>(null);
  const [restockQty, setRestockQty] = useState("");

  const filtered = stock.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addProduct = () => {
    if (!form.name || !form.sku || !form.qty || !form.warehouse) {
      toast({ title: "Fill all fields", variant: "destructive" }); return;
    }
    const qty = parseInt(form.qty);
    setStock([...stock, { id: stock.length + 1, name: form.name, sku: form.sku, qty, reserved: 0, warehouse: form.warehouse, status: qty === 0 ? "out" : qty < 50 ? "low" : "in-stock" }]);
    setOpen(false);
    setForm({ name: "", sku: "", qty: "", warehouse: "" });
    toast({ title: "Product added to warehouse!" });
  };

  const restock = (id: number) => {
    const qty = parseInt(restockQty);
    if (!qty || qty <= 0) { toast({ title: "Enter valid quantity", variant: "destructive" }); return; }
    setStock(stock.map(s => {
      if (s.id !== id) return s;
      const newQty = s.qty + qty;
      return { ...s, qty: newQty, status: newQty < 50 ? "low" : "in-stock" };
    }));
    setRestockId(null);
    setRestockQty("");
    toast({ title: "Stock updated!", description: `+${qty} units added.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Warehouse Inventory</h1>
          <p className="text-muted-foreground">Manage warehouse stock levels</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add to Warehouse</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Product Name</Label>
                <Input placeholder="e.g. Cotton Fabric" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>SKU</Label>
                  <Input placeholder="CF-001" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="0" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Warehouse</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={form.warehouse} onChange={e => setForm({ ...form, warehouse: e.target.value })}>
                  <option value="">Select warehouse</option>
                  <option value="WH-KOV-01">WH-KOV-01</option>
                  <option value="WH-KOV-02">WH-KOV-02</option>
                  <option value="WH-MDU-01">WH-MDU-01</option>
                </select>
              </div>
              <Button className="w-full" onClick={addProduct}>Add to Warehouse</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {stock.some(s => s.status !== "in-stock") && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {stock.filter(s => s.status === "out").length} out of stock · {stock.filter(s => s.status === "low").length} low stock — reorder from suppliers
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sku} · {item.warehouse}</p>
                  <p className="text-xs text-muted-foreground">Available: {item.qty - item.reserved} · Reserved: {item.reserved}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={item.status} />
                <Button variant="outline" size="sm" onClick={() => setRestockId(restockId === item.id ? null : item.id)}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />Restock
                </Button>
              </div>
            </div>
            {restockId === item.id && (
              <div className="mt-3 flex gap-2 items-center">
                <Input type="number" placeholder="Add qty" className="h-8 w-32 text-sm" value={restockQty} onChange={e => setRestockQty(e.target.value)} />
                <Button size="sm" onClick={() => restock(item.id)}>Confirm</Button>
                <Button size="sm" variant="ghost" onClick={() => setRestockId(null)}>Cancel</Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
