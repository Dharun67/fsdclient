import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Mail, Lock, User, ArrowRight, Eye, EyeOff, Shield, Package, Building2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const roles = [
  { value: "admin",       icon: Shield,       color: "border-violet-400 bg-violet-50 dark:bg-violet-950/40" },
  { value: "supplier",    icon: Package,      color: "border-blue-400 bg-blue-50 dark:bg-blue-950/40" },
  { value: "distributor", icon: Building2,    color: "border-amber-400 bg-amber-50 dark:bg-amber-950/40" },
  { value: "retailer",    icon: ShoppingCart, color: "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" },
];

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSignup, setIsSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState("retailer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");

  const reset = () => { setName(""); setEmail(""); setPassword(""); setCompany(""); setError(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) { setError("Full name is required"); setLoading(false); return; }
        if (!email.trim()) { setError("Email is required"); setLoading(false); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters"); setLoading(false); return; }

        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role: selectedRole,
            company: company.trim()
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Registration failed');
          setLoading(false);
          return;
        }

        localStorage.setItem('cf_token', data.token);
        localStorage.setItem('cf_user', JSON.stringify(data.user));

        toast({ title: `Account created! Welcome, ${data.user.name} 🎉`, description: `Signed in as ${data.user.role}` });
        setLoading(false);
        navigate('/', { replace: true });

      } else {
        if (!email.trim()) { setError("Email is required"); setLoading(false); return; }
        if (!password) { setError("Password is required"); setLoading(false); return; }

        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Login failed');
          setLoading(false);
          return;
        }

        localStorage.setItem('cf_token', data.token);
        localStorage.setItem('cf_user', JSON.stringify(data.user));

        toast({ title: `Welcome back, ${data.user.name}! 👋`, description: `Signed in as ${data.user.role}` });
        setLoading(false);
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Connection failed. Please check if backend is running.');
      setLoading(false);
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
              <p className="text-white font-bold text-lg">TrackFlow</p>
              <p className="text-white/50 text-xs">Supply Chain Management</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight">Full visibility.<br />Zero surprises.</h2>
              <p className="text-white/70 mt-3 text-sm leading-relaxed max-w-xs">
                Real-time shipment tracking, intelligent inventory alerts, and AI-powered insights.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ v: "Real-time", l: "Tracking" }, { v: "AI", l: "Insights" }, { v: "Secure", l: "Data" }].map((s) => (
                <div key={s.l} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                  <p className="text-xl font-bold text-white">{s.v}</p>
                  <p className="text-white/60 text-[11px] mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-xs">© 2026 TrackFlow. All rights reserved.</p>
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
            <span className="font-bold text-lg">TrackFlow</span>
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
              {isSignup ? "Sign up to start managing your supply chain" : "Sign in to your TrackFlow dashboard"}
            </p>
          </div>

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
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="pl-9 h-10" autoFocus />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Email Address <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="pl-9 h-10" autoComplete="email" autoFocus={!isSignup} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Password <span className="text-red-500">*</span></Label>
                <span className="text-xs text-muted-foreground">Min. 6 characters</span>
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
                      placeholder="Your Company Name" className="pl-9 h-10" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Your Role <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r) => (
                      <button key={r.value} type="button" onClick={() => setSelectedRole(r.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${selectedRole === r.value ? r.color : "border-border hover:border-primary/30"}`}>
                        <r.icon className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-semibold capitalize">{r.value}</span>
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
