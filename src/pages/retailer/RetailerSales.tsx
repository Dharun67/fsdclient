import { useState } from "react";
import { Receipt, Search, TrendingUp, Download, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const initialSales = [
  { id: "INV-001", product: "Cotton Fabric", qty: 10, price: 450,  total: 4500,  customer: "Walk-in",      date: "2026-07-15" },
  { id: "INV-002", product: "Silk Saree",    qty: 2,  price: 2800, total: 5600,  customer: "Meena Stores", date: "2026-07-16" },
  { id: "INV-003", product: "Linen Shirt",   qty: 5,  price: 680,  total: 3400,  customer: "Walk-in",      date: "2026-07-18" },
  { id: "INV-004", product: "Cotton Fabric", qty: 8,  price: 450,  total: 3600,  customer: "Raja Textiles",date: "2026-07-20" },
];

const weeklyChart = [
  { day: "Mon", sales: 4500 }, { day: "Tue", sales: 5600 },
  { day: "Wed", sales: 2800 }, { day: "Thu", sales: 7200 },
  { day: "Fri", sales: 3400 }, { day: "Sat", sales: 9100 },
];

const products = ["Cotton Fabric", "Silk Saree", "Linen Shirt", "Polyester Roll"];

export default function RetailerSales() {
  const { toast } = useToast();
  const [sales, setSales]   = useState(initialSales);
  const [search, setSearch] = useState("");
  const [open, setOpen]     = useState(false);
  const [form, setForm]     = useState({ product: "", qty: "", price: "", customer: "" });

  const filtered = sales.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.product.toLowerCase().includes(search.toLowerCase()) ||
    s.customer.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

  const addSale = () => {
    if (!form.product || !form.qty || !form.price) {
      toast({ title: "Fill all fields", variant: "destructive" }); return;
    }
    const total = parseInt(form.qty) * parseInt(form.price);
    const newSale = {
      id: `INV-${String(sales.length + 1).padStart(3, "0")}`,
      product: form.product, qty: parseInt(form.qty),
      price: parseInt(form.price), total,
      customer: form.customer || "Walk-in",
      date: new Date().toISOString().split("T")[0],
    };
    setSales([newSale, ...sales]);
    setOpen(false);
    setForm({ product: "", qty: "", price: "", customer: "" });
    toast({ title: `Invoice ${newSale.id} generated!`, description: `₹${total.toLocaleString()} recorded.` });
  };

  const downloadInvoice = (sale: typeof initialSales[0]) => {
    const content = `INVOICE\n-------\nID: ${sale.id}\nDate: ${sale.date}\nCustomer: ${sale.customer}\nProduct: ${sale.product}\nQty: ${sale.qty} x ₹${sale.price}\nTotal: ₹${sale.total.toLocaleString()}\n\nThank you for your business!`;
    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${sale.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales & Invoices</h1>
          <p className="text-muted-foreground">Record sales and generate invoices</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Record Sale</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record New Sale</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Product</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}>
                  <option value="">Select product</option>
                  {products.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Customer Name</Label>
                <Input placeholder="Walk-in" value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} />
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
              <Button className="w-full" onClick={addSale}>Generate Invoice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Revenue</p>
        </div>
        <div className="glass-card rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{sales.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Invoices</p>
        </div>
        <div className="glass-card rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-emerald-500">₹{Math.round(totalRevenue / sales.length).toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Avg per Sale</p>
        </div>
      </div>

      <div className="glass-card rounded-lg p-5">
        <h3 className="font-semibold mb-4">Weekly Sales (₹)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(v: any) => [`₹${v.toLocaleString()}`, "Sales"]} />
            <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.map((sale, i) => (
          <motion.div key={sale.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{sale.id}</p>
                  <p className="text-xs text-muted-foreground">{sale.product} · {sale.qty} units · {sale.customer}</p>
                  <p className="text-xs text-muted-foreground">{sale.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-emerald-600">₹{sale.total.toLocaleString()}</span>
                <Button variant="outline" size="sm" onClick={() => downloadInvoice(sale)}>
                  <Download className="h-3.5 w-3.5 mr-1" />Invoice
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
