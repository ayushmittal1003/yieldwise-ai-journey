import { Home, Users, CreditCard, ArrowUpDown, CheckCircle, Send, Download } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home, current: true },
  { name: "My Accounts", href: "/accounts", icon: CreditCard },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Transactions", href: "/transactions", icon: ArrowUpDown },
  { name: "Approvals", href: "/approvals", icon: CheckCircle, badge: "15" },
  { name: "Send Money", href: "/send", icon: Send },
  { name: "Collect Money", href: "/collect", icon: Download },
];

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-transfi-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-transfi-sidebar-text font-semibold text-lg">TransFi</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-transfi-sidebar-active text-white"
                  : "text-transfi-sidebar-text hover:bg-transfi-sidebar-hover hover:text-white"
              )
            }
          >
            <item.icon
              className="mr-3 h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
            {item.name}
            {item.badge && (
              <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}