"use client";

import { useState, useMemo, useEffect } from "react";
import { FuelOffer, GarageOffer, Offer } from "../types/offers";
import Image from "next/image";
import {
    Fuel,
    Wrench,
    Calendar,
    MapPin,
    CheckCircle2,
    XCircle,
    Gift,
    Award,
    Copy,
    Check,
    AlertCircle,
    Target,
    Zap,
    Search,
    X,
    Star,
    ArrowLeft,
    ArrowRightLeft
} from "lucide-react";
import Link from "next/link";

import { riderStats, fuelOffers, garageOffers, redeemedFuelVouchers, redeemedGarageVouchers } from "@/data/offers";
import SearchBar from "../components/SearchBar";
import SideBar from "../components/SideBar";
import { ExchangeOffer } from "../types/exchange";
import { exchangeOffers } from "@/data/exchange";

export default function OffersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [offerType, setOfferType] = useState<"fuel" | "garage" | "exchange">("fuel");
    const [viewMode, setViewMode] = useState("offers");
    const [filterCategory, setFilterCategory] = useState("all");
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [savedVouchers, setSavedVouchers] = useState<string[]>([]);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const currentOffers = offerType === "fuel" ? fuelOffers :
        offerType === "garage" ? garageOffers :
            exchangeOffers;

    // Helper functions with proper typing
    const isFuelOffer = (offer: Offer): offer is FuelOffer => {
        return (offer as FuelOffer).partnerName !== undefined && 
               (offer as FuelOffer).locations !== undefined;
    };

    const isGarageOffer = (offer: Offer): offer is GarageOffer => {
        return (offer as GarageOffer).garageName !== undefined && 
               (offer as GarageOffer).serviceType !== undefined;
    };

    const isExchangeOffer = (offer: Offer): offer is ExchangeOffer => {
        return (offer as ExchangeOffer).bikeModel !== undefined;
    };

    // REAL-TIME STATS CALCULATION
    const realTimeStats = useMemo(() => {
        // Calculate total savings from redeemed vouchers
        const totalSavings = [...redeemedFuelVouchers, ...redeemedGarageVouchers]
            .reduce((total, voucher) => total + (voucher.amountSaved || 0), 0);

        // Calculate active vouchers (not expired and not used)
        const activeVouchers = [...redeemedFuelVouchers, ...redeemedGarageVouchers]
            .filter(voucher => voucher.status === "active").length;

        // Calculate redeemed offers count
        const redeemedOffers = [...redeemedFuelVouchers, ...redeemedGarageVouchers]
            .filter(voucher => voucher.status === "used").length;

        // Calculate qualified offers count
        const qualifiedOffers = [...fuelOffers, ...garageOffers, ...exchangeOffers]
            .filter(offer => offer.isQualified).length;

        // Calculate available offers by type
        const availableFuelOffers = fuelOffers.filter(offer => offer.isQualified).length;
        const availableGarageOffers = garageOffers.filter(offer => offer.isQualified).length;
        const availableExchangeOffers = exchangeOffers.filter(offer => offer.isQualified).length;

        // Calculate potential savings from qualified offers
        const potentialSavings = [...fuelOffers, ...garageOffers, ...exchangeOffers]
            .filter(offer => offer.isQualified)
            .reduce((total, offer) => total + offer.maxSavings, 0);

        return {
            totalSavings,
            activeVouchers,
            redeemedOffers,
            qualifiedOffers,
            availableFuelOffers,
            availableGarageOffers,
            availableExchangeOffers,
            potentialSavings,
            // Keep streak from original data or calculate based on user activity
            currentStreak: riderStats.currentStreak,
            ridesThisMonth: riderStats.ridesThisMonth,
            ridesNeededForBonus: riderStats.ridesNeededForBonus
        };
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const claimOfferId = searchParams.get('claim');
        const viewOfferId = searchParams.get('view');

        if (claimOfferId) {
            const offerToClaim = [...fuelOffers, ...garageOffers, ...exchangeOffers].find(
                offer => offer.id === claimOfferId
            );
            if (offerToClaim && offerToClaim.isQualified) {
                setSelectedOffer(offerToClaim);
                setViewMode("voucher");
                if (isFuelOffer(offerToClaim)) setOfferType('fuel');
                else if (isGarageOffer(offerToClaim)) setOfferType('garage');
                else if (isExchangeOffer(offerToClaim)) setOfferType('exchange');
            }
        } else if (viewOfferId) {
            const offerToView = [...fuelOffers, ...garageOffers, ...exchangeOffers].find(
                offer => offer.id === viewOfferId
            );
            if (offerToView) {
                setSelectedOffer(offerToView);
                setViewMode("details");
                if (isFuelOffer(offerToView)) setOfferType('fuel');
                else if (isGarageOffer(offerToView)) setOfferType('garage');
                else if (isExchangeOffer(offerToView)) setOfferType('exchange');
            }
        }
    }, []);

    const filteredOffers = useMemo(() => {
        return currentOffers.filter((offer: Offer) => {
            let searchText = "";

            if (offerType === "fuel" && isFuelOffer(offer)) {
                searchText = offer.partnerName || "";
            } else if (offerType === "garage" && isGarageOffer(offer)) {
                searchText = offer.garageName || "";
            } else if (offerType === "exchange" && isExchangeOffer(offer)) {
                searchText = offer.bikeModel || "";
            }

            const matchesSearch = searchText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                offer.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === "all" || offer.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, filterCategory, currentOffers, offerType]);

    const handleViewDetails = (offer: Offer) => {
        setSelectedOffer(offer);
        setViewMode("details");
    };

    const handleRedeemVoucher = (offer: Offer) => {
        setSelectedOffer(offer);
        setViewMode("voucher");
    };

    const handleSaveVoucher = (offerId: string) => {
        setSavedVouchers(prev =>
            prev.includes(offerId)
                ? prev.filter(id => id !== offerId)
                : [...prev, offerId]
        );
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleBackToOffers = () => {
        setViewMode("offers");
        setSelectedOffer(null);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <SideBar />

            <main className="flex-1 lg:ml-72">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div className="mb-3 lg:mb-0">
                            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Partner Offers
                            </h1>
                            <p className="text-gray-600 text-xs mt-1 max-w-2xl">
                                Exclusive discounts on fuel and garage services from our trusted partners
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setViewMode("offers")}
                                className={`px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-semibold text-sm transition-all flex-1 lg:flex-none ${viewMode === "offers"
                                    ? "bg-purple-600 text-white shadow"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                All Offers
                            </button>
                            <button
                                onClick={() => setViewMode("redeemed")}
                                className={`px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-semibold text-sm transition-all flex-1 lg:flex-none ${viewMode === "redeemed"
                                    ? "bg-purple-600 text-white shadow"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                My Vouchers
                            </button>
                        </div>
                    </div>

                    {/* REAL-TIME STATS DASHBOARD */}
                    {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-4">
                        <div className="bg-white rounded-lg p-3 shadow border border-purple-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Total Savings</p>
                                    <p className="text-lg font-bold text-purple-600">
                                        {realTimeStats.totalSavings.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">UGX</p>
                                </div>
                                <TrendingUp className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Active Vouchers</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        {realTimeStats.activeVouchers}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {realTimeStats.qualifiedOffers} available
                                    </p>
                                </div>
                                <Gift className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow border border-orange-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Current Streak</p>
                                    <p className="text-lg font-bold text-orange-600">
                                        {realTimeStats.currentStreak}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">days</p>
                                </div>
                                <Flame className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow border border-pink-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Redeemed Offers</p>
                                    <p className="text-lg font-bold text-pink-600">
                                        {realTimeStats.redeemedOffers}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {realTimeStats.potentialSavings.toLocaleString()} UGX potential
                                    </p>
                                </div>
                                <Award className="w-6 h-6 text-pink-500" />
                            </div>
                        </div>
                    </div> */}

                    {/* Additional Stats Row */}
                    {/* <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 mb-6">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 shadow border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Fuel Offers</p>
                                    <p className="text-lg font-bold text-purple-600">
                                        {realTimeStats.availableFuelOffers} / {fuelOffers.length}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Available</p>
                                </div>
                                <Fuel className="w-5 h-5 text-purple-500" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 shadow border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Garage Offers</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        {realTimeStats.availableGarageOffers} / {garageOffers.length}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Available</p>
                                </div>
                                <Wrench className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 shadow border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Exchange Offers</p>
                                    <p className="text-lg font-bold text-green-600">
                                        {realTimeStats.availableExchangeOffers} / {exchangeOffers.length}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Available</p>
                                </div>
                                <ArrowRightLeft className="w-5 h-5 text-green-500" />
                            </div>
                        </div>
                    </div> */}

                    {/* Main Content Area */}
   {/* Main Content Area */}
                    {viewMode === "offers" && (
                        <>
                            {/* Offer Type Selector */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 lg:gap-3 mb-4">
                                <button
                                    onClick={() => setOfferType("fuel")}
                                    className={`flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2 rounded-lg font-bold text-sm transition-all w-full sm:w-auto ${offerType === "fuel"
                                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow scale-105"
                                        : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                                        }`}
                                >
                                    <Fuel className="w-4 h-4" />
                                    Fuel Offers
                                    <span className="bg-white/20 px-1 py-0.5 rounded-full text-xs">
                                        {fuelOffers.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setOfferType("garage")}
                                    className={`flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2 rounded-lg font-bold text-sm transition-all w-full sm:w-auto ${offerType === "garage"
                                        ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow scale-105"
                                        : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                                        }`}
                                >
                                    <Wrench className="w-4 h-4" />
                                    Garage Offers
                                    <span className="bg-white/20 px-1 py-0.5 rounded-full text-xs">
                                        {garageOffers.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setOfferType("exchange")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all w-full sm:w-auto ${offerType === "exchange"
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow scale-105"
                                        : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                                        }`}
                                >
                                    <ArrowRightLeft className="w-4 h-4" />
                                    Bike Exchange
                                    <span className="bg-white/20 px-1 py-0.5 rounded-full text-xs">
                                        {exchangeOffers.length}
                                    </span>
                                </button>
                            </div>

                            {/* Search and Filter */}
                            <div className="mb-4 flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <SearchBar
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={
                                            offerType === "fuel" ? "Search fuel offers..." :
                                                offerType === "garage" ? "Search garage offers..." :
                                                    "Search bike exchange offers..."
                                        }
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        >
                                            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                                    {["all", "premium", "standard", "limited"].map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setFilterCategory(category)}
                                            className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-semibold text-xs capitalize transition-all whitespace-nowrap ${filterCategory === category
                                                ? "bg-purple-600 text-white shadow"
                                                : "bg-white text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Offers Grid */}
                            {offerType === "exchange" ? (
                                // Special rendering for exchange offers
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                                    {filteredOffers.map((offer: Offer) => (
                                        <div
                                            key={offer.id}
                                            className="bg-white rounded-lg shadow overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ring-1 ring-green-500"
                                        >
                                            {offer.isFeatured && (
                                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-1 text-xs font-semibold">
                                                    ⭐ FEATURED UPGRADE
                                                </div>
                                            )}
                                            <div className="p-3">
                                                <div className="relative w-full h-20 mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                    <ArrowRightLeft className="w-8 h-8 text-green-500" />
                                                </div>

                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-bold text-sm">
                                                        {isExchangeOffer(offer) ? `${offer.bikeBrand} ${offer.bikeModel}` : ''}
                                                    </h3>
                                                    {offer.isQualified ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                    )}
                                                </div>

                                                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                                                    {offer.description}
                                                </p>

                                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 mb-3">
                                                    <p className="text-lg font-bold text-green-600 text-center">
                                                        {offer.discount}% OFF
                                                    </p>
                                                    <p className="text-xs text-gray-600 text-center mt-1">
                                                        Save up to UGX {offer.maxSavings.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>Expires: {offer.expiryDate}</span>
                                                </div>

                                                <div className="flex gap-1">
                                                    <Link
                                                        href="/exchange"
                                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1.5 rounded-lg transition-all text-xs text-center"
                                                    >
                                                        View Details
                                                    </Link>
                                                    {offer.isQualified ? (
                                                        <Link
                                                            href="/exchange"
                                                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-1.5 rounded-lg transition-all shadow text-xs text-center"
                                                        >
                                                            Learn More
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="flex-1 bg-gray-300 text-gray-500 font-semibold py-1.5 rounded-lg cursor-not-allowed text-xs"
                                                        >
                                                            Not Eligible
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Original fuel and garage offers
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                                    {filteredOffers.length > 0 ? (
                                        filteredOffers.map((offer: Offer) => (
                                            <div
                                                key={offer.id}
                                                className={`bg-white rounded-lg shadow overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${offer.isFeatured ? `ring-1 ${offerType === 'fuel' ? 'ring-purple-500' : 'ring-blue-500'}` : ""
                                                    }`}
                                            >
                                                {offer.isFeatured && (
                                                    <div className={`bg-gradient-to-r ${offerType === 'fuel' ? 'from-purple-600 to-pink-600' : 'from-blue-600 to-cyan-600'
                                                        } text-white text-center py-1 text-xs font-semibold`}>
                                                        ⭐ FEATURED
                                                    </div>
                                                )}
                                                <div className="p-3">
                                                    <div className="relative w-full h-20 mb-3 rounded-lg overflow-hidden bg-gray-100">
                                                        <Image
                                                            // FIXED: Added proper fallbacks for undefined properties
                                                            src={offerType === 'fuel'
                                                                ? (offer as FuelOffer).partnerLogo ?? '/default-logo.png'
                                                                : offerType === 'garage'
                                                                    ? (offer as GarageOffer).garageLogo ?? '/default-logo.png'
                                                                    : '/default-logo.png'}
                                                            alt={offerType === 'fuel'
                                                                ? (offer as FuelOffer).partnerName ?? 'Partner'
                                                                : offerType === 'garage'
                                                                    ? (offer as GarageOffer).garageName ?? 'Garage'
                                                                    : 'Offer'}
                                                            width={600}
                                                            height={80}
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-bold text-sm">
                                                            {offerType === 'fuel' && isFuelOffer(offer)
                                                                ? (offer as FuelOffer).partnerName ?? 'Partner'
                                                                : offerType === 'garage' && isGarageOffer(offer)
                                                                    ? (offer as GarageOffer).garageName ?? 'Garage'
                                                                    : ''}
                                                        </h3>
                                                        {offer.isQualified ? (
                                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                        )}
                                                    </div>

                                                    {isGarageOffer(offer) && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                                                            <MapPin className="w-3 h-3" />
                                                            <span>{(offer as GarageOffer).location}</span>
                                                        </div>
                                                    )}

                                                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                                                        {offer.description}
                                                    </p>

                                                    <div className={`bg-gradient-to-r ${offerType === 'fuel' ? 'from-purple-50 to-pink-50' : 'from-blue-50 to-cyan-50'
                                                        } rounded-lg p-2 mb-3`}>
                                                        <p className={`text-lg font-bold ${offerType === 'fuel' ? 'text-purple-600' : 'text-blue-600'
                                                            } text-center`}>
                                                            {offer.discount}% OFF
                                                        </p>
                                                        <p className="text-xs text-gray-600 text-center mt-1">
                                                            Save up to UGX {offer.maxSavings.toLocaleString()}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>Expires: {offer.expiryDate}</span>
                                                    </div>

                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleViewDetails(offer)}
                                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1.5 rounded-lg transition-all text-xs"
                                                        >
                                                            Details
                                                        </button>
                                                        {offer.isQualified ? (
                                                            <button
                                                                onClick={() => handleRedeemVoucher(offer)}
                                                                className={`flex-1 bg-gradient-to-r ${offerType === 'fuel'
                                                                    ? 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                                                    : 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                                                                    } text-white font-semibold py-1.5 rounded-lg transition-all shadow text-xs`}
                                                            >
                                                                Redeem
                                                            </button>
                                                        ) : (
                                                            <button
                                                                disabled
                                                                className="flex-1 bg-gray-300 text-gray-500 font-semibold py-1.5 rounded-lg cursor-not-allowed text-xs"
                                                            >
                                                                Not Eligible
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-8">
                                            <Gift className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-600 text-sm mb-2">No offers found matching your search</p>
                                            <button
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setFilterCategory("all");
                                                }}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {filteredOffers.length === 0 && offerType !== "exchange" && (
                                <div className="text-center py-8">
                                    <Gift className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-600 text-sm mb-2">No offers found matching your search</p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setFilterCategory("all");
                                        }}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Details View */}
                    {viewMode === "details" && selectedOffer && (
                        <div className="max-w-4xl mx-auto">
                            <button
                                onClick={handleBackToOffers}
                                className="mb-4 flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Offers
                            </button>

                            <div className="bg-white rounded-lg shadow p-4">
                                <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        // FIXED: Added proper fallbacks for undefined properties
                                        src={offerType === 'fuel'
                                            ? (selectedOffer as FuelOffer).partnerLogo ?? '/default-logo.png'
                                            : offerType === 'garage'
                                                ? (selectedOffer as GarageOffer).garageLogo ?? '/default-logo.png'
                                                : (selectedOffer as ExchangeOffer).images?.[0] ?? '/default-logo.png'}
                                        alt={offerType === 'fuel'
                                            ? (selectedOffer as FuelOffer).partnerName ?? 'Partner'
                                            : offerType === 'garage'
                                                ? (selectedOffer as GarageOffer).garageName ?? 'Garage'
                                                : (selectedOffer as ExchangeOffer).bikeModel ?? 'Bike'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold mb-1">
                                            {isFuelOffer(selectedOffer)
                                                ? (selectedOffer as FuelOffer).partnerName ?? 'Partner'
                                                : isGarageOffer(selectedOffer)
                                                    ? (selectedOffer as GarageOffer).garageName ?? 'Garage'
                                                    : isExchangeOffer(selectedOffer)
                                                        ? `${(selectedOffer as ExchangeOffer).bikeBrand} ${(selectedOffer as ExchangeOffer).bikeModel}`
                                                        : ''}
                                        </h2>
                                        {isGarageOffer(selectedOffer) && (
                                            <div className="flex items-center gap-1 text-gray-600 text-sm">
                                                <MapPin className="w-3 h-3" />
                                                <span>{(selectedOffer as GarageOffer).location}</span>
                                            </div>
                                        )}
                                        {isExchangeOffer(selectedOffer) && (
                                            <div className="flex items-center gap-1 text-gray-600 text-sm">
                                                <MapPin className="w-3 h-3" />
                                                <span>{(selectedOffer as ExchangeOffer).location}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1 mt-1">
                                            {selectedOffer.isQualified ? (
                                                <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    You Qualify!
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-600 font-semibold text-sm">
                                                    <XCircle className="w-3 h-3" />
                                                    Not Eligible Yet
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`bg-gradient-to-r ${offerType === 'fuel' ? 'from-purple-600 to-pink-600' :
                                        offerType === 'garage' ? 'from-blue-600 to-cyan-600' :
                                            'from-green-600 to-emerald-600'} rounded-lg p-4 text-white text-center mb-4`}
                                >
                                    <p className="text-2xl font-bold mb-1">{selectedOffer.discount}% OFF</p>
                                    <p className="text-sm">Save up to UGX {selectedOffer.maxSavings.toLocaleString()}</p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-sm font-bold mb-2 flex items-center gap-1">
                                        {isFuelOffer(selectedOffer) ? (
                                            <Fuel className="w-4 h-4 text-orange-500" />
                                        ) : isGarageOffer(selectedOffer) ? (
                                            <Wrench className="w-4 h-4 text-blue-500" />
                                        ) : (
                                            <ArrowRightLeft className="w-4 h-4 text-green-500" />
                                        )}
                                        Offer Details
                                    </h3>
                                    <p className="text-gray-700 text-sm mb-3">{selectedOffer.description}</p>
                                    {isGarageOffer(selectedOffer) && selectedOffer.serviceType && (
                                        <div className="bg-blue-50 rounded-lg p-2">
                                            <p className="font-semibold text-blue-900 text-xs mb-1">Services Included:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedOffer.serviceType.map((service, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-white px-2 py-0.5 rounded text-xs font-medium text-blue-700"
                                                    >
                                                        {service}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {isExchangeOffer(selectedOffer) && (
                                        <div className="bg-green-50 rounded-lg p-2">
                                            <p className="font-semibold text-green-900 text-xs mb-1">Features:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {(selectedOffer as ExchangeOffer).features.map((feature, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-white px-2 py-0.5 rounded text-xs font-medium text-green-700"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                    <div className="bg-purple-50 rounded-lg p-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-purple-600" />
                                            <h4 className="font-bold text-sm">Validity</h4>
                                        </div>
                                        <p className="text-gray-700 text-xs">Expires: {selectedOffer.expiryDate}</p>
                                    </div>

                                    {isFuelOffer(selectedOffer) && selectedOffer.locations && (
                                        <div className="bg-blue-50 rounded-lg p-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                                <h4 className="font-bold text-sm">Locations</h4>
                                            </div>
                                            <p className="text-gray-700 text-xs">{selectedOffer.locations.join(', ')}</p>
                                        </div>
                                    )}

                                    {isGarageOffer(selectedOffer) && (
                                        <div className="bg-green-50 rounded-lg p-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Target className="w-4 h-4 text-green-600" />
                                                <h4 className="font-bold text-sm">Max Redemptions</h4>
                                            </div>
                                            <p className="text-gray-700 text-xs">{selectedOffer.maxRedemptions} times</p>
                                        </div>
                                    )}

                                    {isExchangeOffer(selectedOffer) && (
                                        <div className="bg-green-50 rounded-lg p-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Target className="w-4 h-4 text-green-600" />
                                                <h4 className="font-bold text-sm">Delivery Time</h4>
                                            </div>
                                            <p className="text-gray-700 text-xs">{(selectedOffer as ExchangeOffer).deliveryTime}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-sm font-bold mb-2 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4 text-orange-500" />
                                        Terms & Conditions
                                    </h3>
                                    <ul className="space-y-1">
                                        {selectedOffer.terms.map((term, index) => (
                                            <li key={index} className="flex items-start gap-2 text-xs">
                                                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{term}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={() => handleSaveVoucher(selectedOffer.id)}
                                        className={`font-semibold py-2 rounded-lg transition-all text-sm ${savedVouchers.includes(selectedOffer.id)
                                            ? "bg-green-100 text-green-700 border border-green-500"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                            }`}
                                    >
                                        {savedVouchers.includes(selectedOffer.id) ? "✓ Saved" : "Save for Later"}
                                    </button>
                                    {selectedOffer.isQualified && (
                                        <button
                                            onClick={() => {
                                                if (isExchangeOffer(selectedOffer)) {
                                                    window.location.href = '/exchange';
                                                } else {
                                                    handleRedeemVoucher(selectedOffer);
                                                }
                                            }}
                                            className={`bg-gradient-to-r ${offerType === 'fuel'
                                                ? 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                                : offerType === 'garage'
                                                    ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                                                    : 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                                                } text-white font-semibold py-2 rounded-lg transition-all shadow text-sm`}
                                        >
                                            {isExchangeOffer(selectedOffer) ? 'Learn More' : 'Redeem Voucher'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Voucher Redemption View */}
                    {viewMode === "voucher" && selectedOffer && !isExchangeOffer(selectedOffer) && (
                        <div className="max-w-2xl mx-auto">
                            <button
                                onClick={handleBackToOffers}
                                className="mb-4 flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Offers
                            </button>

                            <div className={`bg-gradient-to-br ${offerType === 'fuel' ? "from-purple-600 via-pink-600 to-orange-500" : "from-blue-600 via-cyan-600 to-teal-500"
                                } rounded-xl shadow overflow-hidden`}>
                                <div className="bg-white/10 backdrop-blur-sm p-4 text-white">
                                    <div className="text-center mb-4">
                                        <Zap className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                                        <h2 className="text-lg font-bold mb-1">Voucher Activated!</h2>
                                        <p className="text-purple-100 text-sm">
                                            Show this code at {offerType === 'fuel'
                                                ? (selectedOffer as FuelOffer).partnerName ?? 'the partner'
                                                : (selectedOffer as GarageOffer).garageName ?? 'the garage'}
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 text-center mb-4">
                                        <p className="text-gray-600 text-xs mb-1 font-semibold">VOUCHER CODE</p>
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                            <p className="text-xl font-bold text-purple-600 tracking-wider">
                                                {selectedOffer.voucherCode}
                                            </p>
                                            <button
                                                onClick={() => handleCopyCode(selectedOffer.voucherCode)}
                                                className="bg-purple-100 hover:bg-purple-200 p-2 rounded-lg transition-all"
                                            >
                                                {copiedCode === selectedOffer.voucherCode ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-purple-600" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                            <p className="text-purple-100 text-xs mb-1">Discount</p>
                                            <p className="text-sm font-bold">{selectedOffer.discount}% OFF</p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                            <p className="text-purple-100 text-xs mb-1">Max Savings</p>
                                            <p className="text-sm font-bold">
                                                UGX {selectedOffer.maxSavings.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                            <p className="text-purple-100 text-xs mb-1">Valid Until</p>
                                            <p className="text-xs font-bold">{selectedOffer.expiryDate}</p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                            <p className="text-purple-100 text-xs mb-1">Redemptions</p>
                                            <p className="text-xs font-bold">
                                                {selectedOffer.usageCount}/{selectedOffer.maxRedemptions}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-orange-500/30 backdrop-blur-sm rounded-lg p-3 border border-orange-400/50">
                                        <h3 className="font-bold text-sm mb-2 flex items-center gap-1">
                                            <Target className="w-3 h-3" />
                                            How to Redeem
                                        </h3>
                                        <ol className="space-y-1 text-purple-50 text-xs">
                                            {offerType === 'fuel' ? (
                                                <>
                                                    <li className="flex items-start gap-1">
                                                        <span className="font-bold">1.</span>
                                                        <span>Visit any {(selectedOffer as FuelOffer).partnerName ?? 'partner'} station</span>
                                                    </li>
                                                    <li className="flex items-start gap-1">
                                                        <span className="font-bold">2.</span>
                                                        <span>Show this voucher code before payment</span>
                                                    </li>
                                                    <li className="flex items-start gap-1">
                                                        <span className="font-bold">3.</span>
                                                        <span>Confirm Tugende rider status via app</span>
                                                    </li>
                                                    <li className="flex items-start gap-1">
                                                        <span className="font-bold">4.</span>
                                                        <span>Enjoy your fuel discount!</span>
                                                    </li>
                                                </>
                                            ) : (
                                                isGarageOffer(selectedOffer) && (
                                                    <>
                                                        <li className="flex items-start gap-1">
                                                            <span className="font-bold">1.</span>
                                                            <span>Visit {(selectedOffer as GarageOffer).garageName ?? 'the garage'} at {(selectedOffer as GarageOffer).location}</span>
                                                        </li>
                                                        <li className="flex items-start gap-1">
                                                            <span className="font-bold">2.</span>
                                                            <span>Show voucher code before service begins</span>
                                                        </li>
                                                        <li className="flex items-start gap-1">
                                                            <span className="font-bold">3.</span>
                                                            <span>Verify Tugende rider status</span>
                                                        </li>
                                                        <li className="flex items-start gap-1">
                                                            <span className="font-bold">4.</span>
                                                            <span>Get your service at discounted price!</span>
                                                        </li>
                                                    </>
                                                )
                                            )}
                                        </ol>
                                    </div>

                                </div>

                                <div className="bg-white p-3">
                                    <div className="flex items-start gap-2 mb-3 bg-yellow-50 p-2 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-yellow-800 text-xs mb-1">Important Reminder</p>
                                            <p className="text-xs text-yellow-700">
                                                This voucher expires on {selectedOffer.expiryDate}. Make sure to use it before the deadline!
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleBackToOffers}
                                        className={`w-full bg-gradient-to-r ${offerType === 'fuel'
                                            ? "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                            : "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                            } text-white font-semibold py-2 rounded-lg transition-all text-sm`}
                                    >
                                        Browse More Offers
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Redeemed Vouchers View */}
                    {viewMode === "redeemed" && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-lg shadow p-4">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-1">
                                    <Gift className="w-5 h-5 text-purple-600" />
                                    My Active Vouchers
                                </h2>

                                {(redeemedFuelVouchers.length > 0 || redeemedGarageVouchers.length > 0) ? (
                                    <div className="space-y-4">
                                        {/* Fuel Vouchers */}
                                        {redeemedFuelVouchers.length > 0 && (
                                            <div>
                                                <h3 className="font-bold text-sm mb-2 flex items-center gap-1">
                                                    <Fuel className="w-3 h-3 text-pink-600" />
                                                    Fuel Vouchers
                                                </h3>
                                                <div className="space-y-3">
                                                    {redeemedFuelVouchers.map((voucher) => (
                                                        <div
                                                            key={voucher.id}
                                                            className="border border-purple-200 rounded-lg p-3 hover:shadow transition-all"
                                                        >
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                                                                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                                                    <div className="relative w-12 h-6 bg-gray-100 rounded overflow-hidden">
                                                                        <Image
                                                                            src={voucher.partnerLogo ?? '/default-logo.png'}
                                                                            alt={voucher.partnerName ?? 'Partner'}
                                                                            width={48}
                                                                            height={24}
                                                                            className="w-full h-full object-contain"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-sm">{voucher.partnerName}</h4>
                                                                        <p className="text-xs text-gray-600">{voucher.discount}% discount</p>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={`px-2 py-1 rounded-full font-semibold text-xs ${voucher.status === "active"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : voucher.status === "used"
                                                                            ? "bg-gray-100 text-gray-700"
                                                                            : "bg-red-100 text-red-700"
                                                                        }`}
                                                                >
                                                                    {voucher.status.toUpperCase()}
                                                                </div>
                                                            </div>

                                                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded p-2 mb-3">
                                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                                    <div>
                                                                        <p className="text-xs text-gray-600 mb-1">VOUCHER CODE</p>
                                                                        <p className="text-sm font-bold text-purple-600">{voucher.voucherCode}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleCopyCode(voucher.voucherCode)}
                                                                        className="bg-white hover:bg-gray-100 p-1.5 rounded transition-all shadow-sm mt-1 sm:mt-0"
                                                                    >
                                                                        {copiedCode === voucher.voucherCode ? (
                                                                            <Check className="w-3 h-3 text-green-600" />
                                                                        ) : (
                                                                            <Copy className="w-3 h-3 text-gray-600" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                                                <div>
                                                                    <p className="text-gray-600">Redeemed</p>
                                                                    <p className="font-semibold">{voucher.redeemedDate}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600">Expires</p>
                                                                    <p className="font-semibold">{voucher.expiryDate}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600">Saved</p>
                                                                    <p className="font-semibold text-green-600">
                                                                        UGX {voucher.amountSaved?.toLocaleString() || "0"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Garage Vouchers */}
                                        {redeemedGarageVouchers.length > 0 && (
                                            <div>
                                                <h3 className="font-bold text-sm mb-2 flex items-center gap-1">
                                                    <Wrench className="w-3 h-3 text-blue-600" />
                                                    Garage Vouchers
                                                </h3>
                                                <div className="space-y-3">
                                                    {redeemedGarageVouchers.map((voucher) => (
                                                        <div
                                                            key={voucher.id}
                                                            className="border border-blue-200 rounded-lg p-3 hover:shadow transition-all"
                                                        >
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                                                                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                                                    <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                                                                        <Image
                                                                            src={voucher.garageLogo ?? '/default-logo.png'}
                                                                            alt={voucher.garageName ?? 'Garage'}
                                                                            width={64}
                                                                            height={64}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-sm">{voucher.garageName}</h4>
                                                                        <p className="text-xs text-gray-600">{voucher.discount}% discount</p>
                                                                        {voucher.serviceUsed && (
                                                                            <p className="text-xs text-blue-600 mt-1">Service: {voucher.serviceUsed}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={`px-2 py-1 rounded-full font-semibold text-xs ${voucher.status === "active"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : voucher.status === "used"
                                                                            ? "bg-gray-100 text-gray-700"
                                                                            : "bg-red-100 text-red-700"
                                                                        }`}
                                                                >
                                                                    {voucher.status.toUpperCase()}
                                                                </div>
                                                            </div>

                                                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded p-2 mb-3">
                                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                                    <div>
                                                                        <p className="text-xs text-gray-600 mb-1">VOUCHER CODE</p>
                                                                        <p className="text-sm font-bold text-blue-600">{voucher.voucherCode}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleCopyCode(voucher.voucherCode)}
                                                                        className="bg-white hover:bg-gray-100 p-1.5 rounded transition-all shadow-sm mt-1 sm:mt-0"
                                                                    >
                                                                        {copiedCode === voucher.voucherCode ? (
                                                                            <Check className="w-3 h-3 text-green-600" />
                                                                        ) : (
                                                                            <Copy className="w-3 h-3 text-gray-600" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                                                <div>
                                                                    <p className="text-gray-600">Redeemed</p>
                                                                    <p className="font-semibold">{voucher.redeemedDate}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600">Expires</p>
                                                                    <p className="font-semibold">{voucher.expiryDate}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600">Saved</p>
                                                                    <p className="font-semibold text-green-600">
                                                                        UGX {voucher.amountSaved?.toLocaleString() || "0"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Gift className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-600 text-sm mb-1">No vouchers redeemed yet</p>
                                        <p className="text-gray-500 text-xs mb-4">
                                            Start redeeming exclusive partner offers to save on fuel and garage services!
                                        </p>
                                        <button
                                            onClick={() => setViewMode("offers")}
                                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-4 py-2 rounded-lg transition-all text-sm"
                                        >
                                            Browse Partner Offers
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Saved Vouchers */}
                            {savedVouchers.length > 0 && (
                                <div className="bg-white rounded-lg shadow p-4 mt-4">
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-1">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        Saved for Later
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[...fuelOffers, ...garageOffers, ...exchangeOffers]
                                            .filter((offer) => savedVouchers.includes(offer.id))
                                            .map((offer) => {
                                                const isFuel = isFuelOffer(offer);
                                                const isGarage = isGarageOffer(offer);
                                                const isExchange = isExchangeOffer(offer);
                                                return (
                                                    <div
                                                        key={offer.id}
                                                        className="border rounded-lg p-3 hover:shadow transition-all"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
                                                                {isFuel ? (
                                                                    <Image
                                                                        src={(offer as FuelOffer).partnerLogo ?? '/default-logo.png'}
                                                                        alt={(offer as FuelOffer).partnerName ?? 'Partner'}
                                                                        width={40}
                                                                        height={40}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : isGarage ? (
                                                                    <Image
                                                                        src={(offer as GarageOffer).garageLogo ?? '/default-logo.png'}
                                                                        alt={(offer as GarageOffer).garageName ?? 'Garage'}
                                                                        width={40}
                                                                        height={40}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex items-center justify-center h-full">
                                                                        <ArrowRightLeft className="w-6 h-6 text-green-500" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => handleSaveVoucher(offer.id)}
                                                                className="text-red-500 hover:text-red-600 text-xs font-semibold"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                        <h3 className="font-bold mb-1 text-xs">
                                                            {isFuel ? (offer as FuelOffer).partnerName ?? 'Partner' :
                                                                isGarage ? (offer as GarageOffer).garageName ?? 'Garage' :
                                                                    isExchange ? `${(offer as ExchangeOffer).bikeBrand} ${(offer as ExchangeOffer).bikeModel}` : ''}
                                                        </h3>
                                                        <p className="text-lg font-bold text-purple-600 mb-1">
                                                            {offer.discount}% OFF
                                                        </p>
                                                        <p className="text-xs text-gray-600 mb-2">
                                                            Expires: {offer.expiryDate}
                                                        </p>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOffer(offer);
                                                                if (isFuel) setOfferType('fuel');
                                                                else if (isGarage) setOfferType('garage');
                                                                else setOfferType('exchange');
                                                                if (isExchange) {
                                                                    window.location.href = '/exchange';
                                                                } else {
                                                                    handleRedeemVoucher(offer);
                                                                }
                                                            }}
                                                            className={`w-full ${isFuel
                                                                ? "bg-purple-600 hover:bg-purple-700"
                                                                : isGarage
                                                                    ? "bg-blue-600 hover:bg-blue-700"
                                                                    : "bg-green-600 hover:bg-green-700"
                                                                } text-white font-semibold py-1.5 rounded transition-all text-xs`}
                                                        >
                                                            {isExchange ? 'Learn More' : 'Redeem Now'}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}

                            {/* Progress Tracker */}
                            <div className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow p-4 text-white">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-1">
                                    <Award className="w-5 h-5" />
                                    Keep Earning More Offers!
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-purple-100 text-xs mb-1">Gigs This Month</p>
                                        <p className="text-xl font-bold mb-3">{riderStats.ridesThisMonth}</p>
                                        <div className="bg-white/20 backdrop-blur-sm rounded p-2">
                                            <p className="text-xs mb-1">Progress to Premium Offers</p>
                                            <div className="w-full bg-white/30 rounded-full h-1.5 mb-1">
                                                <div
                                                    className="bg-white h-1.5 rounded-full transition-all"
                                                    style={{
                                                        width: `${(riderStats.ridesThisMonth / 50) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-purple-100">
                                                {riderStats.ridesNeededForBonus} more gigs to unlock premium offers!
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                                        <h3 className="font-bold text-sm mb-2">How to Qualify for More Offers</h3>
                                        <ul className="space-y-1 text-xs">
                                            <li className="flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                                <span>Complete 50+ gigs monthly for premium access</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                                <span>Maintain 4.5+ rating for exclusive deals</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                                <span>Pay loans on time to unlock higher discounts</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                                <span>Build loan history for more redemptions</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}