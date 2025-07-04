const CampaignCard: React.FC<{
  campaign: Campaign;
  onDonate: (campaignId: number) => void;
  onViewDetails: (campaignId: number) => void;
}> = ({ campaign, onDonate, onViewDetails }) => {
  const progress = getProgressPercentage(
    campaign.raised_amount,
    campaign.target_amount
  );
  const daysLeft = getDaysRemaining(campaign.deadline);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {campaign.title}
          </h3>
          {campaign.is_active && (
            <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              <CheckCircle size={12} />
              Active
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {campaign.description}
        </p>

        <div className="space-y-3 mb-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Progress</span>
              <span className="text-gray-600">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                ${formatEther(campaign.raised_amount)}
              </div>
              <div className="text-xs text-gray-500">Raised</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {campaign.total_donors}
              </div>
              <div className="text-xs text-gray-500">Donors</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{daysLeft}</div>
              <div className="text-xs text-gray-500">Days Left</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(campaign.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors font-medium"
          >
            <Eye size={16} />
            View Details
          </button>
          <button
            onClick={() => onDonate(campaign.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
          >
            <Heart size={16} />
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};
