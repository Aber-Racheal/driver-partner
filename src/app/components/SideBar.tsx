"use client";

import Image from "next/image";
import { gigs } from "@/data/gigsData"; // 👈 Import the gigs data

import {
  Bell,
  Briefcase,
  ChevronRight,
  Fuel,
  Gift,
  LayoutDashboard,
  Star,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { user } from "@/data/dashboardData";

const SideBar = () => {
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
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Briefcase, label: "Gigs", badge: gigs.length },
            { icon: Fuel, label: "Fuel" },
            { icon: Wrench, label: "Garages/Mechanics" },
            { icon: Gift, label: "Special Offers", badge: "New" },
            { icon: Bell, label: "Notifications", badge: user.notifications },
          ].map((item, index) => (
            <a
              key={index}
              href="#"
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 ${
                item.active ? "bg-white/15 shadow-lg" : ""
              }`}
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
