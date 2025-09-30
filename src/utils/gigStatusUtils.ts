import { Gig, GigStatusInfo, StatusStyling } from "@/app/types/gigs";

// Helper type for gig with dynamicStatus temporarily attached
type DynamicGig = Gig & { dynamicStatus: StatusInfo };

interface StatusInfo extends GigStatusInfo {
  statusColor: string;
  priority: number;
  daysSincePosted: number;
}

/**
 * Calculate dynamic status based on posting date and deadline
 * @param postedDate - Date when gig was posted (format: "23rd September 2025, 07:15")
 * @param deadline - Deadline date (format: "2025-10-07")
 * @param originalStatus - Original status from data (for fallback/priority)
 * @returns {StatusInfo}
 */
export const calculateGigStatus = (
  postedDate: string,
  deadline: string = "",
  originalStatus: string = ""
): StatusInfo => {
  const now = new Date();

  // Parse posted date - handle format like "23rd September 2025, 07:15"
  const parsePostedDate = (dateStr: string): Date => {
    const cleanDate = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
    return new Date(cleanDate);
  };

  const posted = parsePostedDate(postedDate);
  const deadlineDate = new Date(deadline);

  const timeSincePosted = now.getTime() - posted.getTime();
  const timeUntilDeadline = deadlineDate.getTime() - now.getTime();

  const daysSincePosted = Math.floor(timeSincePosted / (1000 * 60 * 60 * 24));
  const daysUntilDeadline = Math.floor(timeUntilDeadline / (1000 * 60 * 60 * 24));

  let status: GigStatusInfo["status"];
  let statusColor: string;
  let priority: number;

  if (daysUntilDeadline < 0) {
    status = "CLOSED";
    statusColor = "text-gray-500 bg-gray-100";
    priority = 5;
  } else if (daysUntilDeadline <= 3) {
    status = "CLOSING SOON";
    statusColor = "text-orange-600 bg-orange-100";
    priority = 4;
  } else if (originalStatus.toLowerCase() === "urgent" && daysUntilDeadline > 3) {
    status = "URGENT";
    statusColor = "text-red-600 bg-red-100";
    priority = 3;
  } else if (daysSincePosted <= 2) {
    status = "NEW";
    statusColor = "text-green-600 bg-green-100";
    priority = 2;
  } else {
    status = "OPEN";
    statusColor = "text-blue-600 bg-blue-100";
    priority = 1;
  }

  return {
    status,
    statusColor,
    priority,
    daysSincePosted,
    daysUntilDeadline,
    isActive: daysUntilDeadline >= 0,
  };
};

/**
 * Get status badge styling with animation for urgent statuses
 * @param statusInfo - Result from calculateGigStatus
 * @returns {StatusStyling}
 */
export const getStatusStyling = (statusInfo: StatusInfo): StatusStyling => {
  const { status, statusColor } = statusInfo;

  const baseClasses = "font-bold text-sm px-3 py-1 rounded-full";
  const pulseAnimation = ["URGENT", "CLOSING SOON"].includes(status) ? "animate-pulse" : "";

  return {
    className: `${baseClasses} ${statusColor} ${pulseAnimation}`,
    showDot: status === "URGENT",
    dotColor: status === "URGENT" ? "bg-red-500" : "bg-orange-500",
  };
};

/**
 * Sort gigs by status priority (for better UX)
 * @param gigs - Array of gigs
 * @returns {Gig[]} - Sorted gigs with highest priority statuses first
 */
export const sortGigsByStatusPriority = (gigs: Gig[]): Gig[] => {
  const gigsWithStatus: DynamicGig[] = gigs.map((gig) => {
    const dynamicStatus = calculateGigStatus(gig.postedDate, gig.deadline ?? "", gig.status);
    return { ...gig, dynamicStatus };
  });

  return gigsWithStatus
    .sort((a, b) => {
      const aPriority = a.dynamicStatus.priority;
      const bPriority = b.dynamicStatus.priority;

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ dynamicStatus, ...gig }) => gig); // remove dynamicStatus before returning
};
