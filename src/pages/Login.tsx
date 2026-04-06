import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Mail, Lock, User, ArrowRight, Eye, EyeOff, Shield, Package, Building2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

/* ── Demo accounts (no backend needed) ─────────────────── */
const DEMO_USERS = [
  { email: "admin@chainflow.com",        password: "admin123",    name: "Arjun Murugan",   role: "Admin",       company: "ChainFlow TN" },
  { email: "supplier@chainflow.com",     password: "supplier123", name: "Priya Selvam",    role: "Supplier",    company: "Chennai Freight Co" },
  { email: "distributor@chainflow.com",  password: "dist123",     name: "Karthik Rajan",   role: "Distributor", company: "Coimbatore Logistics" },
  { email: "retailer@chainflow.com",     password: "retail123",   name: "Deepa Venkatesh", role: "Retailer",    company: "Madurai Traders" },
];

/* In-memory user store for new signups */
const getUsers = () => {
  try { return JSON.parse(localStorage.getItem("cf_users") || "[]"); } catch { return []; }
};
const saveUsers = (users: any[]) => localStorage.setItem("cf_users", JSON.stringify(users));

const roles = [
  { value: "Admin",       icon: Shield,       color: "border-violet-400 bg-violet-50 dark:bg-violet-950/40" },
  { value: "Supplier",    icon: Package,      color: "border-blue-400 bg-blue-50 dark:bg-blue-950/40" },
  { value: "Distributor", icon: Building2,    color: "border-amber-400 bg-amber-50 dark:bg-amber-950/40" },
  { value: "Retailer",    icon: ShoppingCart, color: "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" },
];

export default function Login() {
  const navigate      = useNavigate();
  const { toast }     = useToast();

  const [isSignup, setIsSignup]         = useState(false);
  const [showPass, setShowPass]         = useState(false);
  const [selectedRole, setSelectedRole] = useState("Retailer");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [name,     setName]             = useState("");
  const [email,    setEmail]            = useState("");
  const [password, setPassword]         = useState("");
  const [company,  setCompany]          = useState("");

  const reset = () => { setName(""); setEmail(""); setPassword(""); setCompany(""); setError(""); };

  const fillDemo = (u: typeof DEMO_USERS[0]) => {
    setEmail(u.email); setPassword(u.password); setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      if (!name.trim())        { setError("Full name is required"); return; }
      if (!email.trim())       { setError("Email is required"); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters"); return; }

      // Check duplicate
      const allUsers = [...DEMO_USERS, ...getUsers()];
      if (allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        setError("An account with this email already exists. Please sign in.");
        return;
      }

      setLoading(true);
      await new Promise((r) => setTimeout(r, 600)); // simulate network

      const newUser = { email: email.toLowerCase(), password, name: name.trim(), role: selectedRole, company: company.trim() };
      saveUsers([...getUsers(), newUser]);

      localStorage.setItem("cf_token", btoa(JSON.stringify({ email: newUser.email, exp: Date.now() + 7 * 86400000 })));
      localStorage.setItem("cf_user",  JSON.stringify(newUser));

      toast({ title: `Account created! Welcome, ${newUser.name} 🎉`, description: `Signed in as ${newUser.role}` });
      setLoading(false);
      navigate("/", { replace: true });

    } else {
      if (!email.trim()) { setError("Email is required"); return; }
      if (!password)     { setError("Password is required"); return; }

      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));

      const allUsers = [...DEMO_USERS, ...getUsers()];
      const user = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

      if (!user) {
        setLoading(false);
        setError("No account found with this email. Please sign up first.");
        return;
      }
      if (user.password !== password) {
        setLoading(false);
        setError("Incorrect password. Please try again.");
        return;
      }

      localStorage.setItem("cf_token", btoa(JSON.stringify({ email: user.email, exp: Date.now() + 7 * 86400000 })));
      localStorage.setItem("cf_user",  JSON.stringify(user));

      toast({ title: `Welcome back, ${user.name}! 👋`, description: `Signed in as ${user.role}` });
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-primary">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.12) 0%, transparent 70%)" }} />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/5" />

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col justify-between p-12 w-full"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">ChainFlow</p>
              <p className="text-white/50 text-xs">Supply Chain OS</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight">Full visibility.<br />Zero surprises.</h2>
              <p className="text-white/70 mt-3 text-sm leading-relaxed max-w-xs">
                Real-time shipment tracking, intelligent inventory alerts, and multi-role collaboration.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ v: "284", l: "Shipments" }, { v: "98%", l: "On-time" }, { v: "12", l: "Partners" }].map((s) => (
                <div key={s.l} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                  <p className="text-xl font-bold text-white">{s.v}</p>
                  <p className="text-white/60 text-[11px] mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Demo Accounts</p>
              <div className="space-y-2">
                {DEMO_USERS.map((u) => (
                  <button key={u.email} onClick={() => { setIsSignup(false); fillDemo(u); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-left">
                    <div>
                      <p className="text-white text-xs font-semibold">{u.name}</p>
                      <p className="text-white/50 text-[10px]">{u.email}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">{u.role}</span>
                  </button>
                ))}
              </div>
              <p className="text-white/30 text-[10px] mt-2 text-center">Click any account to auto-fill credentials</p>
            </div>
          </div>

          <p className="text-white/30 text-xs">© 2026 ChainFlow Inc. All rights reserved.</p>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile brand */}
          <div className="flex items-center gap-2 lg:hidden mb-8">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">ChainFlow</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button type="button" onClick={() => { setIsSignup(false); reset(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${!isSignup ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Sign In
            </button>
            <button type="button" onClick={() => { setIsSignup(true); reset(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${isSignup ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Create Account
            </button>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight">
              {isSignup ? "Create your account" : "Welcome back 👋"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isSignup ? "Sign up to start managing your supply chain" : "Sign in to your ChainFlow dashboard"}
            </p>
          </div>

          {/* Mobile demo accounts */}
          {!isSignup && (
            <div className="mb-5 p-3 rounded-xl bg-muted/50 border border-border/60 lg:hidden">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Quick Demo</p>
              <div className="grid grid-cols-2 gap-1.5">
                {DEMO_USERS.map((u) => (
                  <button key={u.email} type="button" onClick={() => fillDemo(u)}
                    className="px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/40 text-xs font-semibold text-left transition-all">
                    {u.role}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">Passwords: admin123 / supplier123 / dist123 / retail123</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl px-4 py-3">
              <span className="h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0">!</span>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Full Name <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Arjun Murugan" className="pl-9 h-10" autoFocus />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Email Address <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@chainflow.com" className="pl-9 h-10" autoComplete="email" autoFocus={!isSignup} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Password <span className="text-red-500">*</span></Label>
                {!isSignup && <span className="text-xs text-muted-foreground">Min. 6 characters</span>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="pl-9 pr-10 h-10"
                  autoComplete={isSignup ? "new-password" : "current-password"} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignup && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Company (optional)</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={company} onChange={(e) => setCompany(e.target.value)}
                      placeholder="ChainFlow TN Pvt Ltd" className="pl-9 h-10" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Your Role <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r) => (
                      <button key={r.value} type="button" onClick={() => setSelectedRole(r.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${selectedRole === r.value ? r.color : "border-border hover:border-primary/30"}`}>
                        <r.icon className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-semibold">{r.value}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isSignup ? "Creating account..." : "Signing in..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isSignup ? "Create Account" : "Sign In to Dashboard"}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={() => { setIsSignup(!isSignup); reset(); }}
              className="text-primary font-semibold hover:underline">
              {isSignup ? "Sign in" : "Sign up free"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
