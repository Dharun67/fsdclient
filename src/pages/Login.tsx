import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left illustration panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--primary)/0.8),hsl(var(--primary)))]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center space-y-6"
        >
          <div className="h-24 w-24 mx-auto rounded-2xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center">
            <Truck className="h-12 w-12 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground">ChainFlow</h2>
          <p className="text-primary-foreground/80 text-lg max-w-sm">
            Streamline your supply chain operations with real-time tracking and intelligent insights.
          </p>
          <div className="flex items-center justify-center gap-8 pt-4">
            {["284 Shipments", "98% On-time", "12 Partners"].map((s) => (
              <div key={s} className="text-center">
                <p className="text-sm font-medium text-primary-foreground/90">{s}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="flex items-center gap-2 lg:hidden">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">ChainFlow</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isSignup ? "Get started with ChainFlow" : "Sign in to your dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="John Doe" className="pl-9" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="name@company.com" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" className="pl-9" />
              </div>
            </div>
            {isSignup && (
              <div className="space-y-2">
                <Label>Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="retailer">Retailer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button type="submit" className="w-full">
              {isSignup ? "Create Account" : "Sign In"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary font-medium hover:underline"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
