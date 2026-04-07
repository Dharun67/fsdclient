import { useState } from "react";
import { RotateCcw, Search, Plus, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialReturns = [
  { id: "RET-001", from: "Chennai Store",  product: "Cotton Fabric x5m", reason: "Defective",      status: "resolved",  date: "2026-07-16" },
  { id: "RET-002", from: "Tirupur Shop",   product: "Silk Saree x2",     reason: "Wrong item",     status: "pending",   date: "2026-07-19" },
  { id: "RET-003", from: "Vellore Mart",   product: "Linen Shirt x3",    reason: "Damaged in transit", status: "processing", date: "2026-07-20" },
];

const retailers = ["Chennai Store", "Tirupur Shop", "Vellore Mart", "Salem Retail"];
const reasons   = ["Defective", "Wrong item", "Damaged in transit", "Quality issue", "Other"];

const statusColor: Record<string, string> = {
  pending:    "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
  processing: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
  resolved:   "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
};

export default function DistributorReturns() {
  const { toast } = useToast();
  const [returns, setReturns] = useState(initialReturns);
  const [search, setSearch]   = useState("");
  const [open, setOpen]       = useState(false);
  const [form, setForm]       = useState({ from: "", product: "", reason: "" });

  const filtered = returns.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.from.toLowerCase().includes(search.toLowerCase()) ||
    r.product.toLowerCase().includes(search.toLowerCase())
  );

  const addReturn = () => {
    if (!form.from || !form.product || !form.reason) {
      toast({ title: "Fill all fields", variant: "destructive" }); return;
    }
    const newReturn = {
      id: `RET-${String(returns.length + 1).padStart(3, "0")}`,
      from: form.from, product: form.product, reason: form.reason,
      status: "pending", date: new Date().toISOString().split("T")[0],
    };
    setReturns([newReturn, ...returns]);
    setOpen(false);
    setForm({ from: "", product: "", reason: "" });
    toast({ title: `Return ${newReturn.id} logged!` });
  };

  const updateStatus = (id: string, status: string) => {
    setReturns(returns.map(r => r.id === id ? { ...r, status } : r));
    toast({ title: "Return status updated!" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Returns Management</h1>
          <p className="text-muted-foreground">Handle defective and returned products from retailers</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Log Return</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log Return</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>From Retailer</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })}>
                  <option value="">Select retailer</option>
                  {retailers.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Product</Label>
                <Input placeholder="e.g. Cotton Fabric x5m" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Reason</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}>
                  <option value="">Select reason</option>
                  {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <Button className="w-full" onClick={addReturn}>Log Return</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search returns..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{r.id}</p>
                  <p className="text-xs text-muted-foreground">{r.product} · From: {r.from}</p>
                  <p className="text-xs text-muted-foreground">Reason: {r.reason} · {r.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[r.status]}`}>{r.status}</span>
                {r.status !== "resolved" && (
                  <select className="h-7 px-2 rounded-md border border-input bg-background text-xs" value={r.status} onChange={e => updateStatus(r.id, e.target.value)}>
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="resolved">resolved</option>
                  </select>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card rounded-lg p-8 text-center">
            <RotateCcw className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No returns found</p>
          </div>
        )}
      </div>
    </div>
  );
}
