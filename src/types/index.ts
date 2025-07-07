// types/index.ts

export interface Charity {
  name: string;
  description: string;
  wallet_address: string;
  is_verified: boolean;
  total_raised: number;
  campaigns_count: number;
  registration_date: number;
}

export interface Campaign {
  id: number;
  charity_address: string;
  title: string;
  description: string;
  target_amount: number;
  raised_amount: number;
  deadline: number;
  is_active: boolean;
  created_at: number;
  total_donors: number;
}

export interface Donation {
  id: number;
  donor_address: string;
  campaign_id: number;
  amount: number;
  timestamp: number;
  donor_message: string;
}

// ===================================================

// This document contains all the missing components, types, and utilities
// to complete your dApp based on the `App.tsx` structure you shared.

// // ==============================
// // src/types/index.ts
// // ==============================
// export interface Campaign {
//   id: number;
//   charity_address: string;
//   title: string;
//   description: string;
//   target_amount: number;
//   raised_amount: number;
//   deadline: number;
//   is_active: boolean;
//   created_at: number;
//   total_donors: number;
// }

// export interface Donation {
//   id: number;
//   donor_address: string;
//   campaign_id: number;
//   amount: number;
//   timestamp: number;
//   donor_message: string;
// }

// export interface Charity {
//   name: string;
//   description: string;
//   wallet_address: string;
//   is_verified: boolean;
//   total_raised: number;
//   campaigns_count: number;
//   registration_date: number;
// }
