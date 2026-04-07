import {
  LayoutDashboard, MapPin, Package, ClipboardList, User, LogOut,
  Truck, Users, BarChart2, ShieldAlert, Store, Receipt, RotateCcw,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/use-role";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navByRole: Record<string, { title: string; url: string; icon: any }[]> = {
  admin: [
    { title: "Dashboard",    url: "/",           icon: LayoutDashboard },
    { title: "Users",        url: "/users",       icon: Users },
    { title: "Orders",       url: "/orders",      icon: ClipboardList },
    { title: "Shipments",    url: "/shipments",   icon: MapPin },
    { title: "Products",     url: "/products",    icon: Package },
    { title: "Analytics",    url: "/analytics",   icon: BarChart2 },
    { title: "Alerts",       url: "/alerts",      icon: ShieldAlert },
    { title: "Profile",      url: "/profile",     icon: User },
  ],
  supplier: [
    { title: "Dashboard",    url: "/",            icon: LayoutDashboard },
    { title: "My Products",  url: "/products",    icon: Package },
    { title: "Inventory",    url: "/inventory",   icon: Store },
    { title: "Orders",       url: "/orders",      icon: ClipboardList },
    { title: "Shipments",    url: "/shipments",   icon: Truck },
    { title: "Profile",      url: "/profile",     icon: User },
  ],
  distributor: [
    { title: "Dashboard",  url: "/",                   icon: LayoutDashboard },
    { title: "Orders",     url: "/dist/orders",        icon: ClipboardList },
    { title: "Inventory",  url: "/dist/inventory",     icon: Package },
    { title: "Shipments",  url: "/dist/shipments",     icon: Truck },
    { title: "Returns",    url: "/dist/returns",       icon: RotateCcw },
    { title: "Profile",    url: "/profile",            icon: User },
  ],
  retailer: [
    { title: "Dashboard",  url: "/",                   icon: LayoutDashboard },
    { title: "My Orders",  url: "/retail/orders",      icon: ClipboardList },
    { title: "Inventory",  url: "/retail/inventory",   icon: Package },
    { title: "Sales",      url: "/retail/sales",       icon: Receipt },
    { title: "Track",      url: "/retail/track",       icon: MapPin },
    { title: "Profile",    url: "/profile",            icon: User },
  ],
};

const roleLabel: Record<string, string> = {
  admin: "Admin Panel",
  supplier: "Supplier Portal",
  distributor: "Distributor Hub",
  retailer: "Retailer Store",
};

export function AppSidebar() {
  const { state }  = useSidebar();
  const navigate   = useNavigate();
  const { role, user } = useRole();
  const collapsed  = state === "collapsed";
  const navItems   = navByRole[role] || navByRole.retailer;

  const handleSignOut = () => {
    localStorage.removeItem("cf_token");
    localStorage.removeItem("cf_user");
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-6">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-sidebar-primary" />
                <div>
                  <p className="text-sm font-bold text-sidebar-foreground leading-tight">e-Track</p>
                  <p className="text-[10px] text-sidebar-foreground/50">{roleLabel[role]}</p>
                </div>
              </div>
            )}
            {collapsed && <Truck className="h-6 w-6 text-sidebar-primary" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="mb-3 px-2 py-2 rounded-lg bg-sidebar-accent/50">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.name || "User"}</p>
            <p className="text-[10px] text-sidebar-foreground/50 capitalize">{role}</p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2.5 rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {!collapsed && <span>Sign Out</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
