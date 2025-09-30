export interface TupointsVoucher {
  id: string;
  type: 'fuel' | 'garage' | 'loan';
  title: string;
  value: number;
  pointsCost: number;
  description: string;
  icon: string;
  available: boolean;
  expiryDays: number;
  terms: string[];
  maxRedemptionsPerMonth: number;
  category: 'premium' | 'standard' | 'exclusive';
  voucherCode: string; 
}

export interface RedeemedTupointsVoucher {
  id: string;
  voucherId: string;
  type: 'fuel' | 'garage' | 'loan';
  title: string;
  value: number;
  voucherCode: string;
  redeemedDate: string;
  expiryDate: string;
  status: 'active' | 'used' | 'expired';
  usedDate?: string;
  usedLocation?: string;
  pointsCost: number;
}

export interface TupointsTransaction {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'spent' | 'bonus';
  category: 'loan_payment' | 'consistent_usage' | 'referral' | 'redemption' | 'milestone' | 'streak';
}

export interface TupointsProfile {
  currentPoints: number;
  totalEarned: number;
  totalSpent: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTier: string;
  pointsToNextTier: number;
  memberSince: string;
  consecutivePayments: number;
  totalLoans: number;
  onTimePaymentRate: number;
  consistencyScore: number;
  streakDays: number;
  badges: string[];
}

export const tupointsProfile: TupointsProfile = {
  currentPoints: 12500,
  totalEarned: 45600,
  totalSpent: 33100,
  tier: 'Gold',
  nextTier: 'Platinum',
  pointsToNextTier: 7500,
  memberSince: '2023-03-15',
  consecutivePayments: 18,
  totalLoans: 8,
  onTimePaymentRate: 100,
  consistencyScore: 95,
  streakDays: 127,
  badges: ['Consistent Payer', 'Loyalty Master', 'Platform Champion', 'Early Adopter']
};

export const tupointsVouchers: TupointsVoucher[] = [
  {
      id: 'tv1',
      type: 'fuel',
      title: '5,000 UGX Fuel Voucher',
      value: 5000,
      pointsCost: 1000,
      description: 'Redeem for 5,000 UGX off on fuel at any partner station',
      icon: 'fuel',
      available: true,
      expiryDays: 30,
      terms: [
          'Valid at all partner fuel stations',
          'Cannot be combined with other offers',
          'One redemption per transaction',
          'Voucher expires 30 days after redemption',
          'Must present voucher code before payment'
      ],
      maxRedemptionsPerMonth: 4,
      category: 'standard',
      voucherCode: ""
  },
  {
      id: 'tv2',
      type: 'fuel',
      title: '15,000 UGX Fuel Voucher',
      value: 15000,
      pointsCost: 3000,
      description: 'Premium fuel savings for consistent riders',
      icon: 'fuel',
      available: true,
      expiryDays: 45,
      terms: [
          'Valid at all partner fuel stations',
          'Cannot be combined with other offers',
          'One redemption per transaction',
          'Voucher expires 45 days after redemption',
          'Must present voucher code before payment',
          'Available only for Gold tier and above'
      ],
      maxRedemptionsPerMonth: 2,
      category: 'premium',
      voucherCode: ""
  },
  {
      id: 'tv3',
      type: 'fuel',
      title: '20,000 UGX Fuel Voucher',
      value: 20000,
      pointsCost: 4000,
      description: 'Maximum fuel savings for our top riders',
      icon: 'fuel',
      available: true,
      expiryDays: 60,
      terms: [
          'Valid at all partner fuel stations',
          'Cannot be combined with other offers',
          'One redemption per transaction',
          'Voucher expires 60 days after redemption',
          'Must present voucher code before payment',
          'Available only for Gold tier and above',
          'Minimum consistency score of 90 required'
      ],
      maxRedemptionsPerMonth: 2,
      category: 'premium',
      voucherCode: ""
  },
  {
      id: 'tv4',
      type: 'fuel',
      title: '30,000 UGX Fuel Voucher',
      value: 30000,
      pointsCost: 6000,
      description: 'Exclusive mega savings for Platinum members',
      icon: 'fuel',
      available: false,
      expiryDays: 90,
      terms: [
          'Valid at all partner fuel stations',
          'Cannot be combined with other offers',
          'One redemption per transaction',
          'Voucher expires 90 days after redemption',
          'Must present voucher code before payment',
          'Available only for Platinum tier',
          'Limited to 1 redemption per month'
      ],
      maxRedemptionsPerMonth: 1,
      category: 'exclusive',
      voucherCode: ""
  },
  {
      id: 'tv5',
      type: 'garage',
      title: '10,000 UGX Garage Services',
      value: 10000,
      pointsCost: 2000,
      description: 'Discount on maintenance and repairs at partner garages',
      icon: 'garage',
      available: true,
      expiryDays: 60,
      terms: [
          'Valid at all Tugende partner garages',
          'Applicable to parts and labor',
          'Cannot be combined with other offers',
          'Voucher expires 60 days after redemption',
          'Present voucher before service begins'
      ],
      maxRedemptionsPerMonth: 3,
      category: 'standard',
      voucherCode: ""
  },
  {
      id: 'tv6',
      type: 'garage',
      title: '25,000 UGX Garage Services',
      value: 25000,
      pointsCost: 5000,
      description: 'Major maintenance discount for serious repairs',
      icon: 'garage',
      available: true,
      expiryDays: 90,
      terms: [
          'Valid at all Tugende partner garages',
          'Applicable to parts and labor',
          'Cannot be combined with other offers',
          'Voucher expires 90 days after redemption',
          'Present voucher before service begins',
          'Available for Gold tier and above'
      ],
      maxRedemptionsPerMonth: 2,
      category: 'premium',
      voucherCode: ""
  },
  {
      id: 'tv7',
      type: 'loan',
      title: 'Interest Rate Discount - 2%',
      value: 0,
      pointsCost: 8000,
      description: '2% off your next loan interest rate',
      icon: 'loan',
      available: true,
      expiryDays: 90,
      terms: [
          'Applies to next loan application only',
          'Must apply loan within 90 days',
          'Minimum loan amount: UGX 500,000',
          'Cannot be combined with other loan offers',
          'Subject to normal loan approval process',
          'Available for Gold tier and above'
      ],
      maxRedemptionsPerMonth: 1,
      category: 'exclusive',
      voucherCode: ""
  },
  {
      id: 'tv8',
      type: 'loan',
      title: 'Loan Processing Fee Waiver',
      value: 0,
      pointsCost: 10000,
      description: 'Waive processing fees on your next loan',
      icon: 'loan',
      available: false,
      expiryDays: 120,
      terms: [
          'Waives all processing fees on next loan',
          'Must apply loan within 120 days',
          'Applicable to any loan amount',
          'Cannot be combined with other loan offers',
          'Subject to normal loan approval process',
          'Available only for Platinum tier',
          'Must have 100% on-time payment record'
      ],
      maxRedemptionsPerMonth: 1,
      category: 'exclusive',
      voucherCode: ""
  }
];

export const tupointsTransactions: TupointsTransaction[] = [
  {
    id: 'tt1',
    date: '2025-09-28',
    description: 'Loan payment on time - Loan #8',
    points: 500,
    type: 'earned',
    category: 'loan_payment'
  },
  {
    id: 'tt2',
    date: '2025-09-27',
    description: '7-day active streak bonus',
    points: 200,
    type: 'bonus',
    category: 'streak'
  },
  {
    id: 'tt3',
    date: '2025-09-25',
    description: 'Redeemed 15,000 UGX Fuel Voucher',
    points: -3000,
    type: 'spent',
    category: 'redemption'
  },
  {
    id: 'tt4',
    date: '2025-09-22',
    description: 'Consistent platform usage bonus',
    points: 300,
    type: 'earned',
    category: 'consistent_usage'
  },
  {
    id: 'tt5',
    date: '2025-09-20',
    description: 'Reached 100 total rides milestone',
    points: 1000,
    type: 'bonus',
    category: 'milestone'
  },
  {
    id: 'tt6',
    date: '2025-09-15',
    description: 'Loan payment on time - Loan #7',
    points: 500,
    type: 'earned',
    category: 'loan_payment'
  },
  {
    id: 'tt7',
    date: '2025-09-12',
    description: 'Referred new rider - Joseph M.',
    points: 800,
    type: 'bonus',
    category: 'referral'
  },
  {
    id: 'tt8',
    date: '2025-09-10',
    description: 'Redeemed 10,000 UGX Garage Services',
    points: -2000,
    type: 'spent',
    category: 'redemption'
  },
  {
    id: 'tt9',
    date: '2025-09-05',
    description: '30-day active streak bonus',
    points: 500,
    type: 'bonus',
    category: 'streak'
  },
  {
    id: 'tt10',
    date: '2025-09-01',
    description: 'Monthly consistency bonus',
    points: 600,
    type: 'earned',
    category: 'consistent_usage'
  }
];

export const redeemedTupointsVouchers: RedeemedTupointsVoucher[] = [
  {
    id: 'rtv1',
    voucherId: 'tv2',
    type: 'fuel',
    title: '15,000 UGX Fuel Voucher',
    value: 15000,
    voucherCode: 'TUPT-15K-A9B2',
    redeemedDate: '2025-09-25',
    expiryDate: '2025-09-09',
    status: 'active',
    pointsCost: 3000, // ✅ Add this
  },
  {
    id: 'rtv2',
    voucherId: 'tv5',
    type: 'garage',
    title: '10,000 UGX Garage Services',
    value: 10000,
    voucherCode: 'TUPG-10K-C4D8',
    redeemedDate: '2025-09-10',
    expiryDate: '2025-11-09',
    status: 'active',
    pointsCost: 2000, // ✅ Add this
  }
];

export const pointsEarningRules = [
  {
    action: 'On-time loan payment',
    points: 500,
    icon: '💰',
    description: 'Earn points for every loan payment made on or before due date'
  },
  {
    action: 'New loan taken',
    points: 300,
    icon: '📝',
    description: 'Bonus points when you take a new loan'
  },
  {
    action: 'Complete 10 rides',
    points: 200,
    icon: '🏍️',
    description: 'Earn points for every 10 rides completed on the platform'
  },
  {
    action: '7-day active streak',
    points: 200,
    icon: '🔥',
    description: 'Weekly bonus for using the platform consistently'
  },
  {
    action: '30-day active streak',
    points: 500,
    icon: '⚡',
    description: 'Monthly bonus for maintaining consistent activity'
  },
  {
    action: 'Refer a rider',
    points: 800,
    icon: '👥',
    description: 'Earn points when referred riders complete first loan'
  },
  {
    action: 'Milestone achievements',
    points: 1000,
    icon: '🏆',
    description: 'Special bonuses for reaching platform milestones'
  },
  {
    action: 'Monthly consistency',
    points: 600,
    icon: '📊',
    description: 'Bonus for maintaining high consistency score'
  }
];

export const tierBenefits = {
  Bronze: {
    color: 'from-orange-400 to-orange-600',
    benefits: ['Basic voucher access', 'Standard point earning rate', 'Community support'],
    minPoints: 0
  },
  Silver: {
    color: 'from-gray-300 to-gray-500',
    benefits: ['Priority voucher access', '1.2x point earning rate', 'Priority support', 'Special monthly offers'],
    minPoints: 5000
  },
  Gold: {
    color: 'from-yellow-400 to-yellow-600',
    benefits: ['Premium voucher access', '1.5x point earning rate', 'Dedicated support', 'Exclusive loan rates', 'Birthday bonuses'],
    minPoints: 15000
  },
  Platinum: {
    color: 'from-purple-400 to-purple-600',
    benefits: ['Exclusive voucher access', '2x point earning rate', 'VIP support', 'Best loan rates', 'Special events access', 'Quarterly rewards'],
    minPoints: 30000
  }
};