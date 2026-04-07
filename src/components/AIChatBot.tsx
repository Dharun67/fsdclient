import { useMemo, useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const suggestions = [
  "Show low stock items",
  "What are my pending orders?",
  "Track my shipments",
  "Show inventory summary",
];

const AIChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "👋 Hello! I'm your supply chain assistant. I can help you with orders, shipments, inventory, and more. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [appData, setAppData] = useState<any>({ orders: [], shipments: [], inventory: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('cf_token');
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = 'https://chainflowbackend.onrender.com/api';

        const [ordersRes, shipmentsRes, inventoryRes] = await Promise.all([
          fetch(`${baseUrl}/orders`, { headers }),
          fetch(`${baseUrl}/shipments`, { headers }),
          fetch(`${baseUrl}/inventory`, { headers }),
        ]);

        const orders = ordersRes.ok ? await ordersRes.json() : [];
        const shipments = shipmentsRes.ok ? await shipmentsRes.json() : [];
        const inventory = inventoryRes.ok ? await inventoryRes.json() : [];

        setAppData({ orders, shipments, inventory });
      } catch (error) {
        console.error('Failed to fetch app data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", text: trimmed };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Simple rule-based responses using actual data
      const lowerQuery = trimmed.toLowerCase();
      let responseText = "";

      if (lowerQuery.includes('order')) {
        if (appData.orders.length === 0) {
          responseText = "You don't have any orders yet. Create your first order to get started!";
        } else {
          const pending = appData.orders.filter((o: any) => o.status === 'pending').length;
          const delivered = appData.orders.filter((o: any) => o.status === 'delivered').length;
          responseText = `You have ${appData.orders.length} total orders:\n- ${pending} pending\n- ${delivered} delivered\n\nRecent orders: ${appData.orders.slice(0, 3).map((o: any) => `\n• ${o.orderId || o._id}: ${o.status}`).join('')}`;
        }
      } else if (lowerQuery.includes('shipment') || lowerQuery.includes('track')) {
        if (appData.shipments.length === 0) {
          responseText = "No active shipments found. Your shipments will appear here once orders are dispatched.";
        } else {
          const inTransit = appData.shipments.filter((s: any) => s.status === 'in-transit').length;
          responseText = `You have ${appData.shipments.length} shipments:\n- ${inTransit} in transit\n\nRecent: ${appData.shipments.slice(0, 3).map((s: any) => `\n• ${s.trackingId || s._id}: ${s.status}`).join('')}`;
        }
      } else if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
        if (appData.inventory.length === 0) {
          responseText = "Your inventory is empty. Add products to start tracking stock levels.";
        } else {
          const lowStock = appData.inventory.filter((i: any) => i.quantity < (i.threshold || 10)).length;
          const totalItems = appData.inventory.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0);
          responseText = `Inventory Summary:\n- ${appData.inventory.length} products\n- ${totalItems} total items\n- ${lowStock} low stock alerts\n\nTop items: ${appData.inventory.slice(0, 3).map((i: any) => `\n• ${i.name || i.sku}: ${i.quantity} units`).join('')}`;
        }
      } else if (lowerQuery.includes('low stock')) {
        const lowStock = appData.inventory.filter((i: any) => i.quantity < (i.threshold || 10));
        if (lowStock.length === 0) {
          responseText = "Great news! All items are well-stocked. No low stock alerts.";
        } else {
          responseText = `⚠️ ${lowStock.length} items need restocking:\n${lowStock.map((i: any) => `\n• ${i.name || i.sku}: ${i.quantity} units (threshold: ${i.threshold || 10})`).join('')}`;
        }
      } else if (lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
        responseText = `📊 Supply Chain Overview:\n\n📦 Orders: ${appData.orders.length}\n🚚 Shipments: ${appData.shipments.length}\n📋 Inventory: ${appData.inventory.length} products\n\nEverything is synced with your backend!`;
      } else {
        responseText = "I can help you with:\n• Orders status\n• Shipment tracking\n• Inventory levels\n• Low stock alerts\n\nTry asking: 'Show my orders' or 'Check inventory'";
      }

      const assistantMessage: Message = { role: "assistant", text: responseText };
      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      console.error('Chatbot Error:', error);
      const assistantMessage: Message = { 
        role: "assistant", 
        text: "Sorry, I encountered an error. Please try again." 
      };
      setMessages((current) => [...current, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  const messageList = useMemo(
    () =>
      messages.map((message, index) => (
        <div
          key={index}
          className={`mb-3 flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`max-w-[85%] rounded-[28px] p-3 text-sm leading-6 whitespace-pre-wrap shadow-sm ${
              message.role === "assistant"
                ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-slate-100"
                : "bg-sky-500 text-slate-950"
            }`}
          >
            {message.text}
          </div>
        </div>
      )),
    [messages],
  );

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md rounded-[32px] border border-slate-700 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl text-slate-100">
      <div className="mb-4 rounded-3xl bg-slate-900/90 p-4 shadow-inner shadow-slate-950/40">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">Smart Assistant</p>
            <h2 className="text-xl font-semibold text-white">Supply Chain Assistant</h2>
          </div>
          <span className="rounded-2xl bg-sky-500 px-3 py-1 text-xs font-semibold text-slate-950">
            {appData.orders.length + appData.shipments.length + appData.inventory.length} items
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Ask me about your orders, shipments, inventory, and supply chain operations.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestion(suggestion)}
            disabled={loading}
            className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-slate-100 transition hover:border-sky-500 hover:text-white disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="mb-4 max-h-72 space-y-2 overflow-y-auto pr-1 pb-1 text-sm">{messageList}</div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
          className="min-h-[48px] flex-1 rounded-2xl border border-slate-700 bg-slate-900/95 px-4 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
    </div>
  );
};

export default AIChatBot;
