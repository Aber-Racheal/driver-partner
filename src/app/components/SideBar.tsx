// components/SideBar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gigs } from "@/data/gigsData";
import { useNotifications } from "../contexts/NotificationsContext";
import {
  Bell,
  Briefcase,
  ChevronRight,
  Gift,
  LayoutDashboard,
  Wrench,
  LogOut,
  Settings,
} from "lucide-react";
import { user } from "@/data/dashboardData";

const SideBar = () => {
  const pathname = usePathname();
  const { unreadCount } = useNotifications(); // Get unread count from context

  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
      badge: null
    },
    {
      icon: Briefcase,
      label: "Gigs",
      href: "/gigs",
      badge: gigs.length
    },
    {
      icon: Wrench,
      label: "Garages/Mechanics",
      href: "/garages",
      badge: null
    },
    {
      icon: Gift,
      label: "Special Offers",
      href: "/offers",
      badge: "New"
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/notifications",
      badge: unreadCount > 0 ? unreadCount : null // Use context unreadCount
    },
    // Removed Settings from main navigation
  ];

  // Function to check if a navigation item is active
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-gradient-to-b from-purple-800 via-purple-700 to-purple-900 text-white flex flex-col shadow-2xl">
      {/* Header Section */}
      <div className="p-6 pb-4">
        {/* Profile */}
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 shadow-xl mb-4">
            <Image
              src={user.profilePic}
              alt="Profile"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold mb-1">Hello, {user.name}!</h1>
            <p className="text-purple-200 text-xs">Welcome back</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4">
        <div className="space-y-1">
          {navigationItems.map((item, index) => {
            const active = isActive(item.href);
            return (
              <Link
                key={index}
                href={item.href}
                className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/10 ${
                  active 
                    ? "bg-white/15 shadow-md border-l-2 border-white" 
                    : "border-l-2 border-transparent"
                }`}
              >
                <item.icon 
                  className={`w-5 h-5 flex-shrink-0 ${
                    active ? "text-white" : "text-purple-200"
                  }`} 
                />
                <span className={`flex-1 font-medium text-sm ${
                  active ? "text-white" : "text-purple-100"
                }`}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className={`text-xs px-2 py-1 rounded-full min-w-6 text-center ${
                    typeof item.badge === 'string' && item.badge === 'New'
                      ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                      : "bg-white/20 text-white"
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-transform ${
                  active ? "translate-x-0" : "-translate-x-1 group-hover:translate-x-0"
                }`} />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 pt-2 border-t border-white/10">
        {/* Quick Actions */}
        <div className="space-y-1 mb-4">
          <Link 
            href="/settings"
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-sm ${
              pathname === "/settings" 
                ? "bg-white/15 text-white" 
                : "text-purple-100 hover:bg-white/10"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <button className="w-full flex items-center gap-3 p-2 rounded-lg text-purple-100 hover:bg-white/10 transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      
        {/* App Version */}
        {/* <div className="text-center pt-2 border-t border-white/10">
          <p className="text-purple-300 text-xs">v1.0.0</p>
        </div> */}
      </div>
    </aside>
  );
};

export default SideBar;