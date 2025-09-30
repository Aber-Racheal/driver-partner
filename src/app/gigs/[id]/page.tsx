"use client";

import { useParams, useRouter } from "next/navigation";
import { gigs } from "@/data/gigsData";
import { useState } from "react";
import {
    MapPin,
    User,
    Star,
    BadgeCheck,
    Gift,
    Heart,
    Share2,
    ArrowLeft,
    Calendar,
    Navigation,
    Shield,
    Users,
    TrendingUp,
    Award,
    MessageSquare,
    Phone,
    Clock,
} from "lucide-react";
import SideBar from "@/app/components/SideBar";
import Button from "@/app/components/Buttons";
import { notFound } from "next/navigation";
import { calculateTimeAgo } from "@/utils/calculateTimeAgo";
import { calculateGigStatus, getStatusStyling, sortGigsByStatusPriority } from "@/utils/gigStatusUtils";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";


export default function GigDetailsPage() {

    // Add these state variables at the top of your component with other useState declarations

    const [isFavorite, setIsFavorite] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);

    // Add these handler functions
    const handleShare = async () => {
        const shareData = {
            title: gig?.title || "Tugende Driver Partner Opportunity",
            text: `Check out this driver partner opportunity: ${gig?.title}`,
            url: typeof window !== "undefined" ? window.location.href : "",
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard! 📋");
            }
        } catch (err) {
            console.error("Share failed:", err);
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(shareData.url);
            alert("Link copied to clipboard! 📋");
        }
        setShowShareOptions(false);
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        // Here you would typically save to localStorage or send to your backend
        console.log(`${gig?.title} ${!isFavorite ? 'added to' : 'removed from'} favorites`);
    };

    const router = useRouter();
    const { id } = useParams();
    const gigId = Number(id);
    const gig = gigs.find((g) => g.id === gigId);

    if (!gig) return notFound();

    const dynamicStatus = calculateGigStatus(gig.postedDate, gig.deadline, gig.status);
    const statusStyling = getStatusStyling(dynamicStatus);

    const similarGigs = sortGigsByStatusPriority(
        gigs.filter((g) => g.type === gig.type && g.id !== gig.id)
    ).slice(0, 4);

    return (
        <div className="flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
            <SideBar />
            <main className="ml-72 flex-1">
                {/* Header */}
                <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-4">
                    <div className="flex items-center justify-between max-w-6xl mx-auto">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    // If user came from within the app, go back, otherwise go to gigs list
                                    if (window.history.length > 2) {
                                        router.back();
                                    } else {
                                        router.push('/gigs');
                                    }
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800">Gig Details</h1>
                                <p className="text-xs text-gray-600">Review and apply for this opportunity</p>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Share Button with Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowShareOptions(!showShareOptions)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                                    >
                                        <Share2 className="w-4 h-4 text-gray-600" />
                                    </button>

                                    {/* Share Options Dropdown */}
                                    {showShareOptions && (
                                        <div className="absolute top-12 left-0 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-48 z-30">
                                            <div className="space-y-2">
                                                <button
                                                    onClick={handleShare}
                                                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                    Share via...
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        await navigator.clipboard.writeText(window.location.href);
                                                        alert("Link copied to clipboard! 📋");
                                                        setShowShareOptions(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                                                >
                                                    <div className="w-4 h-4 flex items-center justify-center">📋</div>
                                                    Copy Link
                                                </button>
                                                {/* Social sharing options */}
                                                <button
                                                    onClick={() => {
                                                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this opportunity: ${gig?.title}`)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                                                        setShowShareOptions(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors text-sm text-gray-700"
                                                >
                                                    <div className="w-4 h-4 flex items-center justify-center text-blue-500">𝕏</div>
                                                    Share on X
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                                                        setShowShareOptions(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors text-sm text-gray-700"
                                                >
                                                    <div className="w-4 h-4 flex items-center justify-center text-blue-600">f</div>
                                                    Share on Facebook
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Favorite Button */}
                                <button
                                    onClick={handleFavorite}
                                    className={`p-2 rounded-full transition-colors group relative ${isFavorite
                                        ? 'bg-red-50 text-red-500'
                                        : 'hover:bg-red-50 text-gray-600'
                                        }`}
                                >
                                    <Heart
                                        className={`w-4 h-4 transition-all ${isFavorite
                                            ? 'fill-red-500 text-red-500 scale-110'
                                            : 'group-hover:text-red-500'
                                            }`}
                                    />

                                    {/* Favorite animation effect */}
                                    {isFavorite && (
                                        <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Hero Card */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                {/* Status Banner */}
                                <div className="relative">
                                    {['URGENT', 'CLOSING SOON'].includes(dynamicStatus.status) && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 h-1 animate-pulse"></div>
                                    )}
                                    <div className="p-6 pb-4">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold shadow-md ${gig.typeColor}`}>
                                                    {gig.type}
                                                </span>

                                                <span className={statusStyling.className}>
                                                    {dynamicStatus.status}
                                                </span>

                                                <div className="flex items-center gap-1 text-gray-500 text-xs">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{calculateTimeAgo(gig.postedDate)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="text-xs font-medium text-gray-800">4.8</span>
                                                <span className="text-xs text-gray-500">(23 reviews)</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                                            {gig.title}
                                        </h1>

                                        {/* Payment */}
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl mb-4 shadow-md">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-green-100 text-xs">Total Payment</p>
                                                    <p className="text-xl font-bold">{gig.pay}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-green-100 text-xs">Per Hour</p>
                                                    <p className="text-lg font-semibold">UGX 15,000</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { icon: User, label: "Posted by", value: gig.postedBy, color: "text-purple-500", bg: "bg-purple-50" },
                                    { icon: MapPin, label: "Location", value: gig.location, color: "text-red-500", bg: "bg-red-50" },
                                    { icon: Calendar, label: "Date", value: gig.postedDate, color: "text-blue-500", bg: "bg-blue-50" },
                                    { icon: Navigation, label: "Distance", value: "2.3 km away", color: "text-green-500", bg: "bg-green-50" }
                                ].map((item, index) => (
                                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${item.bg} group-hover:scale-105 transition-transform`}>
                                                <item.icon className={`w-4 h-4 ${item.color}`} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                                <p className="font-semibold text-gray-800 text-sm">{item.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                                    Description
                                </h2>
                                <p className="text-gray-700 leading-relaxed text-sm">{gig.description}</p>
                            </div>

                            {/* Requirements */}
                            {gig.requirements?.length > 0 && (
                                <div className="bg-white rounded-xl p-6 shadow-md">
                                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
                                        Requirements
                                    </h2>
                                    <div className="grid gap-3">
                                        {gig.requirements.map((req, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="p-1.5 bg-purple-100 rounded-md">
                                                    <BadgeCheck className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <span className="text-gray-700 font-medium text-sm">{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            {gig.benefits?.length > 0 && (
                                <div className="bg-white rounded-xl p-6 shadow-md">
                                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                                        Benefits & Perks
                                    </h2>
                                    <div className="grid gap-3">
                                        {gig.benefits.map((benefit, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                                <div className="p-1.5 bg-green-100 rounded-md">
                                                    <Gift className="w-4 h-4 text-green-600" />
                                                </div>
                                                <span className="text-gray-700 font-medium text-sm">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            {/* Quick Stats */}
                            <div className="bg-white rounded-xl p-4 shadow-md">
                                <h3 className="text-base font-bold text-gray-800 mb-3">Quick Stats</h3>
                                <div className="space-y-3">
                                    {[
                                        { icon: Users, label: "Applicants", value: "12", color: "text-blue-500" },
                                        { icon: TrendingUp, label: "Success Rate", value: "94%", color: "text-green-500" },
                                        { icon: Award, label: "Client Rating", value: "4.9★", color: "text-yellow-500" },
                                        { icon: Shield, label: "Verified Client", value: "Yes", color: "text-purple-500" }
                                    ].map((stat, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                                <span className="text-gray-700 font-medium text-sm">{stat.label}</span>
                                            </div>
                                            <span className="font-bold text-gray-800 text-sm">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Panel */}
                            <div className="bg-white rounded-xl p-4 shadow-md">
                                <h3 className="text-base font-bold text-gray-800 mb-3">Take Action</h3>
                                <div className="space-y-3">
                                    <Button
                                        text={dynamicStatus.status === "URGENT" ? "Apply Now!" : "Apply for Gig"}
                                        variant={dynamicStatus.status === "URGENT" ? "primary" : "secondary"}
                                        onClick={() => router.push(`/gigs/${gig.id}/apply`)}
                                    />

                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="flex items-center justify-center gap-1 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs">
                                            <MessageSquare className="w-3 h-3" />
                                            <span className="font-medium">Message</span>
                                        </button>
                                        <button className="flex items-center justify-center gap-1 p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs">
                                            <Phone className="w-3 h-3" />
                                            <span className="font-medium">Call</span>
                                        </button>
                                    </div>

                                    <button className="w-full flex items-center justify-center gap-1 p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-xs">
                                        <Heart className="w-3 h-3" />
                                        <span className="font-medium">Save Gig</span>
                                    </button>
                                </div>
                            </div>

                            {/* Safety Tips */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4 text-yellow-600" />
                                    <h3 className="font-bold text-gray-800 text-sm">Safety First</h3>
                                </div>
                                <ul className="text-xs text-gray-700 space-y-1">
                                    <li>• This a trusted client by <strong>TUGENDE</strong></li>
                                    <li>• No Employer will ask for money</li>
                                    <li>• Report any suspicious activity</li>
                                </ul>
                            </div>

                            {/* Similar Gigs */}
                            <div className="bg-white rounded-xl p-4 shadow-md">
                                <h3 className="text-base font-bold text-gray-800 mb-3">Similar Gigs</h3>
                                <div className="space-y-2">
                                    {similarGigs.length > 0 ? (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        similarGigs.map((similarGig: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; pay: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; location: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                                            <div
                                                key={similarGig.id}
                                                className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    window.location.href = `/gigs/${similarGig.id}`;
                                                }}
                                            >
                                                <p className="font-medium text-gray-800 text-sm mb-1">{similarGig.title}</p>
                                                <p className="text-xs text-gray-600">{similarGig.pay} • {similarGig.location}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500">No similar gigs found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}