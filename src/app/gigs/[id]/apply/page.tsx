"use client";

import { useParams, notFound } from "next/navigation";
import { gigs } from "@/data/gigsData";
import {
    BadgeCheck,
    Heart,
    Share2,
    ArrowLeft,
    Upload,
    FileText,
    CheckCircle,
    Shield,
    Clock,
    MapPin,
    DollarSign,
    User,
    Phone,
    CreditCard,
    AlertCircle,
    Zap,
    Award,
    XCircle,
    CalendarX,
    CheckSquare
} from "lucide-react";
import SideBar from "@/app/components/SideBar";
import Button from "@/app/components/Buttons";
import { useState, useMemo } from "react";

export default function GigApplication() {

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
    const { id } = useParams();
    const gigId = Number(id);
    const gig = gigs.find((g) => g.id === gigId);

    const [uploads, setUploads] = useState({
        license: null as File | null,
        nin: null as File | null,
        coverLetter: null as File | null,
        resume: null as File | null,
    });
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Enhanced user data for Driver Partner context
    const user = {
        name: "Ray Mugisha",
        phone: "+256 700 123456",
        driverId: "TUG12345",
        verified: true,
        loanStatus: "Active", // Current loan status
        creditScore: "Good", // Credit scoring for driver partnerships
        memberSince: "2023",
        completedPartnerJobs: 23, // Partner jobs completed, not rides
        partnerRating: 4.7 // Rating from partner work, not ride-hailing
    };

    // Check if application deadline has passed
    const applicationStatus = useMemo(() => {
        if (!gig || !gig.deadline) return { canApply: true, status: 'open' };
        
        // Parse the deadline (format: "7th October 2025")
        const deadline = new Date(gig.deadline); // Safe parsing
        const now = new Date();
        
        if (now > deadline) {
            return { 
                canApply: false, 
                status: 'closed',
                message: 'Application deadline has passed'
            };
        }
        
        // Check if close to deadline (within 7 days for better testing with your data)
        const daysUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (daysUntilDeadline <= 7) {
            return { 
                canApply: true, 
                status: 'urgent',
                message: 'Application closes soon!'
            };
        }
        
        return { canApply: true, status: 'open' };
    }, [gig]);

 

    if (!gig) return notFound();

    const handleFileChange = (field: keyof typeof uploads, file: File | null) => {
        setUploads({ ...uploads, [field]: file });
    };

    const handleSubmit = async () => {
        if (!applicationStatus.canApply) {
            return alert("Sorry, applications are no longer being accepted for this opportunity. The deadline has passed.");
        }

        const missingFields = Object.entries(uploads)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, file]) => file === null)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return alert(
                `Please upload all required documents before submitting.\nMissing: ${missingFields.join(", ")}`
            );
        }

        if (!agreed) {
            return alert("Please confirm details before submitting.");
        }

        setIsSubmitting(true);

        // Simulate submission
        setTimeout(() => {
            setIsSubmitting(false);
            alert(`Application submitted successfully for ${gig.title}! 🎉`);
        }, 2000);
    };

    // Status indicator component
    const StatusIndicator = () => {
        switch (applicationStatus.status) {
            case 'closed':
                return (
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-600 font-medium">No longer accepting applications</span>
                    </div>
                );
            case 'urgent':
                return (
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-orange-600 font-medium">{applicationStatus.message}</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-600 font-medium">Available for applications</span>
                    </div>
                );
        }
    };

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
                                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Apply for Driver Partner Opportunity
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Complete your application to join this partnership
                                </p>
                            </div>
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
                                        <div className="absolute top-12 right-0 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-48 z-30">
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
                </header>

                <div className="p-6">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Application Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Application Status Alert */}
                            {!applicationStatus.canApply && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-red-100 rounded-full">
                                            <XCircle className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-red-800 mb-2">
                                                Applications Closed
                                            </h3>
                                            <p className="text-red-700 leading-relaxed">
                                                Unfortunately, the application deadline for this driver partner opportunity has passed. 
                                                Please check our other available opportunities or sign up for notifications about similar partnerships.
                                            </p>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-red-600">
                                                <div className="flex items-center gap-1">
                                                    <CalendarX className="w-4 h-4" />
                                                    <span>Deadline: {gig.deadline}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Urgent Status Alert */}
                            {applicationStatus.status === 'urgent' && (
                                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-orange-100 rounded-full">
                                            <Clock className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-orange-800 mb-2">
                                                ⚡ Application Closing Soon!
                                            </h3>
                                            <p className="text-orange-700 leading-relaxed">
                                                This driver partner opportunity closes within 24 hours. Submit your application now to secure your spot!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Gig Summary Card */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{gig.title}</h1>
                                        <div className="flex items-center gap-4 text-gray-600 mb-4">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{gig.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm">{gig.postedDate}</span>
                                            </div>
                                            {gig.deadline && (
                                                <div className="flex items-center gap-1">
                                                    <CalendarX className="w-4 h-4" />
                                                    <span className="text-sm">Deadline: {gig.deadline}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5" />
                                            <span className="text-xl font-bold">{gig.pay}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Indicator */}
                                <StatusIndicator />
                            </div>

                            {/* Driver Partner Status */}
                            {user.verified && applicationStatus.canApply && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-green-100 rounded-full">
                                            <BadgeCheck className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-green-800 mb-2">
                                                🎉 Verified Driver Partner
                                            </h3>
                                            <p className="text-green-700 leading-relaxed">
                                                Great news, <span className="font-bold">{user.name}</span>!
                                                As a verified Tugende member with {user.creditScore} credit standing and {user.completedPartnerJobs} completed partner jobs,
                                                your application will receive <span className="font-bold">priority consideration</span>.
                                            </p>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-green-600">
                                                <div className="flex items-center gap-1">
                                                    <Zap className="w-4 h-4" />
                                                    <span>Priority review</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CheckSquare className="w-4 h-4" />
                                                    <span>Trusted partner</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Application Form - Only show if can apply */}
                            {applicationStatus.canApply && (
                                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                                        <h2 className="text-2xl font-bold mb-2">Application Details</h2>
                                        <p className="text-purple-100">Your information is secure and verified via Tugende</p>
                                    </div>

                                    <div className="p-8">
                                        {/* Prefilled Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            {[
                                                { icon: User, label: "Full Name", value: user.name, verified: true },
                                                { icon: Phone, label: "Phone Number", value: user.phone, verified: true },
                                                { icon: CreditCard, label: "Driver/Rider ID", value: user.driverId, verified: true },
                                                { icon: Award, label: "Member Since", value: user.memberSince, verified: true }
                                            ].map((field, index) => (
                                                <div key={index} className="bg-gray-50 rounded-xl p-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <field.icon className="w-5 h-5 text-purple-500" />
                                                        <span className="font-medium text-gray-700">{field.label}</span>
                                                        {field.verified && (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-gray-800 font-semibold">{field.value}</p>
                                                    <p className="text-xs text-green-600">✓ Verified via Tugende</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Document Upload Section */}
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                                <Upload className="w-6 h-6 text-purple-500" />
                                                Required Documents
                                            </h3>

                                            <div className="grid gap-6">
                                                {[
                                                    {
                                                        key: "license",
                                                        label: "Rider/Driver License",
                                                        accept: ".pdf,.jpg,.jpeg,.png",
                                                        description: "Upload a clear photo or scan of your driving license",
                                                        icon: CreditCard,
                                                        color: "blue"
                                                    },
                                                    {
                                                        key: "nin",
                                                        label: "National ID (NIN)",
                                                        accept: ".pdf,.jpg,.jpeg,.png",
                                                        description: "Upload a clear photo of your National ID",
                                                        icon: Shield,
                                                        color: "green"
                                                    },
                                                    {
                                                        key: "coverLetter",
                                                        label: "Cover Letter",
                                                        accept: ".pdf",
                                                        description: "Tell us why you're perfect for this partnership (PDF only)",
                                                        icon: FileText,
                                                        color: "purple"
                                                    },
                                                    {
                                                        key: "resume",
                                                        label: "Resume/CV",
                                                        accept: ".pdf",
                                                        description: "Upload your latest resume (PDF only)",
                                                        icon: FileText,
                                                        color: "indigo"
                                                    }
                                                ].map((field) => (
                                                    <div key={field.key} className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${uploads[field.key as keyof typeof uploads]
                                                            ? 'border-green-300 bg-green-50'
                                                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                                                        }`}>
                                                        <div className="flex items-start gap-4">
                                                            <div className={`p-3 rounded-xl bg-${field.color}-100`}>
                                                                <field.icon className={`w-6 h-6 text-${field.color}-500`} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label className="block font-bold text-gray-800 mb-1">
                                                                    {field.label}
                                                                </label>
                                                                <p className="text-sm text-gray-600 mb-3">{field.description}</p>

                                                                {uploads[field.key as keyof typeof uploads] ? (
                                                                    <div className="flex items-center gap-2 text-green-600 mb-3">
                                                                        <CheckCircle className="w-5 h-5" />
                                                                        <span className="font-medium">
                                                                            {uploads[field.key as keyof typeof uploads]?.name}
                                                                        </span>
                                                                    </div>
                                                                ) : null}

                                                                <input
                                                                    type="file"
                                                                    accept={field.accept}
                                                                    onChange={(e) =>
                                                                        handleFileChange(
                                                                            field.key as keyof typeof uploads,
                                                                            e.target.files ? e.target.files[0] : null
                                                                        )
                                                                    }
                                                                    className="w-full text-sm border border-gray-300 rounded-xl px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Agreement Section */}
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-yellow-800 mb-2">Important Notice</h4>
                                                    <p className="text-yellow-700 text-sm mb-4">
                                                        By submitting this application, you agree to Tugende&apos;s driver partner terms
                                                        and confirm that all provided information is accurate and up-to-date.
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            id="confirm"
                                                            checked={agreed}
                                                            onChange={(e) => setAgreed(e.target.checked)}
                                                            className="w-5 h-5 rounded border-yellow-300 text-purple-600 focus:ring-purple-500"
                                                        />
                                                        <label htmlFor="confirm" className="font-medium text-yellow-800">
                                                            I confirm all details are correct and agree to the partnership terms
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="text-center">
                                            <Button
                                                text={isSubmitting ? "SUBMITTING..." : user.verified ? "SUBMIT WITH PRIORITY" : "SUBMIT APPLICATION"}
                                                variant="primary"
                                                disabled={!agreed || isSubmitting || !applicationStatus.canApply}
                                                onClick={handleSubmit}
                                            />
                                            {user.verified && applicationStatus.canApply && (
                                                <p className="text-sm text-green-600 mt-2 flex items-center justify-center gap-1">
                                                    <Zap className="w-4 h-4" />
                                                    Priority processing for verified Tugende members
                                                </p>
                                            )}
                                            {!applicationStatus.canApply && (
                                                <p className="text-sm text-red-600 mt-2 flex items-center justify-center gap-1">
                                                    <XCircle className="w-4 h-4" />
                                                    Application deadline has passed
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Alternative Actions for Closed Applications */}
                            {!applicationStatus.canApply && (
                                <div className="bg-white rounded-3xl shadow-xl p-8">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">What&apos;s Next?</h3>
                                    <div className="space-y-4">
                                        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all">
                                            View Other Opportunities
                                        </button>
                                        <button className="w-full border-2 border-purple-200 text-purple-600 py-3 rounded-xl font-medium hover:bg-purple-50 transition-all">
                                            Get Notified of Similar Opportunities
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Driver Partner Profile Summary */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Driver Partner Profile</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{user.name}</p>
                                            <p className="text-sm text-gray-600">Verified Member • {user.loanStatus} Loan</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-purple-600">{user.partnerRating}</p>
                                            <p className="text-xs text-gray-500">Partner Rating</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-blue-600">{user.completedPartnerJobs}</p>
                                            <p className="text-xs text-gray-500">Partner Jobs</p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-green-600">{user.creditScore}</p>
                                            <p className="text-xs text-gray-500">Credit Standing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Application Tips */}
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    Application Tips
                                </h3>
                                <ul className="text-sm text-gray-700 space-y-2">
                                    <li>• Upload clear, high-quality documents</li>
                                    <li>• Ensure all information is current</li>
                                    <li>• Highlight relevant partner experience</li>
                                    <li>• Submit before the deadline</li>
                                    <li>• Check your phone for updates</li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="font-bold text-gray-800 mb-3">Need Help?</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Our driver partner support team is here to assist you.
                                </p>
                                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all">
                                    Contact Partner Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}