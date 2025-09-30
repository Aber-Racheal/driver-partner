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
  partnerName: string;
  partnerLogo: string;
  locations?: string[];
}

export interface GarageOffer extends BaseOffer {
  garageName: string;
  garageLogo: string;
  location: string;
  serviceType?: string[];
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

export type Offer = FuelOffer | GarageOffer;