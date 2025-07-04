// components/DonationModal.tsx

import React from "react";
import { Campaign } from "../types";
import { formatAmount, getProgressPercentage } from "../utils/formatters";

interface Props {
  selectedCampaign: Campaign;
  donationAmount: string;
  setDonationAmount: (val: string) => void;
  donationMessage: string;
  setDonationMessage: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const DonationModal: React.FC<Props> = ({
  selectedCampaign,
  donationAmount,
  setDonationAmount,
  donationMessage,
  setDonationMessage,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Make a Donation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
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
            {formatAmount(selectedCampaign.raised_amount)} of{" "}
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
            onClick={onConfirm}
            disabled={!donationAmount}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            Confirm Donation
          </button>
        </div>
      </div>
    </div>
  );
};
