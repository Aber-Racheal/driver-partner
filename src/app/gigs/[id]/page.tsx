"use client";

import { useParams } from "next/navigation";
import { gigs } from "@/data/gigsData";
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
export default function GigDetailsPage() {
    const { id } = useParams();
    const gigId = Number(id);
    const gig = gigs.find((g) => g.id === gigId);

    if (!gig) return notFound();

    return (
        <div className="flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
            <SideBar />
            <main className="ml-72 flex-1">
                {/* Enhanced Header */}
                <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-6">
                    <div className="flex items-center justify-between max-w-6xl mx-auto">
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Gig Details</h1>
                                <p className="text-sm text-gray-600">Review and apply for this opportunity</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Share2 className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-full transition-colors group">
                                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Hero Card */}
                            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                                {/* Status Banner */}
                                <div className="relative">
                                    {gig.status === 'Urgent' && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 h-2 animate-pulse"></div>
                                    )}
                                    <div className="p-8 pb-6">
                                        <div className="flex items-start justify-between mb-6">
                                          <div className="flex items-center gap-4">
  <span className={`px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg ${gig.typeColor}`}>
    {gig.type}
  </span>

  <span className={`px-3 py-1 rounded-full text-sm font-bold ${gig.statusColor} ${
    gig.status === 'Open' ? 'bg-green-100' :
    gig.status === 'Urgent' ? 'bg-red-100' :
    'bg-yellow-100'
  }`}>
    {gig.status}
  </span>

  <div className="flex items-center gap-1 text-gray-500 text-sm">
    <Clock className="w-4 h-4" />
    <span>{calculateTimeAgo(gig.postedDate)}</span>
  </div>
</div>

                                            <div className="flex items-center gap-2 text-yellow-500">
                                                <Star className="w-5 h-5 fill-current" />
                                                <span className="text-sm font-medium text-gray-800">4.8</span>
                                                <span className="text-xs text-gray-500">(23 reviews)</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                            {gig.title}
                                        </h1>

                                        {/* Payment Highlight */}
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl mb-6 shadow-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-green-100 text-sm">Total Payment</p>
                                                    <p className="text-3xl font-bold">{gig.pay}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-green-100 text-sm">Per Hour</p>
                                                    <p className="text-xl font-semibold">UGX 15,000</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: User, label: "Posted by", value: gig.postedBy, color: "text-purple-500", bg: "bg-purple-50" },
                                    { icon: MapPin, label: "Location", value: gig.location, color: "text-red-500", bg: "bg-red-50" },
                                    { icon: Calendar, label: "Date", value: gig.postedDate, color: "text-blue-500", bg: "bg-blue-50" },
                                    { icon: Navigation, label: "Distance", value: "2.3 km away", color: "text-green-500", bg: "bg-green-50" }
                                ].map((item, index) => (
                                    <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${item.bg} group-hover:scale-110 transition-transform`}>
                                                <item.icon className={`w-6 h-6 ${item.color}`} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                                                <p className="font-semibold text-gray-800">{item.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                                    Description
                                </h2>
                                <p className="text-gray-700 leading-relaxed text-lg">{gig.description}</p>
                            </div>

                            {/* Requirements */}
                            {gig.requirements?.length > 0 && (
                                <div className="bg-white rounded-2xl p-8 shadow-lg">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
                                        Requirements
                                    </h2>
                                    <div className="grid gap-4">
                                        {gig.requirements.map((req, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <BadgeCheck className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <span className="text-gray-700 font-medium">{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            {gig.benefits?.length > 0 && (
                                <div className="bg-white rounded-2xl p-8 shadow-lg">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                                        Benefits & Perks
                                    </h2>
                                    <div className="grid gap-4">
                                        {gig.benefits.map((benefit, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <Gift className="w-5 h-5 text-green-600" />
                                                </div>
                                                <span className="text-gray-700 font-medium">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
                                <div className="space-y-4">
                                    {[
                                        { icon: Users, label: "Applicants", value: "12", color: "text-blue-500" },
                                        { icon: TrendingUp, label: "Success Rate", value: "94%", color: "text-green-500" },
                                        { icon: Award, label: "Client Rating", value: "4.9★", color: "text-yellow-500" },
                                        { icon: Shield, label: "Verified Client", value: "Yes", color: "text-purple-500" }
                                    ].map((stat, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                                <span className="text-gray-700 font-medium">{stat.label}</span>
                                            </div>
                                            <span className="font-bold text-gray-800">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Panel */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Take Action</h3>
                                <div className="space-y-4">
                                    <Button
                                        text={gig.status === "Urgent" ? "Apply Now!" : "Apply for Gig"}
                                        variant={gig.status === "Urgent" ? "primary" : "secondary"}
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                                            <MessageSquare className="w-4 h-4" />
                                            <span className="text-sm font-medium">Message</span>
                                        </button>
                                        <button className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors">
                                            <Phone className="w-4 h-4" />
                                            <span className="text-sm font-medium">Call</span>
                                        </button>
                                    </div>

                                    <button className="w-full flex items-center justify-center gap-2 p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                                        <Heart className="w-4 h-4" />
                                        <span className="text-sm font-medium">Save Gig</span>
                                    </button>
                                </div>
                            </div>

                            {/* Safety Tips */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Shield className="w-5 h-5 text-yellow-600" />
                                    <h3 className="font-bold text-gray-800">Safety First</h3>
                                </div>
                                <ul className="text-sm text-gray-700 space-y-2">
                                    <li>• This a trusted client by <strong>TUGENDE</strong></li>
                                    <li>• No Employer will ask for money</li>
                                    <li>• Report any suspicious activity</li>
                                </ul>
                            </div>

                            {/* Similar Gigs */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Similar Gigs</h3>
                                <div className="space-y-3">
                                    {gigs
                                        .filter((g) => g.type === gig.type && g.id !== gig.id)
                                        .slice(0, 4) // limit to 4 similar gigs
                                        .map((similarGig) => (
                                            <div
                                                key={similarGig.id}
                                                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    window.location.href = `/gigs/${similarGig.id}`;
                                                }}
                                            >
                                                <p className="font-medium text-gray-800 text-sm mb-1">{similarGig.title}</p>
                                                <p className="text-xs text-gray-600">{similarGig.pay} • {similarGig.location}</p>
                                            </div>
                                        ))}
                                    {gigs.filter((g) => g.type === gig.type && g.id !== gig.id).length === 0 && (
                                        <p className="text-sm text-gray-500">No similar gigs found.</p>
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