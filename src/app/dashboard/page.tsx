"use client";

import Image from "next/image";
import Button from "../components/Buttons";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Briefcase,
  Fuel,
  Wrench,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Coins,
  
} from "lucide-react";
import { quickCards, services } from "@/data/dashboardData";
import { fuelOffers, garageOffers } from "@/data/offers";
import { FuelOffer, GarageOffer } from "../types/offers";
import { tupointsProfile } from "@/data/tuPoints";

export default function Dashboard() {
  const router = useRouter();
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [dynamicOffers, setDynamicOffers] = useState<(FuelOffer | GarageOffer)[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper functions to check offer type
  const isFuelOffer = (offer: FuelOffer | GarageOffer): offer is FuelOffer => {
    return (offer as FuelOffer).partnerName !== undefined;
  };

  // Format expiry date to be more readable
  const formatExpiryDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Calculate days remaining until expiry
  const getDaysRemaining = (dateString: string): number => {
    try {
      const expiryDate = new Date(dateString);
      const today = new Date();
      const timeDiff = expiryDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysRemaining;
    } catch {
      return 0;
    }
  };

  // Handle offer click navigation
  const handleOfferClick = (offer: FuelOffer | GarageOffer) => {
    if (offer.isQualified) {
      router.push(`/offers?claim=${offer.id}`);
    } else {
      router.push(`/offers?view=${offer.id}`);
    }
  };

  // Handle image error with proper typing
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/images/default-offer.jpg";
  };

  // Handle Tupoints navigation
  const handleTupointsClick = () => {
    router.push('/tupoints');
  };

  useEffect(() => {
    // Combine and prepare dynamic offers
    const prepareOffers = async () => {
      setLoading(true);
      try {
        // Add a small delay to see the loading spinner (remove this in production)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const combinedOffers = [...fuelOffers, ...garageOffers];
        
        // Sort by featured first, then by discount
        const sortedOffers = combinedOffers.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.discount - a.discount;
        });

        setDynamicOffers(sortedOffers);
      } catch {
        console.error("Error preparing offers");
      } finally {
        setLoading(false);
      }
    };

    prepareOffers();
  }, []);

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
    return dynamicOffers.filter(offer => {
      const searchText = isFuelOffer(offer) 
        ? (offer.partnerName?.toLowerCase() || "") + " " + offer.description.toLowerCase()
        : (offer.garageName?.toLowerCase() || "") + " " + offer.description.toLowerCase();
      
      return searchText.includes(dashboardSearch.toLowerCase());
    });
  }, [dashboardSearch, dynamicOffers]);

  // Get offer display data
  const getOfferDisplayData = (offer: FuelOffer | GarageOffer) => {
    if (isFuelOffer(offer)) {
      return {
        title: offer.partnerName || "Fuel Offer",
        description: offer.description,
        image: offer.image || offer.partnerLogo || "/images/default-offer.jpg",
        type: "fuel" as const,
      };
    } else {
      return {
        title: offer.garageName || "Garage Offer",
        description: offer.description,
        image: offer.image || offer.garageLogo || "/images/default-offer.jpg",
        type: "garage" as const,
      };
    }
  };

  // Calculate active Tupoints vouchers
  // const activeTupointsVouchers = redeemedTupointsVouchers.filter(
  //   voucher => voucher.status === 'active'
  // ).length;

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDashboardSearch(e.target.value)}
              onClear={() => setDashboardSearch("")}
              placeholder="Search services, offers, or gigs..."
            />
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* Quick Actions - UPDATED WITH REAL TUPOINTS DATA */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
            </div>

            {filteredQuickCards.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No quick actions match your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Points Card - UPDATED WITH REAL DATA */}
                <div
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-r from-yellow-400 to-orange-500"
                  onClick={handleTupointsClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>

                  <div className="relative p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-2 text-white">
                          Tupoints Balance
                        </p>
                        <p className="text-2xl font-bold mb-1 text-white">
                          {tupointsProfile.currentPoints.toLocaleString()} pts
                        </p>
                        
                        <p className="text-xs text-white mt-2 leading-relaxed">
                          Redeem points for fuel, garage services, and loan benefits
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <Coins className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other quick cards */}
                {filteredQuickCards.filter(card => card.id !== 'points').slice(0, 2).map((card, index) => (
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

          {/* Special Offers - DYNAMIC */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-red-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-800">Special Offers</h2>
                <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-3 py-1 rounded-full animate-pulse">
                  Limited Time
                </span>
              </div>
              <button 
                onClick={() => router.push('/offers')}
                className="flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
                <span className="ml-3 text-gray-600">Loading offers...</span>
              </div>
            ) : filteredOffers.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No special offers match your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOffers.slice(0, 2).map((offer, index) => {
                  const displayData = getOfferDisplayData(offer);
                  const isFuel = isFuelOffer(offer);
                  const daysRemaining = getDaysRemaining(offer.expiryDate);
                  const formattedExpiry = formatExpiryDate(offer.expiryDate);
                  
                  return (
                    <div
                      key={offer.id}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                      style={{ animationDelay: `${index * 200}ms` }}
                      onClick={() => handleOfferClick(offer)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                        <Image
                          src={displayData.image}
                          alt={displayData.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          onError={handleImageError}
                        />

                        <div className="absolute top-4 right-4 z-20">
                          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {offer.discount}% OFF
                          </div>
                        </div>

                        <div className="absolute top-4 left-4 z-20">
                          {offer.isQualified ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>

                        {offer.isFeatured && (
                          <div className="absolute top-12 left-4 z-20">
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              FEATURED
                            </span>
                          </div>
                        )}

                        {/* Days remaining badge */}
                        <div className="absolute bottom-4 left-4 z-20">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            daysRemaining <= 7 
                              ? "bg-red-500 text-white" 
                              : daysRemaining <= 30 
                                ? "bg-orange-500 text-white"
                                : "bg-green-500 text-white"
                          }`}>
                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                              {displayData.title}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isFuel 
                                ? "bg-orange-100 text-orange-700" 
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {isFuel ? "Fuel" : "Garage"}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {displayData.description}
                          </p>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-xs text-gray-500">
                              Save up to UGX {offer.maxSavings.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              Expires: {formattedExpiry}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-xs text-gray-500">
                              {offer.isQualified ? (
                                <span className="text-green-600 font-semibold">You Qualify!</span>
                              ) : (
                                <span className="text-red-600 font-semibold">Not Eligible</span>
                              )}
                            </div>
                            <Button 
                              text={offer.isQualified ? "Claim Now" : "View Details"} 
                              variant={offer.isQualified ? "primary" : "secondary"}
                              onClick={() => handleOfferClick(offer)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className={`absolute inset-0 bg-gradient-to-r ${
                        isFuel 
                          ? "from-purple-500/0 to-orange-500/0 group-hover:from-purple-500/5 group-hover:to-orange-500/5" 
                          : "from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5"
                      } transition-all duration-300 pointer-events-none`}></div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}