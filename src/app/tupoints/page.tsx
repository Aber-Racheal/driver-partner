"use client";

import { useState, useMemo } from "react";
import SearchBar from "../components/SearchBar";
import SideBar from "../components/SideBar";

import {
    tupointsProfile,
    tupointsVouchers,
    redeemedTupointsVouchers,
    TupointsVoucher,
} from "@/data/tuPoints";
import {
    Coins,
    Gift,
    Calendar,
    CheckCircle2,
    Copy,
    Check,
    AlertCircle,
    Target,
    Zap,
    Star,
    ArrowLeft,
    Fuel,
    Wrench,
    DollarSign,
    Search,
    X,
    Award,
    TrendingUp,
    Flame,
    XCircle,
} from "lucide-react";

type ViewMode = "offers" | "redeemed";

export default function TupointsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVoucher, setSelectedVoucher] = useState<TupointsVoucher | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("offers");
    const [filterType, setFilterType] = useState<string>("all");
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [savedVouchers, setSavedVouchers] = useState<string[]>([]);


    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000); // reset after 2s
        });
    };


    const filteredVouchers = useMemo(() => {
        return tupointsVouchers.filter((voucher) => {
            const matchesSearch = voucher.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === "all" || voucher.type === filterType;
            const canAfford = voucher.pointsCost <= tupointsProfile.currentPoints;
            return matchesSearch && matchesType && (voucher.available || canAfford);
        });
    }, [searchQuery, filterType]);

  const generateVoucherCode = (type: string) => {
        const prefix = type === 'fuel' ? 'TUPT' : type === 'garage' ? 'TUPG' : 'TUPL';
        const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}-${randomNum}-${randomCode}`;
    };

    const handleRedeemVoucher = (voucher: TupointsVoucher) => {
        if (voucher.pointsCost > tupointsProfile.currentPoints) {
            alert("Insufficient points!");
            return;
        }
        if (!voucher.available) {
            alert("This voucher is not available for your current tier!");
            return;
        }

        // Generate voucher code on redemption
        const voucherWithCode = {
            ...voucher,
            voucherCode: generateVoucherCode(voucher.type)
        };

        setSelectedVoucher(voucherWithCode);
        setViewMode("redeemed");
    };

    const handleSaveVoucher = (voucherId: string) => {
        setSavedVouchers(prev =>
            prev.includes(voucherId)
                ? prev.filter(id => id !== voucherId)
                : [...prev, voucherId]
        );
    };

    const handleBackToOffers = () => {
        setViewMode("offers");
        setSelectedVoucher(null);
    };

    const getVoucherIcon = (type: string) => {
        switch (type) {
            case "fuel":
                return <Fuel className="w-6 h-6" />;
            case "garage":
                return <Wrench className="w-6 h-6" />;
            case "loan":
                return <DollarSign className="w-6 h-6" />;
            default:
                return <Gift className="w-6 h-6" />;
        }
    };

    const tierColors = {
        Bronze: "from-yellow-600 to-orange-600",
        Silver: "from-gray-400 to-gray-600",
        Gold: "from-yellow-500 to-orange-500",
        Platinum: "from-purple-600 to-pink-600"
    }[tupointsProfile.tier] || 'from-gray-400 to-gray-600';

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <SideBar />

            <main className="flex-1 lg:ml-72">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div className="mb-3 lg:mb-0">
                            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Tupoints Rewards
                            </h1>
                            <p className="text-gray-600 text-xs mt-1 max-w-2xl">
                                Redeem your earned points for exclusive fuel, garage, and loan benefits
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
                                Redeem Points
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

                    {/* Points Balance Card */}
                    <div className={`bg-gradient-to-r ${tierColors} rounded-xl shadow-lg overflow-hidden mb-4`}>
                        <div className="p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-xs mb-1">Available Points Balance</p>
                                    <h2 className="text-2xl font-bold mb-2">{tupointsProfile.currentPoints.toLocaleString()} pts</h2>
                                    <div className="flex items-center gap-4 text-xs">
                                        <div>
                                            <p className="text-purple-100">Total Earned</p>
                                            <p className="font-bold">{tupointsProfile.totalEarned.toLocaleString()}</p>
                                        </div>
                                        <div className="w-px h-6 bg-white/30"></div>
                                        <div>
                                            <p className="text-purple-100">Total Spent</p>
                                            <p className="font-bold">{tupointsProfile.totalSpent.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mb-2">
                                        <p className="text-purple-100 text-xs">Current Tier</p>
                                        <p className="text-lg font-bold">{tupointsProfile.tier}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-4">
                        <div className="bg-white rounded-lg p-3 shadow border border-purple-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">On-time Payments</p>
                                    <p className="text-lg font-bold text-purple-600">
                                        {tupointsProfile.onTimePaymentRate}%
                                    </p>
                                </div>
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Active Streak</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        {tupointsProfile.streakDays} days
                                    </p>
                                </div>
                                <Flame className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow border border-orange-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Consistency Score</p>
                                    <p className="text-lg font-bold text-orange-600">
                                        {tupointsProfile.consistencyScore}
                                    </p>
                                </div>
                                <TrendingUp className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow border border-pink-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Total Loans</p>
                                    <p className="text-lg font-bold text-pink-600">
                                        {tupointsProfile.totalLoans}
                                    </p>
                                </div>
                                <Award className="w-6 h-6 text-pink-500" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    {viewMode === "offers" && (
                        <>
                            {/* Search and Filter */}
                            <div className="mb-4 flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <SearchBar
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search vouchers..."
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
                                    {["all", "fuel", "garage", "loan"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFilterType(type)}
                                            className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-semibold text-xs capitalize transition-all whitespace-nowrap ${filterType === type
                                                ? "bg-purple-600 text-white shadow"
                                                : "bg-white text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Vouchers Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                                {filteredVouchers.map((voucher) => {
                                    const canAfford = voucher.pointsCost <= tupointsProfile.currentPoints;
                                    const iconColor = voucher.type === "fuel" ? "text-pink-600" : voucher.type === "garage" ? "text-blue-600" : "text-green-600";
                                    const bgColor = voucher.type === "fuel" ? "from-pink-50 to-purple-50" : voucher.type === "garage" ? "from-blue-50 to-cyan-50" : "from-green-50 to-emerald-50";

                                    return (
                                        <div
                                            key={voucher.id}
                                            className={`bg-white rounded-lg shadow overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${voucher.category === "exclusive" ? "ring-1 ring-purple-500" : ""
                                                } ${!canAfford || !voucher.available ? "opacity-60" : ""}`}
                                        >
                                            {voucher.category === "exclusive" && (
                                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-1 text-xs font-semibold">
                                                    ⭐ EXCLUSIVE
                                                </div>
                                            )}
                                            <div className="p-3">
                                                <div className={`bg-gradient-to-br ${bgColor} rounded-lg p-3 mb-3 flex items-center justify-center`}>
                                                    <div className={`${iconColor}`}>
                                                        {getVoucherIcon(voucher.type)}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-bold text-sm">{voucher.title}</h3>
                                                    {voucher.available && canAfford ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                    )}
                                                </div>

                                                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                                                    {voucher.description}
                                                </p>

                                                {voucher.value > 0 && (
                                                    <div className="bg-gray-50 rounded-lg p-2 mb-3 text-center">
                                                        <p className="text-xs text-gray-600">Value</p>
                                                        <p className="text-lg font-bold text-purple-600">
                                                            UGX {voucher.value.toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Coins className="w-4 h-4 text-yellow-600" />
                                                        <span className="font-bold text-sm">{voucher.pointsCost.toLocaleString()} pts</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{voucher.expiryDays} days</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleSaveVoucher(voucher.id)}
                                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1.5 rounded-lg transition-all text-xs"
                                                    >
                                                        {savedVouchers.includes(voucher.id) ? "✓ Saved" : "Save"}
                                                    </button>
                                                    {voucher.available ? (
                                                        <button
                                                            onClick={() => handleRedeemVoucher(voucher)}
                                                            disabled={!canAfford}
                                                            className={`flex-1 bg-gradient-to-r ${voucher.type === 'fuel'
                                                                ? 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                                                : voucher.type === 'garage'
                                                                    ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                                                                    : 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                                                                } text-white font-semibold py-1.5 rounded-lg transition-all shadow text-xs ${!canAfford ? "opacity-50 cursor-not-allowed" : ""
                                                                }`}
                                                        >
                                                            {!canAfford ? "Need Points" : "Redeem"}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="flex-1 bg-gray-300 text-gray-500 font-semibold py-1.5 rounded-lg cursor-not-allowed text-xs"
                                                        >
                                                            Tier Restricted
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredVouchers.length === 0 && (
                                <div className="text-center py-8">
                                    <Gift className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-600 text-sm mb-2">No vouchers found matching your search</p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setFilterType("all");
                                        }}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Voucher Redemption View */}
                    {viewMode === "redeemed" && selectedVoucher && (
                        <div className="max-w-2xl mx-auto">
                            <button
                                onClick={handleBackToOffers}
                                className="mb-4 flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Offers
                            </button>

                            <div className={`bg-gradient-to-br ${selectedVoucher.type === 'fuel' ? "from-purple-600 via-pink-600 to-orange-500" :
                                selectedVoucher.type === 'garage' ? "from-blue-600 via-cyan-600 to-teal-500" :
                                    "from-green-600 via-emerald-600 to-teal-500"
                                } rounded-xl shadow overflow-hidden`}>
                                <div className="bg-white/10 backdrop-blur-sm p-4 text-white">
                                    <div className="text-center mb-4">
                                        <Zap className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                                        <h2 className="text-lg font-bold mb-1">Voucher Activated!</h2>
                                        <p className="text-purple-100 text-sm">
                                            {selectedVoucher.type === 'fuel'
                                                ? "Show this code at partner fuel stations"
                                                : selectedVoucher.type === 'garage'
                                                    ? "Present this at authorized garage services"
                                                    : "Use this for loan benefits"}
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 text-center mb-4">
                                        <p className="text-gray-600 text-xs mb-1 font-semibold">VOUCHER CODE</p>

                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                            <p className="text-xl font-bold text-purple-600 tracking-wider">
                                                {selectedVoucher!.voucherCode}
                                            </p>
                                            <button
                                                onClick={() => handleCopyCode(selectedVoucher!.voucherCode)}
                                                className="bg-purple-100 hover:bg-purple-200 p-2 rounded-lg transition-all"
                                            >
                                                {copiedCode === selectedVoucher!.voucherCode ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-purple-600" />
                                                )}
                                            </button>
                                        </div>
                                    </div>






                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                            <p className="text-purple-100 text-xs mb-1">Points Used</p>
                                            <p className="text-sm font-bold">{selectedVoucher.pointsCost.toLocaleString()} pts</p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                            <p className="text-purple-100 text-xs mb-1">Value</p>
                                            <p className="text-sm font-bold">
                                                UGX {selectedVoucher.value.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                            <p className="text-purple-100 text-xs mb-1">Valid For</p>
                                            <p className="text-xs font-bold">{selectedVoucher.expiryDays} days</p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                            <p className="text-purple-100 text-xs mb-1">Redemptions</p>
                                            <p className="text-xs font-bold">
                                                1/{selectedVoucher.maxRedemptionsPerMonth}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-orange-500/30 backdrop-blur-sm rounded-lg p-3 border border-orange-400/50">
                                        <h3 className="font-bold text-sm mb-2 flex items-center gap-1">
                                            <Target className="w-3 h-3" />
                                            How to Redeem
                                        </h3>
                                        <ol className="space-y-1 text-purple-50 text-xs">
                                            {selectedVoucher.type === 'fuel' ? (
                                                <>
                                                    <li className="flex items-start gap-1">
                                                        <span className="font-bold">1.</span>
                                                        <span>Visit any partner fuel station</span>
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
                                            ) : selectedVoucher.type === 'garage' ? (
                                                <>
                                                    <li className="flex items-start gap-1">
                                                        <span className="font-bold">1.</span>
                                                        <span>Visit authorized garage service center</span>
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
                                            ) : (
                                                <>
                                                    <li className="flex items-start gap-1">
                                                        <span className="font-bold">1.</span>
                                                        <span>Apply for your next loan through Tugende app</span>
                                                    </li>
                                                    <li className="flex items-start gap-1">
                                                        <span className="font-bold">2.</span>
                                                        <span>Present this voucher during application</span>
                                                    </li>
                                                    <li className="flex items-start gap-1">
                                                        <span className="font-bold">3.</span>
                                                        <span>Enjoy reduced interest rates or waived fees</span>
                                                    </li>
                                                    <li className="flex items-start gap-1">
                                                        <span className="font-bold">4.</span>
                                                        <span>Complete your loan process as usual</span>
                                                    </li>
                                                </>
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
                                                This voucher is valid for {selectedVoucher.expiryDays} days from redemption. Make sure to use it before it expires!
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleBackToOffers}
                                        className={`w-full bg-gradient-to-r ${selectedVoucher.type === 'fuel'
                                            ? "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                            : selectedVoucher.type === 'garage'
                                                ? "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                                : "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                            } text-white font-semibold py-2 rounded-lg transition-all text-sm`}
                                    >
                                        Browse More Vouchers
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* My Vouchers View */}
                    {viewMode === "redeemed" && !selectedVoucher && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-lg shadow p-4">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-1">
                                    <Gift className="w-5 h-5 text-purple-600" />
                                    My Active Vouchers
                                </h2>

                                {redeemedTupointsVouchers.length > 0 ? (
                                    <div className="space-y-4">
                                        {redeemedTupointsVouchers.map((voucher) => (
                                            <div
                                                key={voucher.id}
                                                className="border border-purple-200 rounded-lg p-3 hover:shadow transition-all"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                                                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                                        <div className={`p-2 rounded-lg ${voucher.type === "fuel" ? "bg-pink-100 text-pink-600" :
                                                            voucher.type === "garage" ? "bg-blue-100 text-blue-600" :
                                                                "bg-green-100 text-green-600"
                                                            }`}>
                                                            {getVoucherIcon(voucher.type)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm">{voucher.title}</h4>
                                                            {voucher.value > 0 && (
                                                                <p className="text-lg font-bold text-purple-600">
                                                                    UGX {voucher.value.toLocaleString()}
                                                                </p>
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
                                                        <p className="text-gray-600">Points Used</p>
                                                        <p className="font-semibold text-purple-600">
                                                            {voucher.pointsCost?.toLocaleString() || "0"} pts
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Gift className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-600 text-sm mb-1">No vouchers redeemed yet</p>
                                        <p className="text-gray-500 text-xs mb-4">
                                            Redeem your points to get exclusive vouchers for fuel, garage services, and loan benefits!
                                        </p>
                                        <button
                                            onClick={() => setViewMode("offers")}
                                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-4 py-2 rounded-lg transition-all text-sm"
                                        >
                                            Browse Vouchers
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
                                        {tupointsVouchers
                                            .filter((voucher) => savedVouchers.includes(voucher.id))
                                            .map((voucher) => (
                                                <div
                                                    key={voucher.id}
                                                    className="border rounded-lg p-3 hover:shadow transition-all"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className={`p-2 rounded-lg ${voucher.type === "fuel" ? "bg-pink-100 text-pink-600" :
                                                            voucher.type === "garage" ? "bg-blue-100 text-blue-600" :
                                                                "bg-green-100 text-green-600"
                                                            }`}>
                                                            {getVoucherIcon(voucher.type)}
                                                        </div>
                                                        <button
                                                            onClick={() => handleSaveVoucher(voucher.id)}
                                                            className="text-red-500 hover:text-red-600 text-xs font-semibold"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                    <h3 className="font-bold mb-1 text-xs">{voucher.title}</h3>
                                                    <p className="text-lg font-bold text-purple-600 mb-1">
                                                        {voucher.pointsCost.toLocaleString()} pts
                                                    </p>
                                                    <p className="text-xs text-gray-600 mb-2">
                                                        Valid for {voucher.expiryDays} days
                                                    </p>
                                                    <button
                                                        onClick={() => handleRedeemVoucher(voucher)}
                                                        className={`w-full ${voucher.type === "fuel"
                                                            ? "bg-purple-600 hover:bg-purple-700"
                                                            : voucher.type === "garage"
                                                                ? "bg-blue-600 hover:bg-blue-700"
                                                                : "bg-green-600 hover:bg-green-700"
                                                            } text-white font-semibold py-1.5 rounded transition-all text-xs`}
                                                    >
                                                        Redeem Now
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}