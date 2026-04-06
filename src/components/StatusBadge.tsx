import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  delivered: { label: "Delivered", className: "bg-success/15 text-success border-success/20 hover:bg-success/20" },
  shipped: { label: "Shipped", className: "bg-info/15 text-info border-info/20 hover:bg-info/20" },
  packed: { label: "Packed", className: "bg-warning/15 text-warning border-warning/20 hover:bg-warning/20" },
  ordered: { label: "Ordered", className: "bg-muted text-muted-foreground border-border hover:bg-muted" },
  processing: { label: "Processing", className: "bg-primary/15 text-primary border-primary/20 hover:bg-primary/20" },
  pending: { label: "Pending", className: "bg-warning/15 text-warning border-warning/20 hover:bg-warning/20" },
  "in-stock": { label: "In Stock", className: "bg-success/15 text-success border-success/20 hover:bg-success/20" },
  low: { label: "Low Stock", className: "bg-warning/15 text-warning border-warning/20 hover:bg-warning/20" },
  out: { label: "Out of Stock", className: "bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}
