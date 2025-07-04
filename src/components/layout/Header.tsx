// ===============================
// src/components/layout/Header.tsx
// ===============================

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useWallet } from "@/hooks/useWallet";
import { formatAddress } from "@/utils/formatting";
import { ROUTES } from "@/utils/constants";

export const Header: React.FC = () => {
  const { isConnected, address, connectWallet, disconnectWallet, status } =
    useWallet();
  const location = useLocation();

  const navigation = [
    { name: "Home", href: ROUTES.HOME },
    { name: "Campaigns", href: ROUTES.CAMPAIGNS },
    { name: "Charity Dashboard", href: ROUTES.CHARITY_DASHBOARD },
    { name: "Donor Dashboard", href: ROUTES.DONOR_DASHBOARD },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-charity-600" />
            <span className="text-xl font-bold text-gray-900">
              CharityChain
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? "text-primary-600"
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                  <Wallet className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatAddress(address)}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                loading={status === "connecting"}
                className="flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
