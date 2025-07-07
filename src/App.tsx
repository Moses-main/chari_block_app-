// App.tsx

import "./App";

import React, { useState } from "react";
import { Campaign, Donation } from "./types";
import { Header } from "./components/Header";
import { CampaignCard } from "./components/CampaignCard";
import { DonationModal } from "./components/DonationModal";
import { UserProfile } from "./components/UserProfile";
import { useAccount, useDisconnect } from "@starknet-react/core";
// import { formatDate } from "./utils/formatters";
// import { Clock, DollarSign } from "lucide-react";

// Mock data
const initialCampaigns: Campaign[] = [
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
  // Add more mock campaigns as needed
];

const initialDonations: Donation[] = [];

const App: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [activeTab, setActiveTab] = useState("campaigns");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // const { walletConnected, userAddress, connectWallet, disconnectWallet } =
  //   useWallet();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const walletConnected = !!address;
  const userAddress = address || "";
  const handleDonate = () => {
    if (!selectedCampaign || !donationAmount) return;

    const donation: Donation = {
      id: donations.length + 1,
      donor_address: userAddress,
      campaign_id: selectedCampaign.id,
      amount: parseFloat(donationAmount) * 1000,
      timestamp: Date.now(),
      donor_message: donationMessage,
    };

    const updatedCampaigns = campaigns.map((c) =>
      c.id === selectedCampaign.id
        ? {
            ...c,
            raised_amount: c.raised_amount + donation.amount,
            total_donors: c.total_donors + 1,
          }
        : c
    );

    setDonations([...donations, donation]);
    setCampaigns(updatedCampaigns);
    setDonationAmount("");
    setDonationMessage("");
    setSelectedCampaign(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        walletConnected={walletConnected}
        userAddress={userAddress}
        disconnectWallet={disconnect}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "campaigns" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                walletConnected={walletConnected}
                onDonateClick={() => {
                  setSelectedCampaign(campaign);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
        )}

        {activeTab === "profile" && walletConnected && (
          <UserProfile
            donations={donations}
            campaigns={campaigns}
            userAddress={userAddress}
          />
        )}

        {/* {activeTab === "profile" && walletConnected && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Donations</h2>
            {donations
              .filter((d) => d.donor_address === userAddress)
              .map((donation) => {
                const campaign = campaigns.find(
                  (c) => c.id === donation.campaign_id
                );
                return (
                  <div
                    key={donation.id}
                    className="p-4 border border-gray-200 rounded-xl flex items-start space-x-4 bg-white"
                  >
                    <div className="bg-green-100 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{campaign?.title}</h3>
                      <p className="text-sm text-gray-600">
                        {donationMessage && `"${donation.donor_message}"`}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(donation.timestamp)}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )} */}
      </main>

      {showModal && selectedCampaign && (
        <DonationModal
          selectedCampaign={selectedCampaign}
          donationAmount={donationAmount}
          setDonationAmount={setDonationAmount}
          donationMessage={donationMessage}
          setDonationMessage={setDonationMessage}
          onClose={() => setShowModal(false)}
          onConfirm={handleDonate}
        />
      )}
    </div>
  );
};

export default App;
