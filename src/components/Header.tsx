// components/Header.tsx

import React from "react";
import { CheckCircle, Heart } from "lucide-react";
import { WalletConnectorModal } from "./modal/WalletConnector";
// interface HeaderProps {
//   walletConnected: boolean;
//   userAddress: string;
//   connectWallet: () => void;
//   disconnectWallet: () => void;
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
// }

interface HeaderProps {
  walletConnected: boolean;
  userAddress: string;
  disconnectWallet: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  walletConnected,
  userAddress,
  // connectWallet,
  disconnectWallet,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
              <Heart className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">CharityChain</h1>
              <p className="text-sm text-gray-600">
                Transparent Giving, Verified Impact
              </p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {["campaigns", "donate", "charity", "profile"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
              <WalletConnectorModal />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
