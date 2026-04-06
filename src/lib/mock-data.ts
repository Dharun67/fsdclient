export const shipments = [
  { id: "SHP-001", origin: "Shanghai, CN", destination: "Los Angeles, US", status: "delivered", eta: "2026-03-28", carrier: "OceanFreight Co", weight: "2,400 kg" },
  { id: "SHP-002", origin: "Mumbai, IN", destination: "Rotterdam, NL", status: "shipped", eta: "2026-04-12", carrier: "SeaRoute Ltd", weight: "5,100 kg" },
  { id: "SHP-003", origin: "São Paulo, BR", destination: "New York, US", status: "packed", eta: "2026-04-18", carrier: "AirCargo Express", weight: "800 kg" },
  { id: "SHP-004", origin: "Tokyo, JP", destination: "Sydney, AU", status: "ordered", eta: "2026-04-25", carrier: "PacificShip Inc", weight: "1,200 kg" },
  { id: "SHP-005", origin: "Berlin, DE", destination: "Dubai, AE", status: "shipped", eta: "2026-04-10", carrier: "EuroFreight AG", weight: "3,300 kg" },
  { id: "SHP-006", origin: "Chicago, US", destination: "London, UK", status: "delivered", eta: "2026-03-30", carrier: "TransAtlantic Co", weight: "950 kg" },
  { id: "SHP-007", origin: "Seoul, KR", destination: "Vancouver, CA", status: "shipped", eta: "2026-04-14", carrier: "KoreanShip Ltd", weight: "4,200 kg" },
  { id: "SHP-008", origin: "Bangkok, TH", destination: "Singapore, SG", status: "packed", eta: "2026-04-08", carrier: "AsiaFreight", weight: "1,800 kg" },
];

export const inventory = [
  { id: 1, name: "Electronic Components A", sku: "EC-001", quantity: 2450, status: "in-stock", category: "Electronics", warehouse: "WH-01" },
  { id: 2, name: "Steel Brackets B", sku: "SB-002", quantity: 120, status: "low", category: "Hardware", warehouse: "WH-02" },
  { id: 3, name: "Packaging Material C", sku: "PM-003", quantity: 0, status: "out", category: "Packaging", warehouse: "WH-01" },
  { id: 4, name: "Sensor Units D", sku: "SU-004", quantity: 890, status: "in-stock", category: "Electronics", warehouse: "WH-03" },
  { id: 5, name: "Rubber Seals E", sku: "RS-005", quantity: 45, status: "low", category: "Hardware", warehouse: "WH-02" },
  { id: 6, name: "Display Panels F", sku: "DP-006", quantity: 1200, status: "in-stock", category: "Electronics", warehouse: "WH-01" },
  { id: 7, name: "Copper Wiring G", sku: "CW-007", quantity: 3400, status: "in-stock", category: "Materials", warehouse: "WH-03" },
  { id: 8, name: "Thermal Paste H", sku: "TP-008", quantity: 0, status: "out", category: "Materials", warehouse: "WH-02" },
];

export const orders = [
  { id: "ORD-1001", customer: "Acme Corp", items: 12, total: "$24,500", status: "delivered", date: "2026-03-25", destination: "New York, US" },
  { id: "ORD-1002", customer: "TechVision Ltd", items: 5, total: "$8,200", status: "shipped", date: "2026-04-01", destination: "London, UK" },
  { id: "ORD-1003", customer: "GlobalTrade Inc", items: 28, total: "$52,000", status: "processing", date: "2026-04-03", destination: "Tokyo, JP" },
  { id: "ORD-1004", customer: "NextGen Solutions", items: 3, total: "$4,750", status: "pending", date: "2026-04-05", destination: "Berlin, DE" },
  { id: "ORD-1005", customer: "PrimeParts Co", items: 15, total: "$31,200", status: "shipped", date: "2026-03-30", destination: "Dubai, AE" },
  { id: "ORD-1006", customer: "AlphaWare Inc", items: 8, total: "$15,800", status: "delivered", date: "2026-03-22", destination: "Sydney, AU" },
  { id: "ORD-1007", customer: "SmartLogix", items: 20, total: "$42,100", status: "processing", date: "2026-04-04", destination: "Singapore, SG" },
];

export const notifications = [
  { id: 1, type: "warning", title: "Low Stock Alert", message: "Steel Brackets B is running low (120 units)", time: "5 min ago", read: false },
  { id: 2, type: "success", title: "Delivery Complete", message: "SHP-001 delivered to Los Angeles", time: "1 hour ago", read: false },
  { id: 3, type: "error", title: "Shipment Delayed", message: "SHP-005 delayed by 2 days due to weather", time: "2 hours ago", read: false },
  { id: 4, type: "info", title: "New Order", message: "ORD-1004 placed by NextGen Solutions", time: "3 hours ago", read: true },
  { id: 5, type: "warning", title: "Out of Stock", message: "Packaging Material C is out of stock", time: "5 hours ago", read: true },
  { id: 6, type: "success", title: "Delivery Complete", message: "SHP-006 delivered to London", time: "1 day ago", read: true },
];

export const activityFeed = [
  { id: 1, action: "Order placed", detail: "ORD-1004 by NextGen Solutions", time: "2 hours ago", icon: "package" },
  { id: 2, action: "Shipment delivered", detail: "SHP-001 to Los Angeles", time: "3 hours ago", icon: "check" },
  { id: 3, action: "Inventory updated", detail: "Electronic Components A (+500 units)", time: "5 hours ago", icon: "warehouse" },
  { id: 4, action: "Delay reported", detail: "SHP-005 delayed by weather", time: "6 hours ago", icon: "alert" },
  { id: 5, action: "Order shipped", detail: "ORD-1002 via TransAtlantic Co", time: "8 hours ago", icon: "truck" },
  { id: 6, action: "New supplier added", detail: "AsiaFreight registered", time: "1 day ago", icon: "user" },
];

export const chartData = {
  shipmentsByMonth: [
    { month: "Jan", shipped: 45, delivered: 42 },
    { month: "Feb", shipped: 52, delivered: 48 },
    { month: "Mar", shipped: 61, delivered: 55 },
    { month: "Apr", shipped: 38, delivered: 30 },
    { month: "May", shipped: 70, delivered: 62 },
    { month: "Jun", shipped: 58, delivered: 54 },
  ],
  ordersByCategory: [
    { category: "Electronics", value: 35 },
    { category: "Hardware", value: 25 },
    { category: "Materials", value: 20 },
    { category: "Packaging", value: 12 },
    { category: "Other", value: 8 },
  ],
};
