// data/settingsData.ts
import { UserSettings, SecuritySettings } from '@/app/types/settings';

export const initialUserSettings: UserSettings = {
  profile: {
    name: "John Boda",
    email: "john.boda@tugende.com",
    phone: "+256 712 345 678",
    profilePicture: "/media/ray.png",
    location: "Kampala, Uganda"
  },
  notifications: {
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    offerAlerts: true,
    gigAlerts: true,
    paymentAlerts: true
  },
  preferences: {
    language: "en",
    currency: "UGX",
    theme: "light",
    defaultView: "dashboard",
    autoRefresh: true
  },
  privacy: {
    showOnlineStatus: true,
    shareLocation: true,
    allowDataCollection: true,
    twoFactorAuth: false
  }
};

export const initialSecuritySettings: SecuritySettings = {
  changePassword: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  },
  sessionTimeout: 30,
  loginAlerts: true
};

export const languageOptions = [
  { value: "en", label: "English" },
  { value: "sw", label: "Swahili" },
  { value: "lg", label: "Luganda" },
  { value: "fr", label: "French" }
];

export const currencyOptions = [
  { value: "UGX", label: "UGX - Ugandan Shilling" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "KES", label: "KES - Kenyan Shilling" },
  { value: "TZS", label: "TZS - Tanzanian Shilling" }
];

export const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "auto", label: "Auto (System)" }
];

export const defaultViewOptions = [
  { value: "dashboard", label: "Dashboard" },
  { value: "gigs", label: "Gigs" },
  { value: "offers", label: "Offers" }
];