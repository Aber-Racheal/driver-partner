// app/types/settings.ts
export interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    profilePicture: string;
    location: string;
  };
  notifications: {
    pushNotifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    offerAlerts: boolean;
    gigAlerts: boolean;
    paymentAlerts: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    theme: 'light' | 'dark' | 'auto';
    defaultView: 'dashboard' | 'gigs' | 'offers';
    autoRefresh: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    shareLocation: boolean;
    allowDataCollection: boolean;
    twoFactorAuth: boolean;
  };
}

export interface SecuritySettings {
  changePassword: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  sessionTimeout: number;
  loginAlerts: boolean;
}