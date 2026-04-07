import { useState } from "react";
import { Package, Search, Plus, AlertTriangle, MinusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialStock = [
  { id: 1, name: "Cotton Fabric",  sku: "CF-001", qty: 120, sold: 30, price: 450,  status: "in-stock" },
  { id: 2, name: "Silk Saree",     sku: "SS-002", qty: 18,  sold: 7,  price: 2800, status: "low" },
  { id: 3, name: "Linen Shirt",    sku: "LS-003", qty: 0,   sold: 20, price: 680,  status: "out" },
  { id: 4, name: "Polyester Roll", sku: "PR-004", qty: 55,  sold: 10, price: 320,  status: "in-stock" },
];

export default function RetailerInventory() {
  const { toast } = useToast();
  const [stock, setStock]   = useState(initialStock);
  const [search, setSearch] = useState("");
  const [open, setOpen]     = useState(false);
  const [sellForm, setSellForm] = useState({ id: 0, qty: "" });
  const [addForm, setAddForm]   = useState({ name: "", sku: "", qty: "", price: "" });
  const [addOpen, setAddOpen]   = useState(false);

  const filtered = stock.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.sku.toLowerCase().includes(search.toLowerCase())
  );

  const recordSale = () => {
    const qty = parseInt(sellForm.qty);
    const item = stock.find(s => s.id === sellForm.id);
    if (!item || !qty || qty > item.qty) {
      toast({ title: "Invalid quantity", variant: "destructive" }); return;
    }
    setStock(stock.map(s => {
      if (s.id !== sellForm.id) return s;
      const newQty = s.qty - qty;
      return { ...s, qty: newQty, sold: s.sold + qty, status: newQty === 0 ? "out" : newQty < 20 ? "low" : "in-stock" };
    }));
    setOpen(false);
    setSellForm({ id: 0, qty: "" });
    toast({ title: "Sale recorded!", description: `${qty} units of ${item.name} sold.` });
  };

  const addProduct = () => {
    if (!addForm.name || !addForm.sku || !addForm.qty || !addForm.price) {
      toast({ title: "Fill all fields", variant: "destructive" }); return;
    }
    const qty = parseInt(addForm.qty);
    setStock([...stock, {
      id: stock.length + 1, name: addForm.name, sku: addForm.sku,
      qty, sold: 0, price: parseInt(addForm.price),
      status: qty === 0 ? "out" : qty < 20 ? "low" : "in-stock",
    }]);
    setAddOpen(false);
    setAddForm({ name: "", sku: "", qty: "", price: "" });
    toast({ title: "Product added!" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Inventory</h1>
          <p className="text-muted-foreground">Track stock and record sales</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><MinusCircle className="h-4 w-4 mr-2" />Record Sale</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Sale</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Product</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={sellForm.id} onChange={e => setSellForm({ ...sellForm, id: parseInt(e.target.value) })}>
                    <option value={0}>Select product</option>
                    {stock.filter(s => s.qty > 0).map(s => <option key={s.id} value={s.id}>{s.name} (Stock: {s.qty})</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Quantity Sold</Label>
                  <Input type="number" placeholder="0" value={sellForm.qty} onChange={e => setSellForm({ ...sellForm, qty: e.target.value })} />
                </div>
                {sellForm.id > 0 && sellForm.qty && (
                  <p className="text-sm font-semibold text-primary">
                    Revenue: ₹{((stock.find(s => s.id === sellForm.id)?.price || 0) * parseInt(sellForm.qty || "0")).toLocaleString()}
                  </p>
                )}
                <Button className="w-full" onClick={recordSale}>Record Sale</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Product Name</Label>
                  <Input placeholder="e.g. Cotton Fabric" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>SKU</Label>
                    <Input placeholder="CF-001" value={addForm.sku} onChange={e => setAddForm({ ...addForm, sku: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="0" value={addForm.qty} onChange={e => setAddForm({ ...addForm, qty: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Price per unit (₹)</Label>
                  <Input type="number" placeholder="0" value={addForm.price} onChange={e => setAddForm({ ...addForm, price: e.target.value })} />
                </div>
                <Button className="w-full" onClick={addProduct}>Add Product</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {stock.some(s => s.status === "low" || s.status === "out") && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {stock.filter(s => s.status === "out").length} out of stock · {stock.filter(s => s.status === "low").length} low stock items need restocking
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-muted/40">
                <p className="text-lg font-bold">{item.qty}</p>
                <p className="text-[10px] text-muted-foreground">In Stock</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/40">
                <p className="text-lg font-bold">{item.sold}</p>
                <p className="text-[10px] text-muted-foreground">Sold</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/40">
                <p className="text-lg font-bold">₹{item.price}</p>
                <p className="text-[10px] text-muted-foreground">Price</p>
              </div>
            </div>
            {item.status !== "out" && (
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${item.status === "low" ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min((item.qty / 150) * 100, 100)}%` }} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
