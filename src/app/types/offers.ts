export interface BaseOffer {
  id: string;
  category: "premium" | "standard" | "limited";
  isQualified: boolean;
  isFeatured?: boolean;
  discount: number;
  maxSavings: number;
  expiryDate: string;
  description: string;
  terms: string[];
  maxRedemptions: number;
  usageCount: number;
  voucherCode: string;
  partnerName?: string;
  partnerLogo?: string;
  garageName?: string;
  garageLogo?: string;
  image: string;
}

export interface FuelOffer extends BaseOffer {
  type: 'fuel';
  partnerName: string;
  partnerLogo: string;
  locations?: string[];
  fuelType?: string;
  pricePerLiter?: number;
}

export interface GarageOffer extends BaseOffer {
  type: 'garage';
  garageName: string;
  garageLogo: string;
  location: string;
  serviceType?: string[];
  rating?: number;
}

export interface ExchangeOffer extends BaseOffer {
  type: 'exchange';
  bikeModel: string;
  bikeBrand: string;
  year: number;
  mileage: number;
  exchangePrice: number;
  currentBikeValue: number;
  topUpRequired: number;
  location: string;
  images: string[];
  features: string[];
  condition: 'excellent' | 'good' | 'fair';
  availableUnits: number;
  deliveryTime: string;
  creditRequirement: number;
  minOwnershipMonths: number;
}

export interface RedeemedVoucher {
  id: string;
  partnerName?: string;
  garageName?: string;
  partnerLogo?: string;
  garageLogo?: string;
  discount: number;
  voucherCode: string;
  status: "active" | "used" | "expired";
  redeemedDate: string;
  expiryDate: string;
  amountSaved?: number;
  serviceUsed?: string;
  location?: string;
}

export interface RiderStats {
  totalSavings: number;
  activeVouchers: number;
  currentStreak: number;
  redeemedOffers: number;
  ridesThisMonth: number;
  ridesNeededForBonus: number;
}

// Include ExchangeOffer in the union type
export type Offer = FuelOffer | GarageOffer | ExchangeOffer;