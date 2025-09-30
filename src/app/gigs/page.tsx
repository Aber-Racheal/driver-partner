"use client";

import {
    Filter,
    MapPin,
    Clock,
    User,
    DollarSign,
    Eye,
    ChevronRight,
    Star,
    Briefcase,
    X,
    Calendar,
    Tag,
} from "lucide-react";
import Link from "next/link";
import { calculateGigStatus, getStatusStyling, sortGigsByStatusPriority } from "@/utils/gigStatusUtils";
import { calculateTimeAgo } from "@/utils/calculateTimeAgo";
import SideBar from "../components/SideBar";
import { gigs as allGigs } from "@/data/gigsData";
import SearchBar from "../components/SearchBar";
import { useState, useMemo, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

// Type definitions with defaults
interface GigStatusInfo {
    status: 'NEW' | 'OPEN' | 'URGENT' | 'CLOSING SOON' | 'CLOSED';
    statusColor: string;
    priority: number;
    daysSincePosted: number;
    daysUntilDeadline: number;
    isActive: boolean;
}

interface FilterOptions {
    types: string[];
    statuses: string[];
    locations: string[];
}

interface StatusCounts {
    NEW: number;
    OPEN: number;
    URGENT: number;
    'CLOSING SOON': number;
    CLOSED: number;
}

import { Filters, Gig } from "../types/gigs";

const GIGS_PER_PAGE = 5;

export default function GigsPage() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [filters, setFilters] = useState<Filters>({
        type: "",
        status: "",
        location: "",
        payRange: "",
        datePosted: "",
        sortBy: "newest"
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    // Type the allGigs properly
    const typedGigs = allGigs as Gig[];

    // Filter and sort gigs based on current filters
    const filteredGigs = useMemo(() => {
        const filtered = typedGigs.filter(gig => {
            // Calculate dynamic status for filtering
            const statusInfo = calculateGigStatus(gig.postedDate, gig.deadline, gig.status) as GigStatusInfo;
            const currentStatus = statusInfo.status;

            // Search term filter
            if (searchTerm && !gig.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !gig.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !gig.postedBy.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }

            // Type filter
            if (filters.type && gig.type !== filters.type) {
                return false;
            }

            // Status filter - now uses dynamic status
            if (filters.status && currentStatus !== filters.status) {
                return false;
            }

            // Location filter
            if (filters.location && gig.location !== filters.location) {
                return false;
            }

            // Pay range filter
            if (filters.payRange) {
                const pay = parseFloat(gig.pay.replace(/[^0-9.]/g, ''));
                switch (filters.payRange) {
                    case 'under-50':
                        if (pay >= 50) return false;
                        break;
                    case '50-100':
                        if (pay < 50 || pay > 100) return false;
                        break;
                    case '100-200':
                        if (pay < 100 || pay > 200) return false;
                        break;
                    case 'over-200':
                        if (pay <= 200) return false;
                        break;
                }
            }

            // Date posted filter
            if (filters.datePosted) {
                const gigDate = new Date(gig.postedDate);
                const now = new Date();
                const daysDiff = Math.floor((now.getTime() - gigDate.getTime()) / (1000 * 60 * 60 * 24));

                switch (filters.datePosted) {
                    case 'today':
                        if (daysDiff > 0) return false;
                        break;
                    case 'week':
                        if (daysDiff > 7) return false;
                        break;
                    case 'month':
                        if (daysDiff > 30) return false;
                        break;
                }
            }

            return true;
        });

        // Apply dynamic status and sort - properly type the result
        const gigsWithStatus = sortGigsByStatusPriority(filtered) as Gig[];

        // Apply additional sorting if specified
        switch (filters.sortBy) {
            case 'newest':
                gigsWithStatus.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
                break;
            case 'oldest':
                gigsWithStatus.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
                break;
            case 'pay-high':
                gigsWithStatus.sort((a, b) => {
                    const payA = parseFloat(a.pay.replace(/[^0-9.]/g, ''));
                    const payB = parseFloat(b.pay.replace(/[^0-9.]/g, ''));
                    return payB - payA;
                });
                break;
            case 'pay-low':
                gigsWithStatus.sort((a, b) => {
                    const payA = parseFloat(a.pay.replace(/[^0-9.]/g, ''));
                    const payB = parseFloat(b.pay.replace(/[^0-9.]/g, ''));
                    return payA - payB;
                });
                break;
            case 'title':
                gigsWithStatus.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                // Keep status priority sorting as default
                break;
        }

        return gigsWithStatus;
    }, [searchTerm, filters, typedGigs]);

    // Update filterOptions to include dynamic statuses
    const filterOptions = useMemo<FilterOptions>(() => {
        const types = [...new Set(typedGigs.map(gig => gig.type))];
        const locations = [...new Set(typedGigs.map(gig => gig.location))];

        // Generate dynamic statuses for filter options
        const dynamicStatuses = [...new Set(typedGigs.map(gig => {
            const statusInfo = calculateGigStatus(gig.postedDate, gig.deadline, gig.status) as GigStatusInfo;
            return statusInfo.status;
        }))];

        return { types, statuses: dynamicStatuses, locations };
    }, [typedGigs]);

    // Status counts for header
    const statusCounts = useMemo<StatusCounts>(() => {
        const counts: StatusCounts = { NEW: 0, OPEN: 0, URGENT: 0, 'CLOSING SOON': 0, CLOSED: 0 };
        typedGigs.forEach(gig => {
            const statusInfo = calculateGigStatus(gig.postedDate, gig.deadline, gig.status) as GigStatusInfo;
            counts[statusInfo.status]++;
        });
        return counts;
    }, [typedGigs]);

    // Paginated gigs based on filtered results
    const visibleGigs = useMemo(() => {
        return filteredGigs.slice(0, page * GIGS_PER_PAGE);
    }, [filteredGigs, page]);

    const hasMore = visibleGigs.length < filteredGigs.length;

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [searchTerm, filters]);

    const loadMore = async () => {
        setLoading(true);
        setTimeout(() => {
            setPage(prev => prev + 1);
            setLoading(false);
        }, 500);
    };

    const clearFilters = () => {
        setFilters({
            type: "",
            status: "",
            location: "",
            payRange: "",
            datePosted: "",
            sortBy: "newest"
        });
        setSearchTerm("");
    };

    const activeFiltersCount = Object.values(filters).filter(value => value && value !== "newest").length + (searchTerm ? 1 : 0);

    return (
        <div className="flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
            <SideBar />
            <main className="ml-72 flex-1 min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Available Gigs
                            </h1>
                            <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                                <Briefcase className="w-4 h-4" />
                                {filteredGigs.length} of {typedGigs.length} gigs {searchTerm || activeFiltersCount > 0 ? 'matching your criteria' : 'available'}
                            </p>
                        </div>

                        {/* Updated Status Counts */}
                        <div className="flex gap-4">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                New: <span className="font-bold">{statusCounts.NEW}</span>
                            </div>
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                Urgent: <span className="font-bold">{statusCounts.URGENT}</span>
                            </div>
                            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                Closing: <span className="font-bold">{statusCounts['CLOSING SOON']}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <SearchBar
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClear={() => setSearchTerm("")}
                                placeholder="Search gigs, skills, or companies..."
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-6 py-3 backdrop-blur-sm border rounded-full transition-all duration-300 shadow-lg relative ${showFilters || activeFiltersCount > 0
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white/70 text-gray-700 border-gray-200/50 hover:bg-white/90'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                            <span className="font-medium">Filter</span>
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-purple-600" />
                                    Filter Options
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Gig Type Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Tag className="w-4 h-4 inline mr-1" />
                                        Gig Type
                                    </label>
                                    <select
                                        value={filters.type}
                                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    >
                                        <option value="">All Types</option>
                                        {filterOptions.types.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Status
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    >
                                        <option value="">All Statuses</option>
                                        {filterOptions.statuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Location
                                    </label>
                                    <select
                                        value={filters.location}
                                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    >
                                        <option value="">All Locations</option>
                                        {filterOptions.locations.map(location => (
                                            <option key={location} value={location}>{location}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Pay Range Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <DollarSign className="w-4 h-4 inline mr-1" />
                                        Pay Range
                                    </label>
                                    <select
                                        value={filters.payRange}
                                        onChange={(e) => setFilters(prev => ({ ...prev, payRange: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    >
                                        <option value="">Any Amount</option>
                                        <option value="under-50">Under $50</option>
                                        <option value="50-100">$50 - $100</option>
                                        <option value="100-200">$100 - $200</option>
                                        <option value="over-200">Over $200</option>
                                    </select>
                                </div>

                                {/* Date Posted Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Posted Within
                                    </label>
                                    <select
                                        value={filters.datePosted}
                                        onChange={(e) => setFilters(prev => ({ ...prev, datePosted: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    >
                                        <option value="">Any Time</option>
                                        <option value="today">Today</option>
                                        <option value="week">This Week</option>
                                        <option value="month">This Month</option>
                                    </select>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="pay-high">Highest Pay</option>
                                        <option value="pay-low">Lowest Pay</option>
                                        <option value="title">Title A-Z</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                {/* Active Filters Display */}
                {(searchTerm || activeFiltersCount > 0) && (
                    <div className="px-6 py-4 bg-white/50 border-b border-gray-200/50">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-gray-600">Active filters:</span>

                            {searchTerm && (
                                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                    Search: &quot;{searchTerm}&quot;
                                    <button onClick={() => setSearchTerm("")} className="hover:bg-purple-200 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {filters.type && (
                                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    Type: {filters.type}
                                    <button onClick={() => setFilters(prev => ({ ...prev, type: "" }))} className="hover:bg-blue-200 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {filters.status && (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    Status: {filters.status}
                                    <button onClick={() => setFilters(prev => ({ ...prev, status: "" }))} className="hover:bg-green-200 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {filters.location && (
                                <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                                    Location: {filters.location}
                                    <button onClick={() => setFilters(prev => ({ ...prev, location: "" }))} className="hover:bg-red-200 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {filters.payRange && (
                                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                    Pay: {filters.payRange.replace('-', ' - $').replace('under', 'Under $').replace('over', 'Over $')}
                                    <button onClick={() => setFilters(prev => ({ ...prev, payRange: "" }))} className="hover:bg-yellow-200 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {filters.datePosted && (
                                <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                    Posted: {filters.datePosted.charAt(0).toUpperCase() + filters.datePosted.slice(1)}
                                    <button onClick={() => setFilters(prev => ({ ...prev, datePosted: "" }))} className="hover:bg-indigo-200 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Gig List */}
                <div className="p-6">
                    {filteredGigs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No gigs found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {visibleGigs.map((gig) => {
                                // Add null checks and fallbacks
                                const statusInfo = calculateGigStatus(gig.postedDate, gig.deadline, gig.status) as GigStatusInfo || {
                                    status: 'OPEN' as const,
                                    statusColor: 'text-blue-600 bg-blue-100',
                                    priority: 1,
                                    daysSincePosted: 0,
                                    daysUntilDeadline: 30,
                                    isActive: true
                                };
                                const statusStyling = getStatusStyling(statusInfo) || {
                                    className: 'font-bold text-sm px-3 py-1 rounded-full text-blue-600 bg-blue-100',
                                    showDot: false,
                                    dotColor: 'bg-blue-500'
                                };

                                return (
                                    <div
                                        key={gig.id}
                                        className={`group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100 relative overflow-hidden ${statusInfo.status === 'CLOSED' ? 'opacity-70' : ''
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-transparent group-hover:from-purple-500/5 group-hover:via-blue-500/5 transition-all duration-300"></div>

                                        <div className="flex items-center justify-between mb-4 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium shadow-md ${gig.typeColor}`}>
                                                    {gig.type}
                                                </span>
                                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                    <Clock className="w-4 h-4" />
                                                    {calculateTimeAgo(gig.postedDate)}
                                                </div>

                                                {/* Show deadline info */}
                                                {statusInfo.daysUntilDeadline >= 0 && (
                                                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        {statusInfo.daysUntilDeadline === 0 ? 'Due today' :
                                                            statusInfo.daysUntilDeadline === 1 ? 'Due tomorrow' :
                                                                `${statusInfo.daysUntilDeadline} days left`}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={statusStyling.className}>
                                                    {statusInfo.status}
                                                </span>
                                                {statusStyling.showDot && (
                                                    <div className={`w-2 h-2 ${statusStyling.dotColor} rounded-full animate-pulse`}></div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                                                {gig.title}
                                            </h3>
                                            {gig.description && (
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {gig.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                                <User className="w-4 h-4 text-purple-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Posted by</p>
                                                    <p className="font-medium text-gray-800">{gig.postedBy}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Posted on</p>
                                                    <p className="font-medium text-gray-800">{gig.postedDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                                <MapPin className="w-4 h-4 text-red-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Location</p>
                                                    <p className="font-medium text-gray-800">{gig.location}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-md">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="font-bold">{gig.pay}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-yellow-500">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="text-sm font-medium text-gray-700">4.8</span>
                                                    <span className="text-xs text-gray-500">(23 reviews)</span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                📍 2.3 km away
                                            </div>
                                        </div>
                                        <Link
                                            href={`/gigs/${gig.id}`}
                                            className="flex items-center gap-2 text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors group/btn relative z-10"
                                            onClick={() => console.log('Navigating to gig:', gig.id, `/gigs/${gig.id}`)}
                                        >
                                            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                            See Details
                                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>

                                        {/* Status indicator bars */}
                                        {statusInfo.status === 'URGENT' && (
                                            <div className="absolute top-0 right-0 bg-gradient-to-l from-red-500 to-transparent h-1 w-32 animate-pulse"></div>
                                        )}
                                        {statusInfo.status === 'CLOSING SOON' && (
                                            <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-transparent h-1 w-32 animate-pulse"></div>
                                        )}
                                        {statusInfo.status === 'NEW' && (
                                            <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-transparent h-1 w-32"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Load More Section */}
                    {loading && <LoadingSpinner />}

                    {!loading && hasMore && filteredGigs.length > 0 && (
                        <div className="text-center mt-12">
                            <button
                                onClick={loadMore}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Load More Gigs ({filteredGigs.length - visibleGigs.length} remaining)
                            </button>
                        </div>
                    )}

                    {!hasMore && filteredGigs.length > 0 && (
                        <div className="text-center mt-8 text-gray-500">
                            No more gigs to show. 🎉
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}