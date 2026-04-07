import { useState } from "react";
import { Search, Package, MapPin, CheckCircle, Truck, Factory, Store } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const productDB: Record<string, any> = {
  "PRD-001": {
    name: "Cotton Fabric", category: "Fabric", sku: "CF-001",
    supplier: { name: "Priya Textiles", location: "Erode, TN", contact: "priya@tnsupplier.com" },
    distributor: { name: "KovaiDist", location: "Coimbatore, TN" },
    journey: [
      { step: "Manufactured",  location: "Erode, TN",       date: "2026-07-01", done: true },
      { step: "Quality Check", location: "Erode, TN",       date: "2026-07-03", done: true },
      { step: "Dispatched",    location: "Coimbatore, TN",  date: "2026-07-05", done: true },
      { step: "At Distributor",location: "Coimbatore, TN",  date: "2026-07-08", done: true },
      { step: "Delivered",     location: "Chennai, TN",     date: "2026-07-12", done: true },
    ],
  },
  "PRD-002": {
    name: "Silk Saree", category: "Clothing", sku: "SS-002",
    supplier: { name: "Kanchipuram Co", location: "Kanchipuram, TN", contact: "silk@kanchipuram.com" },
    distributor: { name: "MaduraiDist", location: "Madurai, TN" },
    journey: [
      { step: "Manufactured",  location: "Kanchipuram, TN", date: "2026-07-05", done: true },
      { step: "Quality Check", location: "Kanchipuram, TN", date: "2026-07-07", done: true },
      { step: "Dispatched",    location: "Madurai, TN",     date: "2026-07-10", done: true },
      { step: "At Distributor",location: "Madurai, TN",     date: "2026-07-13", done: true },
      { step: "Delivered",     location: "Tirupur, TN",     date: "2026-07-18", done: false },
    ],
  },
  "PRD-003": {
    name: "Polyester Roll", category: "Fabric", sku: "PR-004",
    supplier: { name: "Erode Mills", location: "Erode, TN", contact: "mills@erode.com" },
    distributor: { name: "SalemDist", location: "Salem, TN" },
    journey: [
      { step: "Manufactured",  location: "Erode, TN",  date: "2026-07-10", done: true },
      { step: "Quality Check", location: "Erode, TN",  date: "2026-07-11", done: true },
      { step: "Dispatched",    location: "Salem, TN",  date: "2026-07-14", done: false },
      { step: "At Distributor",location: "Salem, TN",  date: "-",          done: false },
      { step: "Delivered",     location: "Vellore, TN",date: "-",          done: false },
    ],
  },
};

const stepIcons = [Factory, CheckCircle, Truck, Store, MapPin];

export default function RetailerTrack() {
  const [query, setQuery]     = useState("");
  const [result, setResult]   = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const search = () => {
    const found = productDB[query.toUpperCase().trim()];
    if (found) { setResult(found); setNotFound(false); }
    else       { setResult(null);  setNotFound(true); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Product Tracking</h1>
        <p className="text-muted-foreground">Enter a product ID to view its full origin and journey</p>
      </div>

      <div className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="e.g. PRD-001" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} className="pl-9" />
        </div>
        <Button onClick={search}>Track</Button>
      </div>

      <div className="text-xs text-muted-foreground">Try: PRD-001, PRD-002, PRD-003</div>

      {notFound && (
        <div className="glass-card rounded-lg p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm font-semibold">Product not found</p>
          <p className="text-xs text-muted-foreground mt-1">Check the product ID and try again</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{result.name}</h2>
                <p className="text-sm text-muted-foreground">{result.category} · SKU: {result.sku}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
                <p className="text-xs font-semibold text-blue-600 mb-1">Supplier</p>
                <p className="text-sm font-semibold">{result.supplier.name}</p>
                <p className="text-xs text-muted-foreground">{result.supplier.location}</p>
                <p className="text-xs text-muted-foreground">{result.supplier.contact}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                <p className="text-xs font-semibold text-amber-600 mb-1">Distributor</p>
                <p className="text-sm font-semibold">{result.distributor.name}</p>
                <p className="text-xs text-muted-foreground">{result.distributor.location}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-lg p-5">
            <h3 className="font-semibold mb-5">Product Journey</h3>
            <div className="space-y-4">
              {result.journey.map((step: any, i: number) => {
                const Icon = stepIcons[i] || MapPin;
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center ${step.done ? "bg-emerald-100 dark:bg-emerald-950/40" : "bg-muted"}`}>
                        <Icon className={`h-4 w-4 ${step.done ? "text-emerald-600" : "text-muted-foreground/40"}`} />
                      </div>
                      {i < result.journey.length - 1 && (
                        <div className={`w-0.5 h-8 mt-1 ${step.done ? "bg-emerald-400" : "bg-muted"}`} />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <p className={`text-sm font-semibold ${step.done ? "" : "text-muted-foreground"}`}>{step.step}</p>
                      <p className="text-xs text-muted-foreground">{step.location} · {step.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
