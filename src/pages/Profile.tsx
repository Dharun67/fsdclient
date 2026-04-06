import { User, Mail, Shield, Settings, Key } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
            JD
          </div>
          <div>
            <h2 className="font-semibold text-lg">John Doe</h2>
            <p className="text-sm text-muted-foreground">Admin • ChainFlow</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input defaultValue="John Doe" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input defaultValue="john@chainflow.com" className="pl-9" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input defaultValue="Admin" disabled className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <div className="relative">
                <Settings className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input defaultValue="ChainFlow Inc." className="pl-9" />
              </div>
            </div>
          </div>
          <Button>Save Changes</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-lg p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Key className="h-4 w-4" /> Change Password
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button variant="outline">Update Password</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-lg p-6">
        <h3 className="font-semibold mb-4">Preferences</h3>
        <div className="space-y-4">
          {[
            { label: "Email Notifications", desc: "Receive email alerts for shipment updates" },
            { label: "Low Stock Alerts", desc: "Get notified when inventory is running low" },
            { label: "Order Confirmations", desc: "Receive confirmation for new orders" },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
