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
      text: "👋 Hello! I'm your AI supply chain assistant powered by Gemini. I can help you with orders, shipments, inventory, and more. Ask me anything!",
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
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const context = `You are a helpful supply chain assistant. Here's the current user's data:

Orders (${appData.orders.length} total): ${JSON.stringify(appData.orders.slice(0, 10))}
Shipments (${appData.shipments.length} total): ${JSON.stringify(appData.shipments.slice(0, 10))}
Inventory (${appData.inventory.length} total): ${JSON.stringify(appData.inventory.slice(0, 10))}

User question: ${trimmed}

Provide a helpful, concise answer based on the data above. If the data doesn't contain the answer, suggest what the user can do. Keep responses under 150 words.`;

      const result = await model.generateContent(context);
      const response = await result.response;
      const assistantText = response.text();

      const assistantMessage: Message = { role: "assistant", text: assistantText };
      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const assistantMessage: Message = { 
        role: "assistant", 
        text: "I'm having trouble connecting to the AI service. Please check your API key configuration or try again later." 
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
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">Gemini AI</p>
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
