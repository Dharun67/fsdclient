import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface UserData {
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface OrderData {
  orderId: string;
  status: string;
  totalAmount?: number;
  createdAt: string;
}

interface ShipmentData {
  trackingId: string;
  status: string;
  origin?: string;
  destination?: string;
  createdAt: string;
}

interface InventoryData {
  sku: string;
  name: string;
  quantity: number;
  threshold?: number;
}

interface ActivityData {
  action: string;
  details: string;
  timestamp: string;
}

interface ReportData {
  user: UserData;
  orders: OrderData[];
  shipments: ShipmentData[];
  inventory: InventoryData[];
  activities: ActivityData[];
}

export const generatePDFReport = (data: ReportData) => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(14, 165, 233); // Sky blue
  doc.text('TrackFlow Supply Chain Report', 105, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, yPosition, { align: 'center' });
  
  yPosition += 15;

  // User Information Section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('User Information', 14, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: ${data.user.name}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Email: ${data.user.email}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Role: ${data.user.role.toUpperCase()}`, 14, yPosition);
  yPosition += 6;
  if (data.user.createdAt) {
    doc.text(`Member Since: ${new Date(data.user.createdAt).toLocaleDateString()}`, 14, yPosition);
    yPosition += 6;
  }

  yPosition += 10;

  // Orders Section
  if (data.orders.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Orders Summary (${data.orders.length} total)`, 14, yPosition);
    yPosition += 8;

    const orderStats = {
      pending: data.orders.filter(o => o.status === 'pending').length,
      processing: data.orders.filter(o => o.status === 'processing').length,
      delivered: data.orders.filter(o => o.status === 'delivered').length,
      cancelled: data.orders.filter(o => o.status === 'cancelled').length,
    };

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Pending: ${orderStats.pending} | Processing: ${orderStats.processing} | Delivered: ${orderStats.delivered} | Cancelled: ${orderStats.cancelled}`, 14, yPosition);
    yPosition += 8;

    autoTable(doc, {
      startY: yPosition,
      head: [['Order ID', 'Status', 'Amount', 'Date']],
      body: data.orders.map(order => [
        order.orderId,
        order.status.toUpperCase(),
        order.totalAmount ? `$${order.totalAmount.toFixed(2)}` : 'N/A',
        new Date(order.createdAt).toLocaleDateString(),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [14, 165, 233] },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('No orders found', 14, yPosition);
    yPosition += 10;
  }

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Shipments Section
  if (data.shipments.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Shipments Summary (${data.shipments.length} total)`, 14, yPosition);
    yPosition += 8;

    const shipmentStats = {
      pending: data.shipments.filter(s => s.status === 'pending').length,
      inTransit: data.shipments.filter(s => s.status === 'in-transit').length,
      delivered: data.shipments.filter(s => s.status === 'delivered').length,
    };

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Pending: ${shipmentStats.pending} | In Transit: ${shipmentStats.inTransit} | Delivered: ${shipmentStats.delivered}`, 14, yPosition);
    yPosition += 8;

    autoTable(doc, {
      startY: yPosition,
      head: [['Tracking ID', 'Status', 'Origin', 'Destination', 'Date']],
      body: data.shipments.map(shipment => [
        shipment.trackingId,
        shipment.status.toUpperCase(),
        shipment.origin || 'N/A',
        shipment.destination || 'N/A',
        new Date(shipment.createdAt).toLocaleDateString(),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [14, 165, 233] },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('No shipments found', 14, yPosition);
    yPosition += 10;
  }

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Inventory Section
  if (data.inventory.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Inventory Summary (${data.inventory.length} products)`, 14, yPosition);
    yPosition += 8;

    const totalStock = data.inventory.reduce((sum, item) => sum + item.quantity, 0);
    const lowStock = data.inventory.filter(item => item.quantity < (item.threshold || 10)).length;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Total Stock: ${totalStock} units | Low Stock Alerts: ${lowStock}`, 14, yPosition);
    yPosition += 8;

    autoTable(doc, {
      startY: yPosition,
      head: [['SKU', 'Product Name', 'Quantity', 'Threshold', 'Status']],
      body: data.inventory.map(item => [
        item.sku,
        item.name,
        item.quantity.toString(),
        (item.threshold || 10).toString(),
        item.quantity < (item.threshold || 10) ? '⚠️ LOW' : '✓ OK',
      ]),
      theme: 'striped',
      headStyles: { fillColor: [14, 165, 233] },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('No inventory items found', 14, yPosition);
    yPosition += 10;
  }

  // Check if we need a new page for activities
  if (yPosition > 250 || data.activities.length > 0) {
    doc.addPage();
    yPosition = 20;
  }

  // Activity History Section
  if (data.activities.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Activity History (${data.activities.length} recent activities)`, 14, yPosition);
    yPosition += 8;

    autoTable(doc, {
      startY: yPosition,
      head: [['Action', 'Details', 'Timestamp']],
      body: data.activities.slice(0, 20).map(activity => [
        activity.action,
        activity.details,
        new Date(activity.timestamp).toLocaleString(),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [14, 165, 233] },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 80 },
        2: { cellWidth: 50 },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('No activity history found', 14, yPosition);
  }

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | TrackFlow Supply Chain Management`,
      105,
      290,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `TrackFlow_Report_${data.user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
