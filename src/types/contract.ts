// ===============================
// src/types/contract.ts
// ===============================

export interface Charity {
  name: string;
  description: string;
  wallet_address: string;
  is_verified: boolean;
  total_raised: string;
  campaigns_count: string;
  registration_date: string;
}

export interface Campaign {
  id: string;
  charity_address: string;
  title: string;
  description: string;
  target_amount: string;
  raised_amount: string;
  deadline: string;
  is_active: boolean;
  created_at: string;
  total_donors: string;
}

export interface Donation {
  id: string;
  donor_address: string;
  campaign_id: string;
  amount: string;
  timestamp: string;
  donor_message: string;
}

export interface Withdrawal {
  id: string;
  campaign_id: string;
  amount: string;
  purpose: string;
  timestamp: string;
  approved: boolean;
}

export type WalletConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "failed";
