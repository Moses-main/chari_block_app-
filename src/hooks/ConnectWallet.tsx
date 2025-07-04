import React, { useState, useEffect } from "react";
import {
  Heart,
  Users,
  Target,
  Calendar,
  Wallet,
  Plus,
  Eye,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";

// Types
interface Charity {
  name: string;
  description: string;
  wallet_address: string;
  is_verified: boolean;
  total_raised: number;
  campaigns_count: number;
  registration_date: number;
}

interface Campaign {
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

interface Donation {
  id: number;
  donor_address: string;
  campaign_id: number;
  amount: number;
  timestamp: number;
  donor_message: string;
}

// Mock Data
const mockCampaigns: Campaign[] = [
  {
    id: 1,
    charity_address: "0x123...abc",
    title: "Clean Water for Rural Communities",
    description:
      "Providing clean water access to 5,000 people in rural areas through well construction and water purification systems.",
    target_amount: 50000,
    raised_amount: 32500,
    deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
    is_active: true,
    created_at: Date.now() - 7 * 24 * 60 * 60 * 1000,
    total_donors: 127,
  },
  {
    id: 2,
    charity_address: "0x456...def",
    title: "Education for Underprivileged Children",
    description:
      "Supporting education by providing school supplies, uniforms, and scholarships for 200 children.",
    target_amount: 25000,
    raised_amount: 18750,
    deadline: Date.now() + 45 * 24 * 60 * 60 * 1000,
    is_active: true,
    created_at: Date.now() - 14 * 24 * 60 * 60 * 1000,
    total_donors: 89,
  },
  {
    id: 3,
    charity_address: "0x789...ghi",
    title: "Emergency Medical Supplies",
    description:
      "Urgent funding needed for medical supplies and equipment for local healthcare centers.",
    target_amount: 15000,
    raised_amount: 14200,
    deadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
    is_active: true,
    created_at: Date.now() - 3 * 24 * 60 * 60 * 1000,
    total_donors: 156,
  },
];

const mockDonations: Donation[] = [
  {
    id: 1,
    donor_address: "0xabc...123",
    campaign_id: 1,
    amount: 500,
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    donor_message: "Hope this helps!",
  },
  {
    id: 2,
    donor_address: "0xdef...456",
    campaign_id: 1,
    amount: 250,
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    donor_message: "Great cause!",
  },
];

// Utility Functions
const formatEther = (wei: number): string => {
  return (wei / 1000000000000000000).toFixed(4);
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};

const getDaysRemaining = (deadline: number): number => {
  const now = Date.now();
  const diff = deadline - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const getProgressPercentage = (raised: number, target: number): number => {
  return Math.min(100, (raised / target) * 100);
};

// Components
const ConnectWallet: React.FC<{ onConnect: (address: string) => void }> = ({
  onConnect,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      onConnect("0x1234...5678");
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-50"
    >
      <Wallet size={20} />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
};
