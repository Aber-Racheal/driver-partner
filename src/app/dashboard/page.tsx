"use client";

import Image from "next/image";
import Button from "../components/Buttons";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import { useState, useMemo } from "react";

import {
  Briefcase,
  Fuel,
  Wrench,
  ChevronRight,
} from "lucide-react";
import { quickCards, services, offers } from "@/data/dashboardData";

export default function Dashboard() {
  const [dashboardSearch, setDashboardSearch] = useState("");

  // Filter logic
  const filteredQuickCards = useMemo(() => {
    return quickCards.filter(card =>
      card.title.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
      card.description?.toLowerCase().includes(dashboardSearch.toLowerCase())
    );
  }, [dashboardSearch]);

  const filteredServices = useMemo(() => {
    return services.filter(service =>
      service.title.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
      service.description.toLowerCase().includes(dashboardSearch.toLowerCase())
    );
  }, [dashboardSearch]);

  const filteredOffers = useMemo(() => {
    return offers.filter(offer =>
      offer.title.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
      offer.description.toLowerCase().includes(dashboardSearch.toLowerCase())
    );
  }, [dashboardSearch]);

  return (
    <div className="flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <SideBar />

      <main className="ml-72 flex-1 min-h-screen">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 text-sm">Manage your services and opportunities</p>
            </div>

            <SearchBar
              value={dashboardSearch}
              onChange={(e) => setDashboardSearch(e.target.value)}
              onClear={() => setDashboardSearch("")}
              placeholder="Search services, offers, or gigs..."
            />
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* Quick Actions */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
            </div>

            {filteredQuickCards.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No quick actions match your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuickCards.slice(0, 3).map((card, index) => (
                  <div
                    key={card.id}
                    className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 ${card.bg}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>

                    <div className="relative p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className={`text-sm font-medium mb-2 ${card.textColor || "text-gray-700"}`}>
                            {card.title}
                          </p>
                          {card.value && (
                            <p className="text-2xl font-bold mb-1 text-gray-800">{card.value}</p>
                          )}
                          {card.nextReward && (
                            <p className="text-xs opacity-80 text-gray-600">
                              Next Reward: {card.nextReward}
                            </p>
                          )}
                          {card.description && (
                            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                              {card.description}
                            </p>
                          )}
                        </div>
                        <div className="ml-4">
                          <Button text={card.buttonText} variant={card.variant} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Services */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-800">Services</h2>
              </div>
              <button className="flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors">
                View more
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {filteredServices.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No services match your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.slice(0, 3).map((service, index) => {
                  let Icon;
                  let iconColor;
                  if (service.id === "jobs") {
                    Icon = Briefcase;
                    iconColor = "text-blue-500";
                  } else if (service.id === "fuel") {
                    Icon = Fuel;
                    iconColor = "text-orange-500";
                  } else if (service.id === "mechanics") {
                    Icon = Wrench;
                    iconColor = "text-green-500";
                  }

                  return (
                    <div
                      key={service.id}
                      className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 cursor-pointer"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="text-center">
                        {Icon && (
                          <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform ${iconColor}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                        )}
                        <h3 className="font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Special Offers */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-red-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-800">Special Offers</h2>
                <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-3 py-1 rounded-full animate-pulse">
                  Limited Time
                </span>
              </div>
              <button className="flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors">
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {filteredOffers.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No special offers match your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOffers.slice(0, 2).map((offer, index) => (
                  <div
                    key={offer.id}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                      <Image
                        src={offer.image}
                        alt={offer.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />

                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          50% OFF
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                          {offer.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {offer.description}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <div className="text-xs text-gray-500">
                            Valid until Dec 31, 2025
                          </div>
                          <Button text="Claim Now" variant="primary" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
