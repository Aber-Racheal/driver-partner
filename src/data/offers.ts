import { FuelOffer, GarageOffer, RedeemedVoucher, RiderStats } from '@/app/types/offers';

export const motivationalMessages: string[] = [
  "Keep riding! Your next fuel discount is just around the corner!",
  "Every ride brings you closer to exclusive garage service deals!",
  "Your dedication on the road earns you premium partner offers!",
  "Great riders deserve great rewards - keep up the amazing work!",
  "Fuel your success with exclusive partner discounts!",
  "Your consistent performance unlocks better offers every month!",
];

export const riderStats: RiderStats = {
  totalSavings: 125000,
  activeVouchers: 3,
  currentStreak: 15,
  redeemedOffers: 8,
  ridesThisMonth: 42,
  ridesNeededForBonus: 8,
};

export const fuelOffers: FuelOffer[] = [
  {
    id: "fuel-1",
    type: "fuel", // Added type field
    category: "premium",
    isQualified: true,
    isFeatured: true,
    partnerName: "Shell Uganda",
    partnerLogo: "/media/shell.png",
    discount: 15,
    maxSavings: 50000,
    expiryDate: "2024-12-31",
    description: "Get 15% off on premium fuel at all Shell stations across Uganda. Perfect for long rides and optimal engine performance.",
    terms: [
      "Valid only for Tugende verified riders",
      "Maximum discount of UGX 50,000 per transaction",
      "Cannot be combined with other offers",
      "Must present rider ID at station",
      "Valid until December 31, 2024"
    ],
    maxRedemptions: 5,
    usageCount: 2,
    voucherCode: "SHELL15-TUG",
    locations: ["Kampala", "Entebbe", "Jinja", "Mbarara", "Gulu"],
    image: '/media/shell.png' // Fixed image path
  },
  {
    id: "fuel-2",
    type: "fuel", // Added type field
    category: "standard",
    isQualified: true,
    partnerName: "Total Energies",
    partnerLogo: "/media/totalenegies.png",
    discount: 10,
    maxSavings: 30000,
    expiryDate: "2024-11-30",
    description: "10% discount on all fuel types at Total Energies stations. Keep your bike running smoothly with quality fuel.",
    terms: [
      "Minimum purchase of UGX 20,000 required",
      "One redemption per day per rider",
      "Valid at participating Total stations",
      "Rider app verification required"
    ],
    maxRedemptions: 10,
    usageCount: 0,
    voucherCode: "TOTAL10-RIDE",
    locations: ["All major towns in Uganda"],
    image: '/media/totalenegies.png' // Fixed image path
  },
  {
    id: "fuel-3",
    type: "fuel", // Added type field
    category: "limited",
    isQualified: false,
    partnerName: "Stabex International",
    partnerLogo: "/media/stabex.png",
    discount: 20,
    maxSavings: 75000,
    expiryDate: "2024-10-15",
    description: "Exclusive 20% discount for top-performing riders. Complete 50+ rides this month to qualify.",
    terms: [
      "Requires 50+ completed rides in current month",
      "Premium rider status required",
      "Valid for super petrol only",
      "Limited time offer"
    ],
    maxRedemptions: 3,
    usageCount: 0,
    voucherCode: "STABEX20-ELITE",
    locations: ["Kampala Central", "Naalya", "Nsambya"],
    image: '/media/stabex.png' // Fixed image path
  },
  {
    id: "fuel-4",
    type: "fuel", // Added type field
    category: "standard",
    isQualified: true,
    partnerName: "City Oil Uganda",
    partnerLogo: "/media/city-oil.jpg",
    discount: 12,
    maxSavings: 40000,
    expiryDate: "2024-12-15",
    description: "12% off on all fuel purchases at City Oil stations. Reliable fuel for reliable riders.",
    terms: [
      "Valid during station operating hours",
      "Present voucher code before payment",
      "Non-transferable",
      "Subject to fuel availability"
    ],
    maxRedemptions: 8,
    usageCount: 1,
    voucherCode: "CITY12-FUEL",
    locations: ["Kampala", "Wakiso", "Mukono"],
    image: '/media/city-oil.jpg' // Fixed image path
  }
];

export const garageOffers: GarageOffer[] = [
  {
    id: "garage-1",
    type: "garage", // Added type field
    category: "premium",
    isQualified: true,
    isFeatured: true,
    garageName: "Boda Masters Garage",
    garageLogo: "/media/garage9.jpg",
    location: "Kampala, Industrial Area",
    discount: 25,
    maxSavings: 100000,
    expiryDate: "2024-12-31",
    description: "Comprehensive bike service package with 25% discount. Includes engine check, brakes, and full maintenance.",
    terms: [
      "Advance booking required",
      "Valid for comprehensive service only",
      "Parts additional at discounted rates",
      "24-hour service available"
    ],
    maxRedemptions: 2,
    usageCount: 0,
    voucherCode: "BODA25-SERVICE",
    serviceType: ["Engine Service", "Brake Check", "Oil Change", "General Maintenance"],
    image: '/media/garage9.jpg'
  },
  {
    id: "garage-2",
    type: "garage", // Added type field
    category: "standard",
    isQualified: true,
    garageName: "Speedy Repairs Center",
    garageLogo: "/media/garage2.jpeg",
    location: "Entebbe Road, Kampala",
    discount: 15,
    maxSavings: 50000,
    expiryDate: "2024-11-20",
    description: "15% off on all repair services. Quick and reliable repairs to keep you on the road.",
    terms: [
      "Valid for labor costs only",
      "Same-day service available",
      "Diagnostic fee waived",
      "Free pick-up within 5km radius"
    ],
    maxRedemptions: 5,
    usageCount: 1,
    voucherCode: "SPEEDY15-FIX",
    serviceType: ["Electrical Repairs", "Tire Services", "Chain Maintenance", "Minor Repairs"],
    image: '/media/garage2.jpeg'
  },
  {
    id: "garage-3",
    type: "garage", // Added type field
    category: "limited",
    isQualified: false,
    garageName: "Premium Bike Care",
    garageLogo: "/media/garage6.jpg",
    location: "Kololo, Kampala",
    discount: 30,
    maxSavings: 150000,
    expiryDate: "2024-10-31",
    description: "Elite 30% discount on premium services for riders with 4.8+ rating and consistent performance.",
    terms: [
      "Minimum 4.8 rider rating required",
      "No active loan defaults",
      "Premium service package only",
      "By appointment only"
    ],
    maxRedemptions: 1,
    usageCount: 0,
    voucherCode: "PREMIUM30-CARE",
    serviceType: ["Full Overhaul", "Premium Parts", "Paint Job", "Custom Modifications"],
    image: '/media/garage6.jpg'
  },
  {
    id: "garage-4",
    type: "garage", // Added type field
    category: "standard",
    isQualified: true,
    garageName: "Community Riders Workshop",
    garageLogo: "/media/garage8.jpg",
    location: "Kisenyi, Kampala",
    discount: 20,
    maxSavings: 60000,
    expiryDate: "2024-12-25",
    description: "20% discount on all services at our community-focused workshop. Supporting fellow riders.",
    terms: [
      "Valid for all service types",
      "Free basic diagnostic",
      "Community rider priority",
      "Extended warranty on repairs"
    ],
    maxRedemptions: 3,
    usageCount: 0,
    voucherCode: "COMM20-RIDE",
    serviceType: ["All Mechanical Repairs", "Electrical Work", "Body Work", "Regular Maintenance"],
    image: '/media/garage8.jpg'
  }
];

export const redeemedFuelVouchers: RedeemedVoucher[] = [
  {
    id: "redeemed-fuel-1",
    partnerName: "Shell Uganda",
    partnerLogo: "/media/shell.png",
    discount: 15,
    voucherCode: "SHELL15-USD",
    status: "active",
    redeemedDate: "2024-09-15",
    expiryDate: "2024-10-15",
    amountSaved: 15000
  },
  {
    id: "redeemed-fuel-2",
    partnerName: "Total Energies",
    partnerLogo: "/media/totalenegies.png",
    discount: 10,
    voucherCode: "TOTAL10-ABC",
    status: "used",
    redeemedDate: "2024-08-20",
    expiryDate: "2024-09-20",
    amountSaved: 8000
  }
];

export const redeemedGarageVouchers: RedeemedVoucher[] = [
  {
    id: "redeemed-garage-1",
    garageName: "Speedy Repairs Center",
    garageLogo: "/media/garage2.jpeg", // Fixed logo path
    discount: 15,
    voucherCode: "SPEEDY15-XYZ",
    status: "active",
    redeemedDate: "2024-09-10",
    expiryDate: "2024-10-10",
    amountSaved: 25000,
    serviceUsed: "Brake System Repair",
    location: "Entebbe Road, Kampala"
  },
  {
    id: "redeemed-garage-2",
    garageName: "Boda Masters Garage",
    garageLogo: "/media/garage9.jpg", // Fixed logo path
    discount: 25,
    voucherCode: "BODA25-DEF",
    status: "expired",
    redeemedDate: "2024-07-05",
    expiryDate: "2024-08-05",
    amountSaved: 45000,
    serviceUsed: "Full Engine Service",
    location: "Industrial Area, Kampala"
  }
];