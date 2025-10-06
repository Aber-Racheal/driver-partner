"use client";

import { useState, useMemo, useRef } from "react";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import {
    ArrowLeft,
    ArrowRightLeft,
    CheckCircle2,
    Shield,
    Zap,
    Calculator,
    CreditCard,
    Clock,
    Phone,
    MessageCircle,
    Upload,
    FileText,
    Eye,
    Trash2
} from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "../components/LoadingSpinner";
import { ExchangeOffer, ApplicationDocument, Application } from "../types/exchange";
import { currentBike, exchangeOffers, requiredDocuments } from "@/data/exchange";

export default function ExchangePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterBrand, setFilterBrand] = useState("all");
    const [filterPrice, setFilterPrice] = useState("all");
    const [selectedBike, setSelectedBike] = useState<ExchangeOffer | null>(null);
    const [viewMode, setViewMode] = useState<"browse" | "details" | "calculator" | "application" | "tracking">("browse");
    const [applicationStep, setApplicationStep] = useState(1);
    const [applicationReason, setApplicationReason] = useState("");
    const [uploadedDocuments, setUploadedDocuments] = useState<ApplicationDocument[]>([]);
    const [activeApplication, setActiveApplication] = useState<Application | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Fixed file input refs
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    // Filter exchange offers
    const filteredOffers = useMemo(() => {
        return exchangeOffers.filter(offer => {
            const matchesSearch = offer.bikeModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                offer.bikeBrand.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBrand = filterBrand === "all" || offer.bikeBrand === filterBrand;
            const matchesPrice = filterPrice === "all" ||
                (filterPrice === "low" && offer.topUpRequired <= 3500000) ||
                (filterPrice === "medium" && offer.topUpRequired > 3500000 && offer.topUpRequired <= 4500000) ||
                (filterPrice === "high" && offer.topUpRequired > 4500000);

            return matchesSearch && matchesBrand && matchesPrice;
        });
    }, [searchQuery, filterBrand, filterPrice]);

    const brands = [...new Set(exchangeOffers.map(offer => offer.bikeBrand))];

    // Calculate financial breakdown
    const calculateFinancialBreakdown = (bike: ExchangeOffer) => {
        const netCost = bike.topUpRequired - bike.maxSavings;
        const monthlySavings = Math.round(bike.maxSavings / 12);
        const valueIncrease = bike.currentBikeValue - currentBike.currentValue;
        const roi = valueIncrease > 0 ? (valueIncrease / currentBike.currentValue * 100) : 0;

        return {
            netCost: Math.max(0, netCost),
            monthlySavings,
            roi: Math.round(roi),
            valueIncrease,
            effectiveTopUp: Math.max(0, netCost)
        };
    };

    const handleStartApplication = (bike: ExchangeOffer) => {
        setIsLoading(true);
        setSelectedBike(bike);
        setUploadedDocuments(requiredDocuments.map(doc => ({
            ...doc,
            file: null,
            uploaded: false
        })));

        // Simulate loading
        setTimeout(() => {
            setViewMode("application");
            setApplicationStep(1);
            setIsLoading(false);
        }, 1000);
    };

    const handleBackToBrowse = () => {
        setViewMode("browse");
        setSelectedBike(null);
        setApplicationStep(1);
        setApplicationReason("");
        setUploadedDocuments([]);
    };

    const handleFileUpload = (docId: string, file: File) => {
        setUploadedDocuments(prev => prev.map(doc =>
            doc.id === docId
                ? { ...doc, file, uploaded: true, url: URL.createObjectURL(file) }
                : doc
        ));
    };
    
    const removeDocument = (docId: string) => {
        setUploadedDocuments(prev => prev.map(doc =>
            doc.id === docId
                ? { ...doc, file: null, uploaded: false, url: undefined }
                : doc
        ));
    };

    const submitApplication = () => {
        if (!selectedBike) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const newApplication: Application = {
                id: `APP-${Date.now()}`,
                bike: selectedBike,
                status: 'submitted',
                submittedDate: new Date().toISOString().split('T')[0],
                estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                currentStep: 1,
                documents: uploadedDocuments,
                notes: applicationReason
            };

            setActiveApplication(newApplication);
            setApplicationStep(4);
            setIsLoading(false);
        }, 2000);
    };

    const allDocumentsUploaded = uploadedDocuments.every(doc => doc.uploaded);

    // Show loading spinner
    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                <SideBar />
                <main className="flex-1 lg:ml-72 flex items-center justify-center">
                    {/* Fixed LoadingSpinner usage */}
                    <div className="flex flex-col items-center justify-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-gray-600">Processing your request...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <SideBar />
            <main className="flex-1 lg:ml-72">
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <Link href="/offers" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                    <ArrowLeft className="w-5 h-5" />
                                    <span className="font-semibold">Back to Offers</span>
                                </Link>
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    Bike Exchange Offers
                                </h1>
                                <p className="text-sm text-gray-600">Upgrade Your Ride, Upgrade Your Life</p>
                            </div>
                            <div className="w-20"></div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Quick Stats Banner */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{currentBike.equity.toLocaleString()} UGX</div>
                                <div className="text-green-100 text-sm">Your Current Equity</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{filteredOffers.length}</div>
                                <div className="text-green-100 text-sm">Available Upgrades</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{currentBike.ownershipMonths}</div>
                                <div className="text-green-100 text-sm">Months Owned</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{(currentBike.equity / currentBike.currentValue * 100).toFixed(0)}%</div>
                                <div className="text-green-100 text-sm">Equity Built</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setViewMode("browse")}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === "browse"
                                ? "bg-green-600 text-white shadow"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            Browse Bikes
                        </button>
                        <button
                            onClick={() => setViewMode("calculator")}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === "calculator"
                                ? "bg-blue-600 text-white shadow"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            Valuation Calculator
                        </button>
                        {activeApplication && (
                            <button
                                onClick={() => setViewMode("tracking")}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === "tracking"
                                    ? "bg-purple-600 text-white shadow"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                Track Application
                            </button>
                        )}
                    </div>

                    {/* Browse View */}
                    {viewMode === "browse" && (
                        <>
                            {/* Search and Filters */}
                            <div className="bg-white rounded-lg shadow p-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="relative">
                                        <SearchBar
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search bikes by model or brand..."
                                        />
                                    </div>
                                    <select
                                        value={filterBrand}
                                        onChange={(e) => setFilterBrand(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="all">All Brands</option>
                                        {brands.map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={filterPrice}
                                        onChange={(e) => setFilterPrice(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="all">Any Top-up</option>
                                        <option value="low">Low (≤ 3.5M UGX)</option>
                                        <option value="medium">Medium (3.5M - 4.5M UGX)</option>
                                        <option value="high">High (≥ 4.5M UGX)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Bike Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredOffers.map((bike) => {
                                    const financials = calculateFinancialBreakdown(bike);
                                    return (
                                        <div key={bike.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                                            {bike.isFeatured && (
                                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-1 text-sm font-semibold">
                                                    ⭐ FEATURED UPGRADE
                                                </div>
                                            )}
                                            <div className="p-4">
                                                {/* Bike Image */}
                                                <div className="relative h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                                    <ArrowRightLeft className="w-16 h-16 text-green-400" />
                                                    <div className="absolute top-2 right-2">
                                                        {bike.isQualified ? (
                                                            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                                                                You Qualify
                                                            </div>
                                                        ) : (
                                                            <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                                                                Requirements Not Met
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Bike Info */}
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                    {bike.bikeBrand} {bike.bikeModel}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-3">{bike.year} • {bike.mileage.toLocaleString()} km</p>

                                                {/* Financial Breakdown */}
                                                <div className="bg-green-50 rounded-lg p-3 mb-4">
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>Your Bike Value:</span>
                                                            <span className="font-semibold">{bike.currentBikeValue.toLocaleString()} UGX</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Top-up Required:</span>
                                                            <span className="font-semibold text-green-600">{bike.topUpRequired.toLocaleString()} UGX</span>
                                                        </div>
                                                        <div className="flex justify-between text-blue-600">
                                                            <span>Discount Applied:</span>
                                                            <span className="font-semibold">-{bike.maxSavings.toLocaleString()} UGX</span>
                                                        </div>
                                                        <div className="flex justify-between border-t pt-2">
                                                            <span className="font-semibold">Net Cost:</span>
                                                            <span className="font-bold text-lg text-green-700">{financials.netCost.toLocaleString()} UGX</span>
                                                        </div>
                                                        <div className="text-xs text-gray-600 text-center">
                                                            Save {bike.discount}% • {financials.monthlySavings.toLocaleString()} UGX/month
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Features */}
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {bike.features.slice(0, 3).map((feature, index) => (
                                                        <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBike(bike);
                                                            setViewMode("details");
                                                        }}
                                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg transition-all text-sm"
                                                    >
                                                        View Details
                                                    </button>
                                                    {bike.isQualified ? (
                                                        <button
                                                            onClick={() => handleStartApplication(bike)}
                                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg transition-all shadow text-sm"
                                                        >
                                                            Apply Now
                                                        </button>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="flex-1 bg-gray-300 text-gray-500 font-semibold py-2 rounded-lg cursor-not-allowed text-sm"
                                                        >
                                                            Not Eligible
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredOffers.length === 0 && (
                                <div className="text-center py-12">
                                    <ArrowRightLeft className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No bikes found</h3>
                                    <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setFilterBrand("all");
                                            setFilterPrice("all");
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-all"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Valuation Calculator View */}
                    {viewMode === "calculator" && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Calculator className="w-6 h-6 text-blue-600" />
                                Bike Valuation Calculator
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Current Bike Valuation */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Your Current Bike Valuation</h3>
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold mb-2">{currentBike.currentValue.toLocaleString()} UGX</div>
                                                <div className="text-blue-100">Estimated Current Value</div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold mb-3">Bike Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Model:</span>
                                                    <span className="font-semibold">{currentBike.model}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Year:</span>
                                                    <span>{currentBike.year}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Mileage:</span>
                                                    <span>{currentBike.mileage.toLocaleString()} km</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Condition:</span>
                                                    <span className="capitalize">{currentBike.condition}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Ownership:</span>
                                                    <span>{currentBike.ownershipMonths} months</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-4">
                                            <h4 className="font-semibold mb-3">Financial Position</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Remaining Loan:</span>
                                                    <span>{currentBike.remainingLoan.toLocaleString()} UGX</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Your Equity:</span>
                                                    <span className="text-green-600 font-semibold">{currentBike.equity.toLocaleString()} UGX</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2">
                                                    <span className="font-semibold">Available for Exchange:</span>
                                                    <span className="font-bold text-green-700">{currentBike.equity.toLocaleString()} UGX</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Upgrade Options Comparison */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Compare Upgrade Options</h3>
                                    <div className="space-y-4">
                                        {exchangeOffers.map((bike) => {
                                            const financials = calculateFinancialBreakdown(bike);
                                            return (
                                                <div key={bike.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-all">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h4 className="font-semibold">{bike.bikeBrand} {bike.bikeModel}</h4>
                                                            <p className="text-sm text-gray-600">{bike.year} • {bike.mileage.toLocaleString()} km</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-bold text-green-600">{bike.exchangePrice.toLocaleString()} UGX</div>
                                                            <div className="text-xs text-gray-500">Total Cost</div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-blue-50 rounded p-3 mb-3">
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div>
                                                                <span className="text-gray-600">Your Equity:</span>
                                                                <div className="font-semibold">+ {bike.currentBikeValue.toLocaleString()} UGX</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">Top-up Needed:</span>
                                                                <div className="font-semibold">{financials.netCost.toLocaleString()} UGX</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">Value Increase:</span>
                                                                <div className="font-semibold text-green-600">+ {financials.valueIncrease.toLocaleString()} UGX</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">ROI:</span>
                                                                <div className="font-semibold text-blue-600">{financials.roi}%</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedBike(bike);
                                                            setViewMode("details");
                                                        }}
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition-all"
                                                    >
                                                        View This Upgrade
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Calculator Summary */}
                                    <div className="mt-6 bg-purple-50 rounded-lg p-4">
                                        <h4 className="font-semibold mb-3 text-purple-800">Upgrade Benefits Summary</h4>
                                        <ul className="space-y-2 text-sm text-purple-700">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Use your existing equity as down payment</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Get better fuel efficiency and reliability</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Increase your bike&apos;s resale value</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Enjoy warranty and maintenance benefits</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bike Details View */}
                    {viewMode === "details" && selectedBike && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <button
                                onClick={handleBackToBrowse}
                                className="mb-4 flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Browse
                            </button>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Bike Images */}
                                <div>
                                    <div className="relative h-80 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                                        <ArrowRightLeft className="w-24 h-24 text-green-400" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1, 2, 3].map((num) => (
                                            <div key={num} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-400">Image {num}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bike Details */}
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {selectedBike.bikeBrand} {selectedBike.bikeModel}
                                            </h2>
                                            <p className="text-gray-600">{selectedBike.year} • {selectedBike.mileage.toLocaleString()} km</p>
                                        </div>
                                        {selectedBike.isFeatured && (
                                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Price Card */}
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white mb-6">
                                        <div className="text-center">
                                            <p className="text-3xl font-bold mb-2">{selectedBike.exchangePrice.toLocaleString()} UGX</p>
                                            <p className="text-green-100">Total Upgrade Cost</p>
                                            <div className="flex justify-center gap-4 mt-3 text-sm">
                                                <span>Your Equity: {selectedBike.currentBikeValue.toLocaleString()} UGX</span>
                                                <span>•</span>
                                                <span>Top-up: {selectedBike.topUpRequired.toLocaleString()} UGX</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedBike.features.map((feature: string, index: number) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Specifications */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">Fuel Efficient</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-green-500" />
                                            <span className="text-sm">1 Year Warranty</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-purple-500" />
                                            <span className="text-sm">Low Maintenance</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm">Quick Delivery</span>
                                        </div>
                                    </div>

                                    {/* Terms & Conditions */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Terms & Conditions</h3>
                                        <ul className="space-y-2">
                                            {selectedBike.terms.map((term: string, index: number) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700">{term}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleStartApplication(selectedBike)}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
                                        >
                                            Start Application
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Breakdown Section */}
                            <div className="mt-8 bg-gray-50 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4">Financial Breakdown</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600">{selectedBike.currentBikeValue.toLocaleString()} UGX</div>
                                        <div className="text-sm text-gray-600">Your Bike Value</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">{selectedBike.topUpRequired.toLocaleString()} UGX</div>
                                        <div className="text-sm text-gray-600">Top-up Required</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600">{selectedBike.maxSavings.toLocaleString()} UGX</div>
                                        <div className="text-sm text-gray-600">Discount Savings</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-emerald-600">{selectedBike.exchangePrice.toLocaleString()} UGX</div>
                                        <div className="text-sm text-gray-600">Total Cost</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Application Wizard View */}
                    {viewMode === "application" && selectedBike && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={handleBackToBrowse}
                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Browse
                                </button>
                                <h2 className="text-2xl font-bold">Exchange Application</h2>
                                <div className="w-20"></div>
                            </div>

                            {/* Progress Steps */}
                            <div className="flex justify-between mb-8">
                                {[1, 2, 3, 4].map((step) => (
                                    <div key={step} className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === applicationStep
                                            ? "bg-green-600 text-white"
                                            : step < applicationStep
                                                ? "bg-green-100 text-green-600"
                                                : "bg-gray-100 text-gray-400"
                                            }`}>
                                            {step < applicationStep ? <CheckCircle2 className="w-5 h-5" /> : step}
                                        </div>
                                        <span className="text-xs mt-2 text-gray-600">
                                            {step === 1 && "Details"}
                                            {step === 2 && "Documents"}
                                            {step === 3 && "Review"}
                                            {step === 4 && "Complete"}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Application Content */}
                            <div className="max-w-4xl mx-auto">
                                {applicationStep === 1 && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Exchange Details</h3>
                                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                            <h4 className="font-semibold mb-3 text-lg">Selected Upgrade</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xl font-bold">{selectedBike.bikeBrand} {selectedBike.bikeModel}</p>
                                                    <p className="text-gray-600">{selectedBike.year} • {selectedBike.mileage.toLocaleString()} km</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-green-600">{selectedBike.exchangePrice.toLocaleString()} UGX</p>
                                                    <p className="text-sm text-gray-600">Total Upgrade Cost</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Why do you want to upgrade your bike?
                                                </label>
                                                <textarea
                                                    value={applicationReason}
                                                    onChange={(e) => setApplicationReason(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows={4}
                                                    placeholder="Tell us about your upgrade needs, current challenges with your bike, and what you hope to achieve with the new bike..."
                                                />
                                            </div>

                                            <button
                                                onClick={() => setApplicationStep(2)}
                                                disabled={!applicationReason.trim()}
                                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all"
                                            >
                                                Continue to Document Upload
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {applicationStep === 2 && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Upload Required Documents</h3>
                                        <p className="text-gray-600 mb-6">Please upload clear photos or scans of the following documents:</p>

                                        <div className="space-y-4">
                                            {uploadedDocuments.map((doc) => (
                                                <div key={doc.id} className="border rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold">{doc.name}</h4>
                                                            <p className="text-sm text-gray-600">Accepted: {doc.acceptedTypes.includes('image/*') ? 'Images, PDF' : 'Images'}</p>
                                                        </div>
                                                        {doc.uploaded ? (
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                                <span className="text-green-600 text-sm">Uploaded</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-red-500 text-sm">Required</span>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <input
                                                            type="file"
                                                            // Fixed ref implementation
                                                            ref={(el) => {
                                                                fileInputRefs.current[doc.id] = el;
                                                            }}
                                                            accept={doc.acceptedTypes as string}
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleFileUpload(doc.id, file);
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <button
                                                            onClick={() => fileInputRefs.current[doc.id]?.click()}
                                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                            {doc.uploaded ? 'Replace File' : 'Upload File'}
                                                        </button>

                                                        {doc.uploaded && doc.url && (
                                                            <>
                                                                <button
                                                                    onClick={() => window.open(doc.url, '_blank')}
                                                                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                    View
                                                                </button>
                                                                <button
                                                                    onClick={() => removeDocument(doc.id)}
                                                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Remove
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>

                                                    {doc.uploaded && doc.file && (
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            Uploaded: {doc.file.name} ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                                                        </p>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="flex gap-3 mt-6">
                                                <button
                                                    onClick={() => setApplicationStep(1)}
                                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={() => setApplicationStep(3)}
                                                    disabled={!allDocumentsUploaded}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all"
                                                >
                                                    {allDocumentsUploaded ? 'Review Application' : 'Upload All Documents to Continue'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {applicationStep === 3 && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Review Your Application</h3>
                                        <div className="space-y-6">
                                            {/* Exchange Summary */}
                                            <div className="bg-green-50 rounded-lg p-6">
                                                <h4 className="font-semibold text-green-800 mb-4 text-lg">Exchange Summary</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600">Current Bike</p>
                                                        <p className="font-semibold">{currentBike.model}</p>
                                                        <p className="text-sm text-gray-600">Value: {currentBike.currentValue.toLocaleString()} UGX</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Upgrade To</p>
                                                        <p className="font-semibold">{selectedBike.bikeBrand} {selectedBike.bikeModel}</p>
                                                        <p className="text-sm text-gray-600">{selectedBike.year} • {selectedBike.mileage.toLocaleString()} km</p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 p-4 bg-white rounded-lg">
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>New Bike Price:</span>
                                                            <span>{selectedBike.exchangePrice.toLocaleString()} UGX</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Your Equity:</span>
                                                            <span>- {selectedBike.currentBikeValue.toLocaleString()} UGX</span>
                                                        </div>
                                                        <div className="flex justify-between text-blue-600">
                                                            <span>Discount ({selectedBike.discount}%):</span>
                                                            <span>- {selectedBike.maxSavings.toLocaleString()} UGX</span>
                                                        </div>
                                                        <div className="flex justify-between border-t pt-2 font-semibold">
                                                            <span>Net Amount Due:</span>
                                                            <span className="text-green-600">{calculateFinancialBreakdown(selectedBike).netCost.toLocaleString()} UGX</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Uploaded Documents */}
                                            <div>
                                                <h4 className="font-semibold mb-3">Uploaded Documents</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {uploadedDocuments.filter(doc => doc.uploaded).map((doc) => (
                                                        <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                                            <FileText className="w-5 h-5 text-green-600" />
                                                            <span className="flex-1 text-sm">{doc.name}</span>
                                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setApplicationStep(2)}
                                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all"
                                                >
                                                    Back to Documents
                                                </button>
                                                <button
                                                    onClick={submitApplication}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all"
                                                >
                                                    Submit Application
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {applicationStep === 4 && activeApplication && (
                                    <div className="text-center py-8">
                                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h3>
                                        <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                                            <p className="font-semibold">Application ID: {activeApplication.id}</p>
                                            <p className="text-sm text-gray-600">Submitted on {new Date(activeApplication.submittedDate).toLocaleDateString()}</p>
                                        </div>
                                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                            Your bike exchange application has been received and is under review.
                                            Our team will contact you within 24 hours to schedule your bike inspection.
                                            You can track your application progress in real-time.
                                        </p>
                                        <div className="space-y-3 max-w-sm mx-auto">
                                            <button
                                                onClick={() => setViewMode("tracking")}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all"
                                            >
                                                Track Application Progress
                                            </button>
                                            <button
                                                onClick={handleBackToBrowse}
                                                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-all"
                                            >
                                                Browse More Upgrades
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Application Tracking View */}
                    {viewMode === "tracking" && activeApplication && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => setViewMode("browse")}
                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Browse
                                </button>
                                <h2 className="text-2xl font-bold">Application Tracking</h2>
                                <div className="w-20"></div>
                            </div>

                            {/* Application Header */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white mb-6">
                                <div className="flex flex-col md:flex-row justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold">{activeApplication.bike.bikeBrand} {activeApplication.bike.bikeModel}</h3>
                                        <p className="text-green-100">Application ID: {activeApplication.id}</p>
                                    </div>
                                    <div className="text-right mt-4 md:mt-0">
                                        <div className="text-2xl font-bold">{activeApplication.bike.exchangePrice.toLocaleString()} UGX</div>
                                        <div className="text-green-100">Total Upgrade Cost</div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Tracking */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Application Progress</h3>
                                <div className="flex items-center justify-between mb-4">
                                    {[
                                        { step: 1, label: "Submitted", status: "completed" },
                                        { step: 2, label: "Under Review", status: "completed" },
                                        { step: 3, label: "Approval", status: "current" },
                                        { step: 4, label: "Scheduled", status: "pending" },
                                        { step: 5, label: "Completed", status: "pending" }
                                    ].map(({ step, label, status }) => (
                                        <div key={step} className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${status === "completed" ? "bg-green-500 text-white" :
                                                status === "current" ? "bg-blue-500 text-white" :
                                                    "bg-gray-200 text-gray-400"
                                                }`}>
                                                {status === "completed" ? <CheckCircle2 className="w-6 h-6" /> : step}
                                            </div>
                                            <span className="text-sm mt-2 font-medium">{label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Status Message */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="font-semibold text-blue-800">Application Under Review</p>
                                            <p className="text-blue-600 text-sm">
                                                Your application is being reviewed by our credit team.
                                                Expected completion: {activeApplication.estimatedCompletion}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold mb-3">Next Steps</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span>Credit assessment (In Progress)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            <span>Bike inspection scheduling</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            <span>Final approval</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            <span>Exchange scheduling</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold mb-3">Support</h4>
                                    <div className="space-y-3">
                                        <button className="w-full flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all">
                                            <Phone className="w-4 h-4" />
                                            <span>Call Support</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Chat with Agent</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Benefits Section */}
                    {viewMode === "browse" && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-center mb-8">Why Upgrade Your Bike?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        icon: <Zap className="w-8 h-8 text-green-600" />,
                                        title: "Better Performance",
                                        description: "Newer bikes offer improved fuel efficiency and reliability"
                                    },
                                    {
                                        icon: <Shield className="w-8 h-8 text-blue-600" />,
                                        title: "Enhanced Safety",
                                        description: "Latest safety features and better road handling"
                                    },
                                    {
                                        icon: <CreditCard className="w-8 h-8 text-purple-600" />,
                                        title: "Build More Equity",
                                        description: "Continue building ownership with your existing equity"
                                    }
                                ].map((benefit, index) => (
                                    <div key={index} className="bg-white rounded-lg p-6 text-center shadow-md">
                                        <div className="flex justify-center mb-4">{benefit.icon}</div>
                                        <h3 className="font-semibold mb-2">{benefit.title}</h3>
                                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}