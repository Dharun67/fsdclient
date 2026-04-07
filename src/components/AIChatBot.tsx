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
  const [isOpen, setIsOpen] = useState(false);
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
      const lowerQuery = trimmed.toLowerCase();
      let responseText = "";

      // Greeting patterns
      if (/^(hi|hello|hey|hola|greetings|good morning|good afternoon|good evening)$/i.test(lowerQuery)) {
        responseText = "Hello! 👋 I'm here to help with your supply chain. I can show you:\n\n📦 Orders & their status\n🚚 Shipment tracking\n📋 Inventory levels\n⚠️ Low stock alerts\n\nWhat would you like to check?";
      }
      // How are you / casual chat
      else if (/how are (you|u)|how's it going|what's up|wassup/i.test(lowerQuery)) {
        responseText = "I'm doing great, thanks for asking! 😊\n\nI'm ready to help you manage your supply chain. Would you like to:\n• Check your orders\n• Track shipments\n• Review inventory\n• See low stock items";
      }
      // Create/add order
      else if (/create|add|new|make|place/i.test(lowerQuery) && /order/i.test(lowerQuery)) {
        responseText = "To create a new order, go to the Orders page and click the 'Create Order' button. You can:\n\n✓ Add products\n✓ Set quantities\n✓ Choose suppliers\n✓ Track delivery\n\nWould you like to see your existing orders first?";
      }
      // Order queries
      else if (/order|purchase/i.test(lowerQuery)) {
        if (appData.orders.length === 0) {
          responseText = "You don't have any orders yet. 📦\n\nTo get started:\n1. Go to the Orders page\n2. Click 'Create Order'\n3. Add products and submit\n\nI'll help you track them once created!";
        } else {
          const pending = appData.orders.filter((o: any) => o.status === 'pending').length;
          const processing = appData.orders.filter((o: any) => o.status === 'processing').length;
          const delivered = appData.orders.filter((o: any) => o.status === 'delivered').length;
          const cancelled = appData.orders.filter((o: any) => o.status === 'cancelled').length;
          
          responseText = `📦 You have ${appData.orders.length} total order${appData.orders.length > 1 ? 's' : ''}:\n\n`;
          if (pending > 0) responseText += `⏳ ${pending} pending\n`;
          if (processing > 0) responseText += `⚙️ ${processing} processing\n`;
          if (delivered > 0) responseText += `✅ ${delivered} delivered\n`;
          if (cancelled > 0) responseText += `❌ ${cancelled} cancelled\n`;
          
          const recentOrders = appData.orders.slice(0, 3);
          if (recentOrders.length > 0) {
            responseText += `\nRecent orders:${recentOrders.map((o: any) => `\n• ${o.orderId || o._id}: ${o.status.toUpperCase()}`).join('')}`;
          }
        }
      }
      // Shipment/tracking queries
      else if (/shipment|shipping|deliver|track|transit/i.test(lowerQuery)) {
        if (appData.shipments.length === 0) {
          responseText = "No active shipments found. 🚚\n\nShipments appear here once orders are dispatched. Check your Orders page to see if any orders are ready for shipment.";
        } else {
          const inTransit = appData.shipments.filter((s: any) => s.status === 'in-transit').length;
          const delivered = appData.shipments.filter((s: any) => s.status === 'delivered').length;
          const pending = appData.shipments.filter((s: any) => s.status === 'pending').length;
          
          responseText = `🚚 You have ${appData.shipments.length} shipment${appData.shipments.length > 1 ? 's' : ''}:\n\n`;
          if (inTransit > 0) responseText += `🚛 ${inTransit} in transit\n`;
          if (delivered > 0) responseText += `✅ ${delivered} delivered\n`;
          if (pending > 0) responseText += `⏳ ${pending} pending\n`;
          
          const recentShipments = appData.shipments.slice(0, 3);
          if (recentShipments.length > 0) {
            responseText += `\nRecent shipments:${recentShipments.map((s: any) => `\n• ${s.trackingId || s._id}: ${s.status.toUpperCase()}`).join('')}`;
          }
        }
      }
      // Low stock specific
      else if (/low stock|restock|running low|need.*stock/i.test(lowerQuery)) {
        const lowStock = appData.inventory.filter((i: any) => i.quantity < (i.threshold || 10));
        if (lowStock.length === 0) {
          responseText = "✅ Great news! All items are well-stocked.\n\nNo low stock alerts at the moment. Your inventory levels look healthy!";
        } else {
          responseText = `⚠️ ${lowStock.length} item${lowStock.length > 1 ? 's' : ''} need restocking:\n${lowStock.map((i: any) => `\n• ${i.name || i.sku}: ${i.quantity} units (min: ${i.threshold || 10})`).join('')}\n\nConsider placing orders soon to avoid stockouts!`;
        }
      }
      // Inventory/stock queries
      else if (/inventory|stock|product|item/i.test(lowerQuery)) {
        if (appData.inventory.length === 0) {
          responseText = "Your inventory is empty. 📋\n\nAdd products to start tracking stock levels. Go to the Inventory page to get started!";
        } else {
          const lowStock = appData.inventory.filter((i: any) => i.quantity < (i.threshold || 10)).length;
          const totalItems = appData.inventory.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0);
          
          responseText = `📋 Inventory Summary:\n\n• ${appData.inventory.length} unique products\n• ${totalItems} total items in stock`;
          if (lowStock > 0) {
            responseText += `\n• ⚠️ ${lowStock} low stock alert${lowStock > 1 ? 's' : ''}`;
          }
          
          const topItems = appData.inventory.slice(0, 3);
          if (topItems.length > 0) {
            responseText += `\n\nTop items:${topItems.map((i: any) => `\n• ${i.name || i.sku}: ${i.quantity} units`).join('')}`;
          }
        }
      }
      // Summary/overview
      else if (/summary|overview|status|dashboard|everything/i.test(lowerQuery)) {
        responseText = `📊 Supply Chain Overview:\n\n📦 Orders: ${appData.orders.length}\n🚚 Shipments: ${appData.shipments.length}\n📋 Inventory: ${appData.inventory.length} products\n\n✅ All data synced with backend!`;
      }
      // Help/capabilities
      else if (/help|what can you|capabilities|features/i.test(lowerQuery)) {
        responseText = "I can help you with:\n\n📦 Orders - View status, track pending orders\n🚚 Shipments - Track deliveries in real-time\n📋 Inventory - Check stock levels\n⚠️ Alerts - Get low stock warnings\n📊 Summary - Overall supply chain status\n\nJust ask me anything about your supply chain!";
      }
      // Thank you
      else if (/thank|thanks|thx|appreciate/i.test(lowerQuery)) {
        responseText = "You're welcome! 😊 I'm here anytime you need help with your supply chain. Feel free to ask me anything!";
      }
      // Default fallback
      else {
        responseText = "I can help you with:\n\n📦 Orders status\n🚚 Shipment tracking\n📋 Inventory levels\n⚠️ Low stock alerts\n\nTry: 'Show my orders' or 'Check inventory'";
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
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-slate-950 shadow-2xl transition hover:bg-sky-400 hover:scale-110"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-md rounded-[32px] border border-slate-700 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl text-slate-100">
      <div className="mb-4 rounded-3xl bg-slate-900/90 p-4 shadow-inner shadow-slate-950/40">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">Smart Assistant</p>
            <h2 className="text-xl font-semibold text-white">Supply Chain Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-2xl bg-sky-500 px-3 py-1 text-xs font-semibold text-slate-950">
              {appData.orders.length + appData.shipments.length + appData.inventory.length} items
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-800 transition"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
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
      )}
    </>
  );
};

export default AIChatBot;
