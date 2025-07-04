const CampaignDetails: React.FC<{
  campaign: Campaign | null;
  donations: Donation[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ campaign, donations, isOpen, onClose }) => {
  if (!isOpen || !campaign) return null;

  const campaignDonations = donations.filter(
    (d) => d.campaign_id === campaign.id
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Campaign Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {campaign.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {campaign.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <DollarSign className="mx-auto mb-2 text-blue-600" size={24} />
              <div className="text-lg font-bold text-blue-900">
                ${formatEther(campaign.target_amount)}
              </div>
              <div className="text-sm text-blue-600">Target</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Target className="mx-auto mb-2 text-green-600" size={24} />
              <div className="text-lg font-bold text-green-900">
                ${formatEther(campaign.raised_amount)}
              </div>
              <div className="text-sm text-green-600">Raised</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Users className="mx-auto mb-2 text-purple-600" size={24} />
              <div className="text-lg font-bold text-purple-900">
                {campaign.total_donors}
              </div>
              <div className="text-sm text-purple-600">Donors</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Clock className="mx-auto mb-2 text-orange-600" size={24} />
              <div className="text-lg font-bold text-orange-900">
                {getDaysRemaining(campaign.deadline)}
              </div>
              <div className="text-sm text-orange-600">Days Left</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Progress</span>
              <span>
                {getProgressPercentage(
                  campaign.raised_amount,
                  campaign.target_amount
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${getProgressPercentage(
                    campaign.raised_amount,
                    campaign.target_amount
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              Recent Donations
            </h4>
            {campaignDonations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No donations yet. Be the first to support this campaign!
              </p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {campaignDonations.map((donation) => (
                  <div key={donation.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">
                        {donation.donor_address.slice(0, 6)}...
                        {donation.donor_address.slice(-4)}
                      </span>
                      <span className="text-green-600 font-semibold">
                        ${formatEther(donation.amount)}
                      </span>
                    </div>
                    {donation.donor_message && (
                      <p className="text-gray-600 text-sm italic">
                        "{donation.donor_message}"
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(donation.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
