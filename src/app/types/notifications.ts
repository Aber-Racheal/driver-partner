// types/notifications.ts
export interface Notification {
  id: string;
  type: 'offer' | 'gig' | 'points' | 'system' | 'reminder' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  action?: {
    label: string;
    url: string;
  };
  metadata?: {
    points?: number;
    expiryDate?: string;
    location?: string;
    amount?: number;
    badge?: string;
    gigId?: number;
  };
}

export type NotificationFilter = "all" | "unread" | "offers" | "gigs" | "points";