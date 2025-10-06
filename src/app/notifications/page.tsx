"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import {
  Bell,
  Briefcase,
  Coins,
  Star,
  Calendar,
  MapPin,
  DollarSign,
  Filter,
  Trash2,
  CheckCheck,
  Eye,
  EyeOff,
  Gift,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Notification, NotificationFilter } from "../types/notifications";
import { useNotifications } from "../contexts/NotificationsContext";
import { getPriorityColor, formatTimeAgo } from "@/utils/notificationUtils";

// Define the icon function in the component file
const getNotificationIcon = (type: Notification['type'], priority: Notification['priority']) => {
  const iconClass = `w-5 h-5 ${
    priority === 'high' ? 'text-red-500' :
    priority === 'medium' ? 'text-orange-500' : 'text-blue-500'
  }`;

  switch (type) {
    case 'offer':
      return <Gift className={iconClass} />;
    case 'gig':
      return <Briefcase className={iconClass} />;
    case 'points':
      return <Coins className={iconClass} />;
    case 'system':
      return <AlertCircle className={iconClass} />;
    case 'reminder':
      return <Clock className={iconClass} />;
    case 'achievement':
      return <Star className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

export default function NotificationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<NotificationFilter>("all");
  
  // Use context instead of local state
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAsUnread,
    markAllAsRead, 
    markAllAsUnread, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();

  // Filter notifications based on search and filter
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !notification.read) ||
        (filter === "offers" && notification.type === "offer") ||
        (filter === "gigs" && notification.type === "gig") ||
        (filter === "points" && notification.type === "points");

      return matchesSearch && matchesFilter;
    });
  }, [notifications, searchQuery, filter]);

  // Toggle notification read/unread using context functions
  const toggleReadStatus = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      if (notification.read) {
        markAsUnread(id);
      } else {
        markAsRead(id);
      }
    }
  };

  // Handle notification click with action
  const handleNotificationAction = (notification: Notification) => {
    // First toggle read status
    if (notification.read) {
      markAsUnread(notification.id);
    } else {
      markAsRead(notification.id);
    }
    
    // Then navigate if there's an action
    if (notification.action) {
      router.push(notification.action.url);
    }
  };

  const readCount = notifications.filter(n => n.read).length;

  return (
    <div className="flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <SideBar />

      <main className="ml-72 flex-1 min-h-screen">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p className="text-gray-600 text-sm">
                {unreadCount > 0 ? `${unreadCount} unread • ${readCount} read` : 'All caught up!'}
              </p>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              placeholder="Search notifications..."
            />
          </div>
        </header>

        <div className="p-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <div className="flex flex-wrap gap-2">
                {([
                  { key: "all", label: "All" },
                  { key: "unread", label: `Unread (${unreadCount})` },
                  { key: "offers", label: "Offers" },
                  { key: "gigs", label: "Gigs" },
                  { key: "points", label: "Points" },
                ] as const).map((filterItem) => (
                  <button
                    key={filterItem.key}
                    onClick={() => setFilter(filterItem.key)}
                    className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                      filter === filterItem.key
                        ? "bg-purple-600 text-white shadow"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                  >
                    {filterItem.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All Read
                </button>
              )}
              {readCount > 0 && (
                <button
                  onClick={markAllAsUnread}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  <EyeOff className="w-4 h-4" />
                  Mark All Unread
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications</h3>
                <p className="text-gray-500 text-sm">
                  {searchQuery || filter !== "all"
                    ? "No notifications match your current filters."
                    : "You're all caught up! New notifications will appear here."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-md border transition-all hover:shadow-lg ${
                    notification.read
                      ? 'border-gray-200 opacity-80'
                      : 'border-purple-200 bg-purple-50/50'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${
                              notification.read ? 'text-gray-800' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                notification.priority
                              )}`}
                            >
                              {notification.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">
                          {notification.message}
                        </p>

                        {/* Metadata */}
                        {notification.metadata && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {notification.metadata.points && (
                              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                <Coins className="w-3 h-3" />
                                {notification.metadata.points.toLocaleString()} pts
                              </div>
                            )}
                            {notification.metadata.amount && (
                              <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                <DollarSign className="w-3 h-3" />
                                UGX {notification.metadata.amount.toLocaleString()}
                              </div>
                            )}
                            {notification.metadata.location && (
                              <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                <MapPin className="w-3 h-3" />
                                {notification.metadata.location}
                              </div>
                            )}
                            {notification.metadata.expiryDate && (
                              <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                <Calendar className="w-3 h-3" />
                                Expires {formatTimeAgo(notification.metadata.expiryDate)}
                              </div>
                            )}
                            {notification.metadata.badge && (
                              <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                <Star className="w-3 h-3" />
                                {notification.metadata.badge}
                              </div>
                            )}
                            {/* {notification.metadata.gigId && (
                              <div className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                                <Briefcase className="w-3 h-3" />
                                Gig #{notification.metadata.gigId}
                              </div>
                            )} */}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleNotificationAction(notification)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                              notification.read
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                : "bg-purple-600 text-white hover:bg-purple-700"
                            }`}
                          >
                            {notification.action ? (
                              <>
                                {notification.read ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                                {notification.action.label}
                              </>
                            ) : (
                              <>
                                {notification.read ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                                {notification.read ? "Mark Unread" : "Mark Read"}
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}