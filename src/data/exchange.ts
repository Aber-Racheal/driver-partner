import { CurrentBike, ExchangeOffer } from "@/app/types/exchange";
import { ApplicationDocument } from "@/app/types/exchange";

// Mock data
export const exchangeOffers: ExchangeOffer[] = [
    {
        id: "ex1",
        type: "exchange", // Added type field
        bikeModel: "Bajaj Boxer 150",
        bikeBrand: "Bajaj",
        year: 2024,
        mileage: 0,
        exchangePrice: 8500000,
        currentBikeValue: 4500000,
        topUpRequired: 4000000,
        location: "Kampala",
        images: ["/bikes/bajaj-boxer-2024.jpg"],
        features: ["Fuel Efficient", "Low Maintenance", "Durable"],
        condition: "excellent",
        availableUnits: 5,
        deliveryTime: "2-3 days",
        creditRequirement: 650,
        minOwnershipMonths: 12,
        description: "Brand new 2024 Bajaj Boxer with improved fuel efficiency and comfort",
        discount: 15,
        maxSavings: 1275000,
        expiryDate: "2024-12-31",
        terms: [
            "Minimum 12 months ownership of current bike",
            "Credit score of 650+ required",
            "Current bike must be in good condition",
            "Top-up payment required"
        ],
        isQualified: true,
        isFeatured: true,
        voucherCode: "UPGRADE15",
        usageCount: 0,
        maxRedemptions: 1,
        category: "premium",
        image: "/bikes/bajaj-boxer-2024.jpg" // Added required image field
    },
    {
        id: "ex2",
        type: "exchange", // Added type field
        bikeModel: "TVS Star 125",
        bikeBrand: "TVS",
        year: 2023,
        mileage: 1500,
        exchangePrice: 7200000,
        currentBikeValue: 3800000,
        topUpRequired: 3400000,
        location: "Entebbe",
        images: ["/bikes/tvs-star-125.jpg"],
        features: ["Smooth Ride", "Good Mileage", "Comfortable Seat"],
        condition: "good",
        availableUnits: 3,
        deliveryTime: "1 week",
        creditRequirement: 600,
        minOwnershipMonths: 8,
        description: "Well-maintained 2023 TVS Star 125 with low mileage",
        discount: 10,
        maxSavings: 720000,
        expiryDate: "2024-11-30",
        terms: [
            "Minimum 8 months ownership",
            "Credit score of 600+ required",
            "Bike inspection mandatory",
            "Insurance transfer included"
        ],
        isQualified: true,
        isFeatured: false,
        voucherCode: "UPGRADE10",
        usageCount: 0,
        maxRedemptions: 1,
        category: "standard",
        image: "/bikes/tvs-star-125.jpg" // Added required image field
    }
];

export const currentBike: CurrentBike = {
    model: "Bajaj Boxer 100",
    year: 2021,
    mileage: 45000,
    currentValue: 3200000,
    remainingLoan: 1800000,
    equity: 1400000,
    ownershipMonths: 24,
    condition: "good"
};

export const requiredDocuments: ApplicationDocument[] = [
    { 
        id: "doc1", 
        name: "National ID Copy", 
        description: "Copy of your national identification card",
        acceptedTypes: "image/*,.pdf",
        uploaded: false
    },
    { 
        id: "doc2", 
        name: "Current Bike Logbook", 
        description: "Copy of your current bike logbook",
        acceptedTypes: "image/*,.pdf",
        uploaded: false
    },
    { 
        id: "doc3", 
        name: "Recent Payment Receipts (3 months)", 
        description: "Recent payment receipts for the last 3 months",
        acceptedTypes: "image/*,.pdf",
        uploaded: false
    },
    { 
        id: "doc4", 
        name: "Bike Front Photo", 
        description: "Clear photo of the front of your bike",
        acceptedTypes: "image/*",
        uploaded: false
    },
    { 
        id: "doc5", 
        name: "Bike Back Photo", 
        description: "Clear photo of the back of your bike",
        acceptedTypes: "image/*",
        uploaded: false
    },
    { 
        id: "doc6", 
        name: "Bike Side Photos", 
        description: "Clear photos of both sides of your bike",
        acceptedTypes: "image/*",
        uploaded: false
    }
];