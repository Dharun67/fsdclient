import { useState, useEffect } from "react";
import { Search, MapPin, Package, Truck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { shipmentsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const timelineSteps = ["ordered", "packed", "shipped", "delivered"];
const stepIcons = [Package, Package, Truck, CheckCircle];

function ShipmentTimeline({ status }: { status: string }) {
  const activeIdx = timelineSteps.indexOf(status);
  return (
    <div className="flex items-center gap-1 w-full">
      {timelineSteps.map((step, i) => {
        const Icon = stepIcons[i];
        const active = i <= activeIdx;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-muted-foreground/40"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${active ? "bg-primary/15" : "bg-muted"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-medium capitalize">{step}</span>
            </div>
            {i < timelineSteps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 rounded ${i < activeIdx ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Shipments() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchShipments();
  }, [search]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const data = await shipmentsAPI.getAll(search);
      setShipments(data);
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
      toast({
        title: "Error",
        description: "Failed to load shipments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedShipment = shipments.find((s) => s._id === selected);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shipment Tracking</h1>
        <p className="text-muted-foreground">Track and manage all your shipments</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by ID, origin, or destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="glass-card rounded-lg p-8 text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading shipments...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {shipments.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(s._id)}
                className={`glass-card rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selected === s._id ? "ring-2 ring-primary/50" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{s.code}</p>
                      <p className="text-xs text-muted-foreground">{s.carrier || 'N/A'}</p>
                    </div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{s.origin}</span>
                  <span>→</span>
                  <span>{s.destination}</span>
                </div>
                <ShipmentTimeline status={s.status} />
              </motion.div>
            ))}
            {shipments.length === 0 && (
              <div className="glass-card rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No shipments found</p>
                <p className="text-xs text-muted-foreground mt-1">Create your first shipment to get started</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {selectedShipment ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-lg p-5 sticky top-24"
              >
                <h3 className="font-semibold mb-4">Shipment Details</h3>
                <div className="space-y-4">
                  {[
                    { label: "Shipment ID", value: selectedShipment.code },
                    { label: "Origin", value: selectedShipment.origin },
                    { label: "Destination", value: selectedShipment.destination },
                    { label: "Carrier", value: selectedShipment.carrier || 'N/A' },
                    { label: "Weight", value: selectedShipment.weight || 'N/A' },
                    { label: "ETA", value: selectedShipment.eta || 'N/A' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <StatusBadge status={selectedShipment.status} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Select a shipment to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
