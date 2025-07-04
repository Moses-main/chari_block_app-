import "./App_old";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Users,
  Target,
  Calendar,
  Wallet,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Clock,
  User,
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

// Mock data for demonstration
const mockCampaigns: Campaign[] = [
  {
    id: 1,
    charity_address: "0x123...",
    title: "Clean Water for Rural Communities",
    description:
      "Providing clean drinking water access to remote villages in Nigeria",
    target_amount: 50000,
    raised_amount: 32500,
    deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
    is_active: true,
    created_at: Date.now() - 10 * 24 * 60 * 60 * 1000,
    total_donors: 127,
  },
  {
    id: 2,
    charity_address: "0x456...",
    title: "Education for All Children",
    description:
      "Building schools and providing educational materials for underprivileged children",
    target_amount: 75000,
    raised_amount: 18900,
    deadline: Date.now() + 45 * 24 * 60 * 60 * 1000,
    is_active: true,
    created_at: Date.now() - 5 * 24 * 60 * 60 * 1000,
    total_donors: 89,
  },
  {
    id: 3,
    charity_address: "0x789...",
    title: "Healthcare Mobile Clinics",
    description:
      "Mobile medical units serving remote areas with basic healthcare services",
    target_amount: 100000,
    raised_amount: 67800,
    deadline: Date.now() + 20 * 24 * 60 * 60 * 1000,
    is_active: true,
    created_at: Date.now() - 15 * 24 * 60 * 60 * 1000,
    total_donors: 203,
  },
];

const mockDonations: Donation[] = [
  {
    id: 1,
    donor_address: "0xabc...",
    campaign_id: 1,
    amount: 500,
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    donor_message: "Hope this helps! Great cause.",
  },
  {
    id: 2,
    donor_address: "0xdef...",
    campaign_id: 1,
    amount: 1000,
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    donor_message: "Clean water is a basic human right.",
  },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "campaigns" | "donate" | "charity" | "profile"
  >("campaigns");
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");

  // Mock wallet connection
  const connectWallet = async () => {
    // Simulate wallet connection
    setTimeout(() => {
      setWalletConnected(true);
      setUserAddress("0x1234567890abcdef...");
    }, 1000);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setUserAddress("");
  };

  const formatAmount = (amount: number) => {
    return (amount / 1000).toFixed(1) + "K";
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getDaysLeft = (deadline: number) => {
    const days = Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const handleDonate = () => {
    if (!selectedCampaign || !donationAmount) return;

    const newDonation: Donation = {
      id: donations.length + 1,
      donor_address: userAddress,
      campaign_id: selectedCampaign.id,
      amount: parseFloat(donationAmount) * 1000, // Convert to wei-like units
      timestamp: Date.now(),
      donor_message: donationMessage,
    };

    setDonations([...donations, newDonation]);

    // Update campaign
    const updatedCampaigns = campaigns.map((c) =>
      c.id === selectedCampaign.id
        ? {
            ...c,
            raised_amount: c.raised_amount + newDonation.amount,
            total_donors: c.total_donors + 1,
          }
        : c
    );
    setCampaigns(updatedCampaigns);

    setShowDonationModal(false);
    setDonationAmount("");
    setDonationMessage("");
  };

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  CharityChain
                </h1>
                <p className="text-sm text-gray-600">
                  Transparent Giving, Verified Impact
                </p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              {["campaigns", "donate", "charity", "profile"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {walletConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "campaigns" && (
          <div>
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Raised
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      ₦{formatAmount(119200)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Campaigns
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {campaigns.length}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Donors
                    </p>
                    <p className="text-3xl font-bold text-gray-900">419</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Impact Score
                    </p>
                    <p className="text-3xl font-bold text-gray-900">98%</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
              <div className="relative flex-1 md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {getDaysLeft(campaign.deadline)} days left
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {campaign.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {campaign.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900">
                          ₦{formatAmount(campaign.raised_amount)} raised
                        </span>
                        <span className="text-gray-600">
                          of ₦{formatAmount(campaign.target_amount)}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${getProgressPercentage(
                              campaign.raised_amount,
                              campaign.target_amount
                            )}%`,
                          }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{campaign.total_donors} donors</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(campaign.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowDonationModal(true);
                      }}
                      disabled={!walletConnected}
                      className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {walletConnected
                        ? "Donate Now"
                        : "Connect Wallet to Donate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && walletConnected && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Donation History
              </h2>

              <div className="space-y-4">
                {donations
                  .filter((d) => d.donor_address === userAddress)
                  .map((donation) => {
                    const campaign = campaigns.find(
                      (c) => c.id === donation.campaign_id
                    );
                    return (
                      <div
                        key={donation.id}
                        className="flex items-start space-x-4 p-4 border border-gray-200 rounded-xl"
                      >
                        <div className="bg-green-100 p-2 rounded-lg">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {campaign?.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            ₦{formatAmount(donation.amount)} donated
                          </p>
                          {donation.donor_message && (
                            <p className="text-sm text-gray-700 italic">
                              "{donation.donor_message}"
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(donation.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Donation Modal */}
      {showDonationModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Make a Donation
              </h3>
              <button
                onClick={() => setShowDonationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                {selectedCampaign.title}
              </h4>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{
                    width: `${getProgressPercentage(
                      selectedCampaign.raised_amount,
                      selectedCampaign.target_amount
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                ₦{formatAmount(selectedCampaign.raised_amount)} of ₦
                {formatAmount(selectedCampaign.target_amount)} raised
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount (₦)
                </label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Leave a message of support..."
                />
              </div>

              <button
                onClick={handleDonate}
                disabled={!donationAmount}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                Confirm Donation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
