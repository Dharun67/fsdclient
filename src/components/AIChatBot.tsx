import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRole } from "@/hooks/use-role";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

// ── Supply chain data context ────────────────────────────
const supplyChainData = {
  orders: [
    { id: "ORD-R-201", product: "Cotton Fabric x10m", from: "KovaiDist",   total: "₹4,500",  status: "delivered",  date: "2026-07-15" },
    { id: "ORD-R-202", product: "Silk Saree x5",      from: "MaduraiDist", total: "₹14,000", status: "shipped",    date: "2026-07-18" },
    { id: "ORD-R-203", product: "Linen Shirt x20",    from: "KovaiDist",   total: "₹13,600", status: "processing", date: "2026-07-20" },
    { id: "ORD-S-101", product: "Cotton Fabric x100m",from: "Priya Textiles", total: "₹45,000", status: "delivered", date: "2026-07-10" },
    { id: "ORD-S-102", product: "Polyester Roll x50m",from: "Erode Mills",    total: "₹16,000", status: "shipped",   date: "2026-07-14" },
    { id: "ORD-2041",  product: "Cotton Fabric x50",  from: "KovaiDist",   total: "₹42,000", status: "pending",    date: "2026-07-21" },
    { id: "ORD-2042",  product: "Silk Saree x30",     from: "MaduraiDist", total: "₹18,500", status: "processing", date: "2026-07-22" },
  ],
  shipments: [
    { id: "SHP-TN-041", product: "Cotton Fabric x50m", from: "KovaiDist",    to: "Chennai Store",  status: "delivered", eta: "2026-07-18", vehicle: "TN-38-AB-1234" },
    { id: "SHP-TN-042", product: "Silk Saree x10",     from: "MaduraiDist",  to: "Tirupur Shop",   status: "shipped",   eta: "2026-07-22", vehicle: "TN-11-CD-5678" },
    { id: "SHP-TN-043", product: "Linen Shirt x30",    from: "KovaiDist",    to: "Vellore Mart",   status: "packed",    eta: "2026-07-24", vehicle: "TN-04-EF-9012" },
    { id: "SHP-TN-088", product: "Silk Saree x5",      from: "MaduraiDist",  to: "Chennai Store",  status: "shipped",   eta: "2026-07-22", vehicle: "TN-22-GH-3456" },
    { id: "SHP-TN-089", product: "Linen Shirt x20",    from: "KovaiDist",    to: "Tirupur Shop",   status: "packed",    eta: "2026-07-24", vehicle: "TN-09-IJ-7890" },
  ],
  inventory: [
    { sku: "CF-001", name: "Cotton Fabric",  qty: 850, status: "in-stock", warehouse: "WH-KOV-01" },
    { sku: "SS-002", name: "Silk Saree",     qty: 45,  status: "low",      warehouse: "WH-KOV-01" },
    { sku: "LS-003", name: "Linen Shirt",    qty: 0,   status: "out",      warehouse: "WH-KOV-02" },
    { sku: "PR-004", name: "Polyester Roll", qty: 320, status: "in-stock", warehouse: "WH-KOV-02" },
  ],
  products: [
    { id: "PRD-001", name: "Cotton Fabric", supplier: "Priya Textiles", location: "Erode, TN",       price: "₹450/m" },
    { id: "PRD-002", name: "Silk Saree",    supplier: "Kanchipuram Co", location: "Kanchipuram, TN", price: "₹2,800" },
    { id: "PRD-003", name: "Polyester Roll",supplier: "Erode Mills",    location: "Erode, TN",       price: "₹320/m" },
  ],
};

const roleContext: Record<string, string> = {
  admin:       "You are an AI assistant for an Admin of e-Track supply chain system. You have full access to all orders, shipments, inventory, users, and analytics. Help with system monitoring, dispute resolution, fraud alerts, and product tracking.",
  supplier:    "You are an AI assistant for a Supplier on e-Track. Help with managing products, checking incoming orders from distributors, inventory stock levels, shipment status, and low stock alerts.",
  distributor: "You are an AI assistant for a Distributor on e-Track. Help with orders placed to suppliers, warehouse inventory, dispatching shipments to retailers, and managing returns.",
  retailer:    "You are an AI assistant for a Retailer on e-Track. Help with placing orders from distributors, tracking deliveries, managing store inventory, recording sales, and product origin tracking.",
};

type Message = { role: "user" | "bot"; text: string };

const quickPrompts: Record<string, string[]> = {
  admin:       ["Show all pending orders", "Any fraud alerts?", "Track SHP-TN-042", "Low stock items"],
  supplier:    ["Check my incoming orders", "Low stock alerts", "Track SHP-TN-041", "Order ORD-2041 status"],
  distributor: ["Orders from suppliers", "Warehouse stock levels", "Track SHP-TN-043", "Any returns pending?"],
  retailer:    ["Track my order ORD-R-202", "Check inventory alerts", "Where is SHP-TN-088?", "Product origin PRD-001"],
};

export default function AIChatBot() {
  const { role, user } = useRole();
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: `Hi ${user?.name?.split(" ")[0] || "there"}! 👋 I'm your e-Track AI assistant. I can help you track orders, shipments, check inventory, and answer supply chain questions. What would you like to know?` },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const buildSystemPrompt = () => {
    const ctx = roleContext[role] || roleContext.retailer;
    return `${ctx}

You have access to the following live supply chain data:

ORDERS: ${JSON.stringify(supplyChainData.orders, null, 2)}

SHIPMENTS: ${JSON.stringify(supplyChainData.shipments, null, 2)}

INVENTORY: ${JSON.stringify(supplyChainData.inventory, null, 2)}

PRODUCTS: ${JSON.stringify(supplyChainData.products, null, 2)}

Rules:
- When user asks about an order ID (e.g. ORD-R-202), find it in the data and give full details.
- When user asks about a shipment ID (e.g. SHP-TN-042) or vehicle number (e.g. TN-11-CD-5678), find and report status, ETA, route.
- When user asks about a product ID (e.g. PRD-001), give origin, supplier, price details.
- When user asks about inventory, report stock levels and alerts.
- Be concise, friendly, and use emojis where appropriate.
- Always respond based on the user's role: ${role}.
- If data is not found, say so clearly and suggest what IDs are available.
- Format responses with clear sections using line breaks.`;
  };

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat  = model.startChat({
        history: [],
        generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
      });
      const systemPrompt = buildSystemPrompt();
      const result = await chat.sendMessage(`${systemPrompt}\n\nUser (${role}): ${msg}`);
      const response = result.response.text();
      setMessages(prev => [...prev, { role: "bot", text: response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "bot", text: "⚠️ Sorry, I couldn't connect to AI. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const roleColors: Record<string, string> = {
    admin:       "from-violet-600 to-violet-700",
    supplier:    "from-blue-600 to-blue-700",
    distributor: "from-amber-600 to-amber-700",
    retailer:    "from-emerald-600 to-emerald-700",
  };

  const gradientClass = roleColors[role] || roleColors.retailer;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br ${gradientClass} shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}
          >
            <MessageCircle className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-5rem)] flex flex-col rounded-2xl shadow-2xl border border-border bg-background overflow-hidden"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${gradientClass} px-4 py-3 flex items-center justify-between shrink-0`}>
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">e-Track AI</p>
                  <p className="text-white/70 text-[10px] capitalize">{role} Assistant · Powered by Gemini</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <button onClick={() => setOpen(false)} className="ml-2 text-white/70 hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold ${msg.role === "user" ? `bg-gradient-to-br ${gradientClass}` : "bg-muted border border-border"}`}>
                    {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5 text-foreground" />}
                  </div>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? `bg-gradient-to-br ${gradientClass} text-white rounded-tr-sm`
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-full bg-muted border border-border flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {(quickPrompts[role] || quickPrompts.retailer).map(p => (
                  <button key={p} onClick={() => sendMessage(p)} className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-muted hover:bg-primary/10 hover:border-primary/40 transition-colors text-muted-foreground hover:text-primary">
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border shrink-0">
              <div className="flex gap-2 items-center">
                <input
                  className="flex-1 h-9 px-3 rounded-xl border border-input bg-muted text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                  placeholder="Ask about orders, shipments, stock..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className={`h-9 w-9 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0`}
                >
                  {loading ? <Loader2 className="h-4 w-4 text-white animate-spin" /> : <Send className="h-4 w-4 text-white" />}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1.5">Powered by Google Gemini · e-Track AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
