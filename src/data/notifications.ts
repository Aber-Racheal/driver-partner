// data/notificationsData.ts
import { Notification } from '@/app/types/notifications';
import { gigs } from './gigsData';

// Function to get urgent/new gigs for notifications
export const getGigNotifications = (): Notification[] => {
  const urgentGigs = gigs
    .filter(gig => gig.status === "NEW" || gig.status === "Urgent")
    .slice(0, 3)
    .map(gig => {
      // Convert gig postedDate to ISO format for consistency
      let isoDate: string;
      try {
        if (gig.postedDate.includes(',')) {
          const [datePart, timePart] = gig.postedDate.split(', ');
          const cleanDatePart = datePart.replace(/(\d+)(st|nd|rd|th)/, '$1');
          const date = new Date(`${cleanDatePart} ${timePart}`);
          isoDate = date.toISOString();
        } else {
          isoDate = gig.postedDate;
        }
      } catch {
        isoDate = new Date().toISOString();
      }

      const priority: 'high' | 'medium' = gig.status === "Urgent" ? "high" : "medium";

      return {
        id: `gig-${gig.id}`,
        type: "gig" as const,
        title: `${gig.status} Gig: ${gig.type}`,
        message: gig.description,
        timestamp: isoDate,
        read: false,
        priority: priority,
        action: {
          label: "View Gig",
          url: `/gigs?highlight=${gig.id}`
        },
        metadata: {
          location: gig.location,
          amount: parseInt(gig.pay.replace(/\D/g, '')) || 0,
          gigId: gig.id
        }
      };
    });

  return urgentGigs;
};

export const initialNotifications: Notification[] = [
  // New Offers
  {
    id: "1",
    type: "offer",
    title: "New Fuel Offer Available!",
    message: "Shell Uganda is offering 15% off on premium fuel. Limited time only!",
    timestamp: "2024-01-15T10:30:00",
    read: false,
    priority: "high",
    action: {
      label: "View Offer",
      url: "/offers?offer=fuel-1"
    },
    metadata: {
      expiryDate: "2024-12-31"
    }
  },
  {
    id: "2",
    type: "offer",
    title: "Exclusive Garage Discount",
    message: "Boda Masters Garage: 25% off comprehensive bike service package",
    timestamp: "2024-01-15T09:15:00",
    read: false,
    priority: "medium",
    action: {
      label: "Claim Now",
      url: "/offers?offer=garage-1"
    }
  },

  // Dynamic Gig Notifications from gigs data
  ...getGigNotifications(),

  // Points Notifications
  {
    id: "points-1",
    type: "points",
    title: "Points Expiring Soon!",
    message: "You have 2,500 Tupoints expiring in 7 days. Redeem them now!",
    timestamp: "2024-01-15T07:30:00",
    read: false,
    priority: "high",
    action: {
      label: "Redeem Points",
      url: "/tupoints"
    },
    metadata: {
      points: 2500
    }
  },
  {
    id: "points-2",
    type: "points",
    title: "Bonus Points Earned!",
    message: "You earned 500 bonus points for consistent loan payments this month.",
    timestamp: "2024-01-14T14:00:00",
    read: true,
    priority: "medium",
    metadata: {
      points: 500
    }
  },
  {
    id: "points-3",
    type: "points",
    title: "Tier Upgrade Achieved!",
    message: "Congratulations! You've been upgraded to Gold Tier with exclusive benefits.",
    timestamp: "2024-01-13T11:20:00",
    read: true,
    priority: "high"
  },

  // System Notifications
  {
    id: "system-1",
    type: "system",
    title: "App Maintenance Notice",
    message: "Scheduled maintenance on Saturday 2AM-4AM. App may be unavailable.",
    timestamp: "2024-01-14T18:00:00",
    read: true,
    priority: "medium"
  },
  {
    id: "system-2",
    type: "system",
    title: "New Features Available",
    message: "Check out the new Tupoints redemption system and enhanced gig matching!",
    timestamp: "2024-01-13T15:45:00",
    read: true,
    priority: "low"
  },

  // Reminders
  {
    id: "reminder-1",
    type: "reminder",
    title: "Loan Payment Due Tomorrow",
    message: "Friendly reminder: Your loan payment of UGX 85,000 is due tomorrow.",
    timestamp: "2024-01-15T12:00:00",
    read: false,
    priority: "high",
    metadata: {
      amount: 85000
    }
  },
  {
    id: "reminder-2",
    type: "reminder",
    title: "Vehicle Service Due",
    message: "Your bike is due for routine maintenance. Book with partner garages for discounts.",
    timestamp: "2024-01-14T10:30:00",
    read: true,
    priority: "medium"
  },

  // Achievements
  {
    id: "achievement-1",
    type: "achievement",
    title: "100 Rides Milestone!",
    message: "Amazing! You've completed 100 rides on the platform. Keep up the great work!",
    timestamp: "2024-01-13T09:15:00",
    read: true,
    priority: "medium",
    metadata: {
      badge: "Century Rider"
    }
  },
  {
    id: "achievement-2",
    type: "achievement",
    title: "Perfect Week Streak",
    message: "You maintained a 7-day perfect rating streak. Excellent performance!",
    timestamp: "2024-01-12T17:30:00",
    read: true,
    priority: "low"
  }
];