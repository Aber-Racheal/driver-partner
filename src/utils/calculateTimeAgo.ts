// utils/calculateTimeAgo.ts
export const calculateTimeAgo = (postedDate: string) => {
  const now = new Date();
  const posted = new Date(postedDate.replace(/(\d+)(st|nd|rd|th)/, "$1")); // Remove ordinal suffix
  const diffMs = now.getTime() - posted.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};
