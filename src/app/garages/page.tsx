"use client";

import { garageServices } from "@/data/garagesData";
import {
    Filter,
    MapPin,
    Clock,
    DollarSign,
    Eye,
    ChevronRight,
    Star,
    Wrench,
    X,
    Phone,
    Shield,
    Zap,
    Navigation,
    Calendar,
    CheckCircle,
    Car,
    Bike,
    Users,
    Award
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import SideBar from "../components/SideBar";
import type { GarageService, Filters, BookingForm, BookingFormErrors } from '../types/garages';
import Image from "next/image";


const SERVICES_PER_PAGE = 6;

export default function ImprovedGaragesPage() {
    // ALL useState declarations must come first, before any other code
    const [bookingGarage, setBookingGarage] = useState<GarageService | null>(null);
   const [bookingForm, setBookingForm] = useState<BookingForm>({
  service: '',
  date: '',
  time: '',
  vehicleModel: '',
  year: '',
  customerName: '',
  phone: '',
  problemDescription: '',
  urgency: ''
});

    const [formErrors, setFormErrors] = useState<BookingFormErrors>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [selectedGarage, setSelectedGarage] = useState<GarageService | null>(null);
    const [filters, setFilters] = useState<Filters>({
        specialty: "",
        location: "",
        priceRange: "",
        rating: "",
        availability: "",
        certified: "",
        sortBy: "nearest",
        vehicleType: "",
        tungendePartner: false,
        weekendService: false
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    // const [viewMode, setViewMode] = useState<"grid" | "list">("list");

    // NOW you can have your functions
    const validateForm = () => {
        const errors: BookingFormErrors = {};

        if (!bookingForm.service) errors.service = 'Please select a service';
        if (!bookingForm.date) errors.date = 'Please select a date';
        if (!bookingForm.time) errors.time = 'Please select a time';
        if (!bookingForm.vehicleModel.trim()) errors.vehicleModel = 'Please enter vehicle make/model';
        if (!bookingForm.customerName.trim()) errors.customerName = 'Please enter your name';
        if (!bookingForm.phone.trim()) errors.phone = 'Please enter your phone number';
        if (!bookingForm.urgency) errors.urgency = 'Please select urgency level';

        // Phone validation (basic)
        if (bookingForm.phone && !/^[0-9+\-\s()]{10,}$/.test(bookingForm.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleBookingSubmit = () => {
        if (validateForm()) {
            console.log('Booking data:', bookingForm);
            alert('Booking request sent! The garage will contact you shortly.');

            setBookingForm({
                service: '',
                date: '',
                time: '',
                vehicleModel: '',
                year: '',
                customerName: '',
                phone: '',
                problemDescription: '',
                urgency: ''
            });
            setFormErrors({});
            setBookingGarage(null);
        }
    };

    const handleInputChange = (field: keyof BookingForm, value: string) => {
        setBookingForm(prev => ({
            ...prev,
            [field]: value
        }));

        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };


    // Filter and sort garages
    const filteredGarages = useMemo(() => {
        const filtered = garageServices.filter(garage => {
            // Search term filter
            if (searchTerm &&
                !garage.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !garage.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !garage.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))) {
                return false;
            }

            // Specialty filter
            if (filters.specialty && garage.specialty !== filters.specialty) {
                return false;
            }

            // Location filter
            if (filters.location && garage.location !== filters.location) {
                return false;
            }

            // Vehicle type filter
            if (filters.vehicleType) {
                if (filters.vehicleType === "cars" && garage.vehicleType === "motorcycles") return false;
                if (filters.vehicleType === "motorcycles" && garage.vehicleType === "cars") return false;
            }

            // Rating filter
            if (filters.rating && garage.rating < parseFloat(filters.rating)) {
                return false;
            }

            // Availability filter
            if (filters.availability) {
                if (filters.availability === 'available' && !garage.availability.includes('Available')) {
                    return false;
                }
                if (filters.availability === 'busy' && garage.availability.includes('Available')) {
                    return false;
                }
            }

            // Certified filter
            if (filters.certified) {
                if (filters.certified === 'certified' && !garage.certified) {
                    return false;
                }
            }

            // Tugende Partner filter
            if (filters.tungendePartner && !garage.tungendePartner) {
                return false;
            }

            // Weekend service filter
            if (filters.weekendService && !garage.weekendService) {
                return false;
            }

            return true;
        });

        // Apply sorting
        switch (filters.sortBy) {
            case 'nearest':
                filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'tugende-first':
                filtered.sort((a, b) => {
                    if (a.tungendePartner && !b.tungendePartner) return -1;
                    if (!a.tungendePartner && b.tungendePartner) return 1;
                    return parseFloat(a.distance) - parseFloat(b.distance);
                });
                break;
            case 'response-time':
                filtered.sort((a, b) => parseInt(a.responseTime) - parseInt(b.responseTime));
                break;
        }

        return filtered;
    }, [searchTerm, filters]);

    // Filter options
    const filterOptions = useMemo(() => {
        const specialties = [...new Set(garageServices.map(garage => garage.specialty))];
        const locations = [...new Set(garageServices.map(garage => garage.location))];
        return { specialties, locations };
    }, []);

    // Paginated garages
    const visibleGarages = useMemo(() => {
        return filteredGarages.slice(0, page * SERVICES_PER_PAGE);
    }, [filteredGarages, page]);

    const hasMore = visibleGarages.length < filteredGarages.length;

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
            specialty: "",
            location: "",
            priceRange: "",
            rating: "",
            availability: "",
            certified: "",
            sortBy: "nearest",
            vehicleType: "",
            tungendePartner: false,
            weekendService: false
        });
        setSearchTerm("");
    };

    const activeFiltersCount = Object.values(filters).filter(value =>
        value && value !== "nearest" && value !== false
    ).length + (searchTerm ? 1 : 0);

    // const tungendePartners = garageServices.filter(g => g.tungendePartner);

    return (
        <div className="flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
            <SideBar />
            {/* Main Content */}
            <main className="ml-72 flex-1 min-h-screen">
                <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {/* Top Stats Bar */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Tugende Certified Garages
                                </h1>
                                <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                    Find trusted Garages and Mechanics for your Boda Boda or Vehicle
                                </p>
                            </div>

                            <div className="hidden md:flex gap-3">
                                {/* <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md">
                                    <Shield className="w-4 h-4 inline mr-2" />
                                    {tungendePartners.length} Tugende Partners
                                </div> */}
                                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md">
                                    <CheckCircle className="w-4 h-4 inline mr-2" />
                                    {garageServices.filter(g => g.availability.includes('Available')).length} Available Today
                                </div>
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md">
                                    <Award className="w-4 h-4 inline mr-2" />
                                    Avg Rating: 4.6★
                                </div>
                            </div>
                        </div>

                        {/* Quick Filter Chips */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {/* <button
                                onClick={() => setFilters(prev => ({ ...prev, tungendePartner: !prev.tungendePartner }))}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.tungendePartner
                                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                            >
                                <Shield className="w-4 h-4 inline mr-2" />
                                Tugende Partners Only
                            </button> */}

                            <button
                                onClick={() => setFilters(prev => ({ ...prev, vehicleType: prev.vehicleType === "motorcycles" ? "" : "motorcycles" }))}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.vehicleType === "motorcycles"
                                    ? 'bg-orange-600 text-white shadow-lg scale-105'
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                    }`}
                            >
                                <Bike className="w-4 h-4 inline mr-2" />
                                Motorcycles
                            </button>

                            <button
                                onClick={() => setFilters(prev => ({ ...prev, vehicleType: prev.vehicleType === "cars" ? "" : "cars" }))}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.vehicleType === "cars"
                                    ? 'bg-green-600 text-white shadow-lg scale-105'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                            >
                                <Car className="w-4 h-4 inline mr-2" />
                                Cars
                            </button>

                            <button
                                onClick={() => setFilters(prev => ({ ...prev, availability: prev.availability === "available" ? "" : "available" }))}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.availability === "available"
                                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                    }`}
                            >
                                <Zap className="w-4 h-4 inline mr-2" />
                                Available Now
                            </button>
                        </div>

                        {/* Search and Filter Controls */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <SearchBar
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onClear={() => setSearchTerm("")}
                                        placeholder="Search by garage name, service, or location..."

                                    />
                                    <Wrench className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                    className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                                >
                                    <option value="nearest">Nearest First</option>
                                    <option value="tugende-first">Tugende Partners First</option>
                                    <option value="rating">Highest Rating</option>
                                    <option value="response-time">Fastest Response</option>
                                </select>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-sm relative ${showFilters || activeFiltersCount > 0
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <Filter className="w-5 h-5" />
                                    <span className="font-medium">More Filters</span>
                                    {activeFiltersCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Advanced Filters Panel */}
                        {showFilters && (
                            <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-purple-600" />
                                        Advanced Filters
                                    </h3>
                                    {activeFiltersCount > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                            Clear All Filters
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <select
                                            value={filters.location}
                                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">All Locations</option>
                                            {filterOptions.locations.map(location => (
                                                <option key={location} value={location}>{location}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                                        <select
                                            value={filters.specialty}
                                            onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">All Specialties</option>
                                            {filterOptions.specialties.map(specialty => (
                                                <option key={specialty} value={specialty}>{specialty}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                                        <select
                                            value={filters.rating}
                                            onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Any Rating</option>
                                            <option value="4.5">4.5+ Stars</option>
                                            <option value="4.0">4.0+ Stars</option>
                                            <option value="3.5">3.5+ Stars</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={filters.weekendService}
                                                onChange={(e) => setFilters(prev => ({ ...prev, weekendService: e.target.checked }))}
                                                className="mr-2 rounded text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-sm">Weekend Service</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Results Summary */}
                        <div className="mt-4 text-sm text-gray-600">
                            Showing {visibleGarages.length} of {filteredGarages.length} garages
                            {activeFiltersCount > 0 ? ' matching your criteria' : ''}
                        </div>
                    </div>
                </header>
                {filteredGarages.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-6">🔧</div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">No garages found</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            We couldn&apos;t find any garages matching your criteria. Try adjusting your filters or search terms.
                        </p>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {visibleGarages.map((garage) => (
                            <div
                                key={garage.id}
                                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
                            >
                                {/* Tugende Partner Badge */}
                                {/* {garage.tungendePartner && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 via-blue-500 to-transparent px-6 py-2 text-white text-sm font-bold rounded-bl-2xl">
                                        <Shield className="w-4 h-4 inline mr-1" />
                                        TUGENDE CERTIFIED
                                    </div>
                                )} */}

                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Garage Image */}
                                    <div className="w-full lg:w-64 h-48 lg:h-40 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600">
                                            <Image
                                                src={garage.image} // ← This assumes you're mapping over garageServices and have access to each `garage`
                                                alt={garage.name}
                                                className="w-full h-full object-cover"
                                                width={256}
                                                height={160}
                                            />
                                        </div>
                                    </div>

                                    {/* Garage Details */}
                                    <div className="flex-1">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                                                        {garage.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        {garage.certified && (
                                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3" />
                                                                Certified
                                                            </span>
                                                        )}
                                                        {garage.vehicleType === "motorcycles" && (
                                                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                                                <Bike className="w-3 h-3" />
                                                                Motorcycles
                                                            </span>
                                                        )}
                                                        {garage.vehicleType === "cars" && (
                                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                                                <Car className="w-3 h-3" />
                                                                Cars
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-medium text-gray-800">{garage.rating}</span>
                                                        <span className="text-sm text-gray-500">({garage.reviewCount})</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 text-red-500" />
                                                        <span>{garage.location} • {garage.distance} km</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Zap className="w-4 h-4 text-blue-500" />
                                                        <span>{garage.responseTime} response</span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{garage.description}</p>
                                            </div>

                                            <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-1 mt-4 lg:mt-0">
                                                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${garage.availability.includes('Available')
                                                    ? 'bg-green-500'
                                                    : 'bg-orange-500'
                                                    }`}>
                                                    {garage.availability}
                                                </span>
                                                <span className="text-sm font-medium text-gray-800">{garage.priceRange}</span>
                                            </div>
                                        </div>

                                        {/* Services */}
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-2">
                                                {garage.services.slice(0, 4).map((service, index) => (
                                                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium">
                                                        {service}
                                                    </span>
                                                ))}
                                                {garage.services.length > 4 && (
                                                    <span className="text-xs text-gray-500 px-2 py-1">
                                                        +{garage.services.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                    <span>{garage.openHours}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4 text-purple-500" />
                                                    <span>{garage.experience}</span>
                                                </div>
                                                {garage.weekendService && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4 text-green-500" />
                                                        <span>Weekend</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {/* Call */}
                                                <a
                                                    href={`tel:${garage.phone}`}
                                                    className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-sm hover:shadow-md"
                                                >
                                                    <Phone className="w-3.5 h-3.5" />
                                                    Call
                                                </a>

                                                {/* View */}
                                                <button
                                                    onClick={() => setSelectedGarage(garage)}
                                                    className="flex items-center gap-1.5 text-blue-600 text-xs font-medium hover:text-blue-700 transition-colors group/btn border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50"
                                                >
                                                    <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                                    View
                                                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>

                                                {/* Directions */}
                                                <button
                                                    onClick={() => {
                                                        const query = encodeURIComponent(garage.location); // or use lat/lng
                                                        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
                                                        window.open(mapUrl, '_blank');
                                                    }}
                                                    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-sm hover:shadow-md"
                                                >
                                                    <Navigation className="w-3.5 h-3.5" />
                                                    Directions
                                                </button>

                                                {/* Book Now */}
                                                <button
                                                    onClick={() => setBookingGarage(garage)} // You’ll define this modal below
                                                    className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-indigo-600 hover:to-fuchsia-600 transition-all duration-300 shadow-sm hover:shadow-md"
                                                >
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    Book Now
                                                </button>
                                            </div>



                                        </div>
                                    </div>
                                </div>

                                {/* Quick Status Indicators */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                {garage.availability.includes('Available') && (
                                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-transparent w-1/3"></div>
                                )}
                                {garage.tungendePartner && (
                                    <div className="absolute bottom-0 right-0 h-1 bg-gradient-to-l from-blue-500 to-transparent w-1/3"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Loading Spinner */}
                {loading && (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Load More Button */}
                {!loading && hasMore && filteredGarages.length > 0 && (
                    <div className="text-center mt-12">
                        <button
                            onClick={loadMore}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Load More Garages ({filteredGarages.length - visibleGarages.length} remaining)
                        </button>
                    </div>
                )}

                {/* No More Results */}
                {!hasMore && filteredGarages.length > 0 && (
                    <div className="text-center mt-8 text-gray-500">
                        <Wrench className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        That&apos;s all the garages we have!
                    </div>
                )}
            </main>
            {/* Garage Details Modal */}
            {selectedGarage && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{selectedGarage.name}</h2>
                                <button
                                    onClick={() => setSelectedGarage(null)}
                                    className="text-gray-400 hover:text-gray-600 p-2"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Garage Image */}
                                <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-200">
                                    <Image
                                        src={selectedGarage.image.startsWith("/") ? selectedGarage.image : `/${selectedGarage.image}`}
                                        alt={selectedGarage.name}
                                        className="w-full h-full object-cover"
                                        width={256}
                                        height={160}
                                    />
                                </div>

                                {/* Key Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium">{selectedGarage.rating}</span>
                                        <span className="text-sm text-gray-500">({selectedGarage.reviewCount} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-red-500" />
                                        <span className="text-sm">{selectedGarage.location} • {selectedGarage.distance} km</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm">{selectedGarage.openHours}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-green-500" />
                                        <span className="text-sm">{selectedGarage.priceRange}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">About This Garage</h3>
                                    <p className="text-gray-600">{selectedGarage.description}</p>
                                </div>

                                {/* Services */}
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">Services Offered</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedGarage.services.map((service, index) => (
                                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-sm">{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md flex-1">
                                        <Calendar className="w-4 h-4" />
                                        Book Now
                                    </button>

                                    <a
                                        href={`tel:${selectedGarage.phone}`}
                                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-sm hover:shadow-md flex-1"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Call {selectedGarage.phone}
                                    </a>

                                    <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-sm hover:shadow-md flex-1">
                                        <Navigation className="w-4 h-4" />
                                        Directions
                                    </button>
                                </div>


                                {/* Special Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {selectedGarage.tungendePartner && (
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                            <Shield className="w-4 h-4" />
                                            Tugende Certified Partner
                                        </span>
                                    )}
                                    {selectedGarage.certified && (
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                            <Award className="w-4 h-4" />
                                            Certified Mechanic
                                        </span>
                                    )}
                                    {selectedGarage.weekendService && (
                                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Weekend Service
                                        </span>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedGarage.availability.includes('Available')
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {selectedGarage.availability}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {bookingGarage && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Book Service</h2>
                                <button
                                    onClick={() => setBookingGarage(null)}
                                    className="text-gray-400 hover:text-gray-600 p-2"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Garage Info */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {bookingGarage.name}
                                        </h3>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{bookingGarage.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-red-500" />
                                            <span>{bookingGarage.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone className="w-4 h-4 text-green-500" />
                                            <span>{bookingGarage.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Form */}
                                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleBookingSubmit(); }}>
                                    {/* Service */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Service *
                                        </label>
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={bookingForm.service}
                                            onChange={(e) => handleInputChange('service', e.target.value)}
                                        >
                                            <option value="">Choose a service...</option>
                                            {bookingGarage.services.map((service, index) => (
                                                <option key={index} value={service}>
                                                    {service}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.service && <p className="text-red-500 text-sm mt-1">{formErrors.service}</p>}
                                    </div>

                                    {/* Date and Time */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Preferred Date *
                                            </label>
                                            <input
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]}
                                                value={bookingForm.date}
                                                onChange={(e) => handleInputChange('date', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {formErrors.date && <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Preferred Time *
                                            </label>
                                            <select
                                                value={bookingForm.time}
                                                onChange={(e) => handleInputChange('time', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select time...</option>
                                                {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.time && <p className="text-red-500 text-sm mt-1">{formErrors.time}</p>}
                                        </div>
                                    </div>

                                    {/* Vehicle Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Vehicle Make/Model *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Honda CBR, Toyota Corolla"
                                                value={bookingForm.vehicleModel}
                                                onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {formErrors.vehicleModel && <p className="text-red-500 text-sm mt-1">{formErrors.vehicleModel}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                            <input
                                                type="number"
                                                placeholder="2020"
                                                value={bookingForm.year}
                                                min="1990"
                                                max={new Date().getFullYear()}
                                                onChange={(e) => handleInputChange('year', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Full name"
                                                value={bookingForm.customerName}
                                                onChange={(e) => handleInputChange('customerName', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {formErrors.customerName && <p className="text-red-500 text-sm mt-1">{formErrors.customerName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                            <input
                                                type="tel"
                                                placeholder="0701234567"
                                                value={bookingForm.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                                        </div>
                                    </div>

                                    {/* Problem Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Describe the Issue</label>
                                        <textarea
                                            placeholder="Please describe what's wrong with your vehicle..."
                                            rows={3}
                                            value={bookingForm.problemDescription}
                                            onChange={(e) => handleInputChange('problemDescription', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        ></textarea>
                                    </div>

                                    {/* Urgency */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { value: 'low', label: 'Low', color: 'green', desc: 'Can wait a few days' },
                                                { value: 'medium', label: 'Medium', color: 'yellow', desc: 'Within 1-2 days' },
                                                { value: 'high', label: 'High', color: 'red', desc: 'Urgent/Emergency' },
                                            ].map((urgency) => (
                                                <label key={urgency.value} className="relative">
                                                    <input
                                                        type="radio"
                                                        name="urgency"
                                                        value={urgency.value}
                                                        checked={bookingForm.urgency === urgency.value}
                                                        onChange={(e) => handleInputChange('urgency', e.target.value)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className={`border-2 border-gray-300 rounded-lg p-3 text-center cursor-pointer transition-all peer-checked:border-${urgency.color}-500 peer-checked:bg-${urgency.color}-50 hover:bg-gray-50`}>
                                                        <div className="font-medium text-sm">{urgency.label}</div>
                                                        <div className="text-xs text-gray-500">{urgency.desc}</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {formErrors.urgency && <p className="text-red-500 text-sm mt-1">{formErrors.urgency}</p>}
                                    </div>

                                    {/* Estimated Cost */}
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Estimated Cost Range:</span>
                                            <span className="font-semibold text-blue-600">{bookingGarage.priceRange}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Final cost may vary based on diagnosis and parts needed
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setBookingGarage(null)}
                                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                                        >
                                            Send Booking Request
                                        </button>
                                    </div>
                                </form>

                                {/* Contact Alternative */}
                                <div className="text-center text-sm text-gray-500 border-t pt-4">
                                    Or call directly:
                                    <a
                                        href={`tel:${bookingGarage.phone}`}
                                        className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                                    >
                                        {bookingGarage.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}