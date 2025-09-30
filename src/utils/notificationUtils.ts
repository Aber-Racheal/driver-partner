// utils/notificationUtils.ts
import { Notification } from '@/app/types/notifications';

// Get notification icon name based on type
export const getNotificationIconName = (type: Notification['type']) => {
  switch (type) {
    case 'offer':
      return 'Gift';
    case 'gig':
      return 'Briefcase';
    case 'points':
      return 'Coins';
    case 'system':
      return 'AlertCircle';
    case 'reminder':
      return 'Clock';
    case 'achievement':
      return 'Star';
    default:
      return 'Bell';
  }
};

// Get icon class based on priority
export const getIconClass = (priority: Notification['priority']) => {
  return `w-5 h-5 ${
    priority === 'high' ? 'text-red-500' :
    priority === 'medium' ? 'text-orange-500' : 'text-blue-500'
  }`;
};

// Get priority badge color
export const getPriorityColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500 text-white';
    case 'medium':
      return 'bg-orange-500 text-white';
    case 'low':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const formatTimeAgo = (timestamp: string) => {
  let date: Date;

  try {
    date = new Date(timestamp);
  } catch {
    return timestamp;
  }

  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

  // 🔥 Fixed hydration mismatch by adding a specific locale
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
