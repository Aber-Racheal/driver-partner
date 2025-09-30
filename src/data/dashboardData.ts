import { ButtonVariant } from "@/app/types/ButtonTypes";

// Mock user info
export const user = {
  name: "Ray",
  profilePic: "/media/ray.png",
  notifications: 3,
};

// Quick Cards
export const quickCards: {
  id: string;
  title: string;
  value?: number;
  nextReward?: number;
  description?: string;
  buttonText: string;
  variant: ButtonVariant; // 👈 enforce allowed variants
  bg: string;
  textColor?: string;
}[] = [
  {
    id: "points",
    title: "TuPoints",
    value: 150,
    nextReward: 200,
    buttonText: "Redeem",
    variant: "primary", // 👈 use string literal, not the type itself
    bg: "bg-purple-600 text-white",
  },
  {
    id: "vouchers",
    title: "Saved Vouchers",
    description: "You have 2 unused vouchers",
    buttonText: "View all",
    variant: "secondary",
    bg: "bg-pink-100",
    textColor: "text-pink-600",
  },
  {
    id: "loans",
    title: "Active Loans",
    description: "Pay your existing loan to unlock more amazing features",
    buttonText: "View all",
    variant: "secondary",
    bg: "bg-purple-100",
    textColor: "text-purple-600",
  },
];

// Services
export const services = [
  {
    id: "jobs",
    title: "Jobs & Gigs",
    description: "Find work opportunities near you",
  },
  {
    id: "fuel",
    title: "Special Offers",
    description: "Discounts & Vouchers",
  },
  {
    id: "mechanics",
    title: "Garages & Mechanics",
    description: "Find authentic services easily",
  },
];

// Special offers
export const offers = [
  {
    id: "offer1",
    title: "40% OFF FUEL",
    description: "Big on your next fuel purchase at Shell fuel station",
    image: "/media/fuel-offer.png",
  },
  {
    id: "offer2",
    title: "20% OFF FUEL",
    description: "Big on your next fuel purchase at Total fuel station",
    image: "/media/fuel-offer.png",
  },
];


