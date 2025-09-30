export interface Gig {
  id: string | number;
  title: string;
  description?: string;
  type: string;
  status: string;
  location: string;
  pay: string;
  postedBy: string;
  postedDate: string;
  deadline?: string;
  typeColor: string;
}

export interface GigStatusInfo {
  status: string;
  daysUntilDeadline: number;
  isOverdue?: boolean;
  isActive: boolean; 
}

export interface StatusStyling {
  className: string;
  showDot: boolean;
  dotColor: string;
}
export interface StatusCounts {
  NEW: number;
  OPEN: number;
  URGENT: number;
  'CLOSING SOON': number;
  CLOSED: number;
}

export interface Filters {
  type: string;
  status: string;
  location: string;
  payRange: string;
  datePosted: string;
  sortBy: string;
}

export interface FilterOptions {
  types: string[];
  statuses: string[];
  locations: string[];
}


