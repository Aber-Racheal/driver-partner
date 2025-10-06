// app/settings/page.tsx
"use client";

import { useState } from "react";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import Image from "next/image";
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Save,
    Camera,
    Mail,
    Phone,
    MapPin,
    Eye,
    EyeOff,
    LogOut,
    Download,
    Trash2,
    HelpCircle,
    FileText
} from "lucide-react";
import { UserSettings, SecuritySettings } from "../types/settings";
import { initialUserSettings, initialSecuritySettings, languageOptions, currencyOptions, themeOptions, defaultViewOptions } from "@/data/settings";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [userSettings, setUserSettings] = useState<UserSettings>(initialUserSettings);
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(initialSecuritySettings);
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    const handleSaveSettings = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaveMessage("Settings saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
    };

    const handleProfileChange = (field: string, value: string) => {
        setUserSettings(prev => ({
            ...prev,
            profile: { ...prev.profile, [field]: value }
        }));
    };

    const handleNotificationChange = (field: string, value: boolean) => {
        setUserSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [field]: value }
        }));
    };

    const handlePreferenceChange = (field: string, value: string | boolean) => {
        setUserSettings(prev => ({
            ...prev,
            preferences: { ...prev.preferences, [field]: value }
        }));
    };

    const handlePrivacyChange = (field: string, value: boolean) => {
        setUserSettings(prev => ({
            ...prev,
            privacy: { ...prev.privacy, [field]: value }
        }));
    };

    const handleSecurityChange = (field: string, value: string | number | boolean) => {
        setSecuritySettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = (field: string, value: string) => {
        setSecuritySettings(prev => ({
            ...prev,
            changePassword: { ...prev.changePassword, [field]: value }
        }));
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "preferences", label: "Preferences", icon: Palette },
        { id: "privacy", label: "Privacy", icon: Shield },
        { id: "security", label: "Security", icon: Shield },
        { id: "account", label: "Account", icon: Settings }
    ];

    return (
        <div className="flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
            <SideBar />

            <main className="ml-72 flex-1 min-h-screen">
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Settings
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Manage your account preferences and settings
                            </p>
                        </div>

                        <SearchBar
                            value=""
                            onChange={() => { }}
                            onClear={() => { }}
                            placeholder="Search settings..."
                        />
                    </div>
                </header>

                <div className="p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Sidebar Navigation */}
                            <div className="lg:w-64 flex-shrink-0">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                    <nav className="space-y-1">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                                                            : "text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    {tab.label}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    {/* Profile Settings */}
                                    {activeTab === "profile" && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                                                <button
                                                    onClick={handleSaveSettings}
                                                    disabled={isSaving}
                                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {isSaving ? "Saving..." : "Save Changes"}
                                                </button>
                                            </div>

                                            {/* Profile Picture */}
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                                                        <Image
                                                            src={userSettings.profile.profilePicture}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                            width={80}  // width in pixels (w-20 = 80px)
                                                            height={80} // height in pixels (h-20 = 80px)
                                                        />
                                                    </div>
                                                    <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-1.5 rounded-full shadow-lg hover:bg-purple-700 transition-colors">
                                                        <Camera className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Profile Photo</h3>
                                                    <p className="text-sm text-gray-600">Recommended: 200x200 pixels</p>
                                                </div>
                                            </div>

                                            {/* Profile Form */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={userSettings.profile.name}
                                                        onChange={(e) => handleProfileChange("name", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email Address
                                                    </label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="email"
                                                            value={userSettings.profile.email}
                                                            onChange={(e) => handleProfileChange("email", e.target.value)}
                                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Phone Number
                                                    </label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="tel"
                                                            value={userSettings.profile.phone}
                                                            onChange={(e) => handleProfileChange("phone", e.target.value)}
                                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Location
                                                    </label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={userSettings.profile.location}
                                                            onChange={(e) => handleProfileChange("location", e.target.value)}
                                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Notifications Settings */}
                                    {activeTab === "notifications" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">Push Notifications</h3>
                                                        <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={userSettings.notifications.pushNotifications}
                                                            onChange={(e) => handleNotificationChange("pushNotifications", e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                                                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={userSettings.notifications.emailNotifications}
                                                            onChange={(e) => handleNotificationChange("emailNotifications", e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">Offer Alerts</h3>
                                                        <p className="text-sm text-gray-600">Get notified about new partner offers</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={userSettings.notifications.offerAlerts}
                                                            onChange={(e) => handleNotificationChange("offerAlerts", e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">Gig Alerts</h3>
                                                        <p className="text-sm text-gray-600">Receive notifications for new gig opportunities</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={userSettings.notifications.gigAlerts}
                                                            onChange={(e) => handleNotificationChange("gigAlerts", e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Preferences Settings */}
                                    {activeTab === "preferences" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-bold text-gray-900">App Preferences</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Language
                                                    </label>
                                                    <select
                                                        value={userSettings.preferences.language}
                                                        onChange={(e) => handlePreferenceChange("language", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    >
                                                        {languageOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Currency
                                                    </label>
                                                    <select
                                                        value={userSettings.preferences.currency}
                                                        onChange={(e) => handlePreferenceChange("currency", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    >
                                                        {currencyOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Theme
                                                    </label>
                                                    <select
                                                        value={userSettings.preferences.theme}
                                                        onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    >
                                                        {themeOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Default View
                                                    </label>
                                                    <select
                                                        value={userSettings.preferences.defaultView}
                                                        onChange={(e) => handlePreferenceChange("defaultView", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    >
                                                        {defaultViewOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Auto Refresh</h3>
                                                    <p className="text-sm text-gray-600">Automatically refresh gig listings</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={userSettings.preferences.autoRefresh}
                                                        onChange={(e) => handlePreferenceChange("autoRefresh", e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Privacy Settings */}
                                    {activeTab === "privacy" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">Show Online Status</h3>
                                                        <p className="text-sm text-gray-600">Allow others to see when you&apos;re online</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={userSettings.privacy.showOnlineStatus}
                                                            onChange={(e) => handlePrivacyChange("showOnlineStatus", e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">Share Location</h3>
                                                        <p className="text-sm text-gray-600">Share your location for better gig matching</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={userSettings.privacy.shareLocation}
                                                            onChange={(e) => handlePrivacyChange("shareLocation", e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                                                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={userSettings.privacy.twoFactorAuth}
                                                            onChange={(e) => handlePrivacyChange("twoFactorAuth", e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Security Settings */}
                                    {activeTab === "security" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>

                                            <div className="space-y-6">
                                                {/* Change Password */}
                                                <div className="bg-gray-50 rounded-lg p-6">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Current Password
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type={showPassword ? "text" : "password"}
                                                                    value={securitySettings.changePassword.currentPassword}
                                                                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                                >
                                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                New Password
                                                            </label>
                                                            <input
                                                                type={showPassword ? "text" : "password"}
                                                                value={securitySettings.changePassword.newPassword}
                                                                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Confirm New Password
                                                            </label>
                                                            <input
                                                                type={showPassword ? "text" : "password"}
                                                                value={securitySettings.changePassword.confirmPassword}
                                                                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                            />
                                                        </div>

                                                        <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                                                            Update Password
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Session Settings */}
                                                <div className="bg-gray-50 rounded-lg p-6">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Settings</h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Session Timeout (minutes)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="5"
                                                                max="120"
                                                                value={securitySettings.sessionTimeout}
                                                                onChange={(e) => handleSecurityChange("sessionTimeout", parseInt(e.target.value))}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900">Login Alerts</h3>
                                                                <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={securitySettings.loginAlerts}
                                                                    onChange={(e) => handleSecurityChange("loginAlerts", e.target.checked)}
                                                                    className="sr-only peer"
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Account Settings */}
                                    {activeTab === "account" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-bold text-gray-900">Account Management</h2>

                                            <div className="space-y-4">
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                    <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
                                                    <p className="text-sm text-red-700 mb-4">
                                                        These actions are irreversible. Please proceed with caution.
                                                    </p>

                                                    <div className="space-y-3">
                                                        <button className="w-full flex items-center justify-between p-3 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <Download className="w-4 h-4 text-red-600" />
                                                                <div className="text-left">
                                                                    <div className="font-medium text-red-800">Export Account Data</div>
                                                                    <div className="text-sm text-red-600">Download all your personal data</div>
                                                                </div>
                                                            </div>
                                                        </button>

                                                        <button className="w-full flex items-center justify-between p-3 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                                <div className="text-left">
                                                                    <div className="font-medium text-red-800">Delete Account</div>
                                                                    <div className="text-sm text-red-600">Permanently delete your account and all data</div>
                                                                </div>
                                                            </div>
                                                        </button>

                                                        <button className="w-full flex items-center justify-between p-3 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <LogOut className="w-4 h-4 text-red-600" />
                                                                <div className="text-left">
                                                                    <div className="font-medium text-red-800">Sign Out Everywhere</div>
                                                                    <div className="text-sm text-red-600">Sign out from all devices</div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <h3 className="font-semibold text-blue-800 mb-2">Support</h3>
                                                    <div className="space-y-3">
                                                        <button className="w-full flex items-center justify-between p-3 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <HelpCircle className="w-4 h-4 text-blue-600" />
                                                                <div className="text-left">
                                                                    <div className="font-medium text-blue-800">Help & Support</div>
                                                                    <div className="text-sm text-blue-600">Get help with your account</div>
                                                                </div>
                                                            </div>
                                                        </button>

                                                        <button className="w-full flex items-center justify-between p-3 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <FileText className="w-4 h-4 text-blue-600" />
                                                                <div className="text-left">
                                                                    <div className="font-medium text-blue-800">Terms & Privacy</div>
                                                                    <div className="text-sm text-blue-600">View our terms and privacy policy</div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Save Message */}
                                    {saveMessage && (
                                        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                                            {saveMessage}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}