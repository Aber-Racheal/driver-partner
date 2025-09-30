export interface GarageService {
  id: number;
  name: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  distance: string;
  priceRange: string;
  services: string[];
  phone: string;
  openHours: string;
  image: string;
  specialty: string;
  experience: string;
  certified: boolean;
  availability: string;
  vehicleType: string;
  tungendePartner: boolean;
  responseTime: string;
  weekendService: boolean;
}

export interface Filters {
  specialty: string;
  location: string;
  priceRange: string;
  rating: string;
  availability: string;
  certified: string;
  sortBy: string;
  vehicleType: string;
  tungendePartner: boolean;
  weekendService: boolean;
}

export interface BookingForm {
  service: string;
  date: string;
  time: string;
  vehicleModel: string;
  year: string;
  customerName: string;
  phone: string;
  problemDescription: string;
  urgency: 'low' | 'medium' | 'high' | '';
}

export type BookingFormErrors = Partial<Record<keyof BookingForm, string>>;
