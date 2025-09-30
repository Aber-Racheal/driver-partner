"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gigs } from "@/data/gigsData";

import {
  Bell,
  Briefcase,
  ChevronRight,
  Gift,
  LayoutDashboard,
  Star,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { user } from "@/data/dashboardData";

const SideBar = () => {
  const pathname = usePathname();

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
      badge: user.notifications 
    },
  ];

  // Function to check if a navigation item is active
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="space-y-0 fixed left-0 top-0 w-72 h-screen bg-gradient-to-b from-purple-800 via-purple-700 to-purple-900 text-white flex flex-col shadow-2xl">
      <div className="p-6">
        {/* Profile */}
        <div className="flex flex-col items-center mb-8 relative">
          <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl"></div>
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-xl backdrop-blur-sm bg-white/10">
            <Image
              src={user.profilePic}
              alt="Profile"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
          <div className="text-center mt-4 relative z-10">
            <h1 className="text-xl font-bold">Hello, {user.name}!</h1>
            <p className="text-purple-200 text-sm">Welcome back</p>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-300" />
            <p className="text-xs text-purple-200">Earnings</p>
            <p className="text-sm font-bold">$2,450</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1 text-yellow-300" />
            <p className="text-xs text-purple-200">Rating</p>
            <p className="text-sm font-bold">4.9★</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-6 pb-6">
        <div className="-space-y-2">
          {navigationItems.map((item, index) => {
            const active = isActive(item.href);
            return (
              <Link
                key={index}
                href={item.href}
                className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 ${
                  active 
                    ? "bg-white/15 shadow-lg border-l-4 border-white" 
                    : "border-l-4 border-transparent"
                }`}
              >
                <item.icon 
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    active ? "text-white" : "text-purple-200"
                  }`} 
                />
                <span className={`flex-1 font-medium ${
                  active ? "text-white" : "text-purple-100"
                }`}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className={`text-xs px-2 py-1 rounded-full shadow-sm ${
                    typeof item.badge === 'string' && item.badge === 'New'
                      ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                      : "bg-white/20 text-white"
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-4 h-4 transition-all ${
                  active 
                    ? "opacity-100 translate-x-0" 
                    : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                }`} />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section - Optional Tupoints Integration */}
      <div className="px-6 pb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Tupoints</p>
              <p className="text-xs text-purple-200">12,500 pts • Gold Tier</p>
            </div>
            <Link 
              href="/tupoints"
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;