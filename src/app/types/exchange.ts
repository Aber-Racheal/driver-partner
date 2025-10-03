import { ExchangeOffer } from "./offers";

// types/exchange.ts
export interface CurrentBike {
  model: string;
  year: number;
  mileage: number;
  currentValue: number;
  remainingLoan: number;
  equity: number;
  ownershipMonths: number;
  condition: 'excellent' | 'good' | 'fair';
}

export interface ApplicationDocument {
  id: string;
  name: string;
  description: string;
  acceptedTypes: string; // Changed from unknown to string
  uploaded: boolean;
  file?: File | null;
  url?: string;
}

export interface Application {
  id: string;
  bike: ExchangeOffer;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'scheduled';
  submittedDate: string;
  estimatedCompletion: string;
  currentStep: number;
  documents: ApplicationDocument[];
  notes: string;
  reviewComments?: string;
  scheduleDate?: string;
}


export type { ExchangeOffer };
// Remove the duplicate ExchangeOffer interface from here
// It's now properly defined in offers.ts