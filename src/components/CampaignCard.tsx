// components/CampaignCard.tsx

import React from "react";
import { Campaign } from "../types";
import { Calendar, Users } from "lucide-react";
import {
  formatAmount,
  formatDate,
  getDaysLeft,
  getProgressPercentage,
} from "../utils/formatters";

interface CampaignCardProps {
  campaign: Campaign;
  walletConnected: boolean;
  onDonateClick: () => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  walletConnected,
  onDonateClick,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
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
              {formatAmount(campaign.raised_amount)} raised
            </span>
            <span className="text-gray-600">
              of {formatAmount(campaign.target_amount)}
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
          onClick={onDonateClick}
          disabled={!walletConnected}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {walletConnected ? "Donate Now" : "Connect Wallet to Donate"}
        </button>
      </div>
    </div>
  );
};
