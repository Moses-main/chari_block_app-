// ===============================
// src/hooks/useContract.ts
// ===============================

import { useState } from "react";
import { Contract, RpcProvider } from "starknet";
import { useWallet } from "./useWallet";
import { CONTRACT_ADDRESS } from "@/utils/constants";
import { Campaign, Charity, Donation } from "@/types/contract";

// Simplified ABI - you'll need to replace with your actual contract ABI
const CONTRACT_ABI = [
  {
    name: "get_campaign",
    type: "function",
    inputs: [{ name: "campaign_id", type: "u256" }],
    outputs: [{ type: "Campaign" }],
    state_mutability: "view",
  },
  // Add more ABI functions as needed
];

export const useContract = () => {
  const { account } = useWallet();
  const [loading, setLoading] = useState(false);

  const provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io",
  });

  const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);

  const registerCharity = async (name: string, description: string) => {
    if (!account) throw new Error("Wallet not connected");

    setLoading(true);
    try {
      contract.connect(account);
      const result = await contract.register_charity(name, description);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (
    title: string,
    description: string,
    targetAmount: string,
    durationDays: number
  ) => {
    if (!account) throw new Error("Wallet not connected");

    setLoading(true);
    try {
      contract.connect(account);
      const result = await contract.create_campaign(
        title,
        description,
        targetAmount,
        durationDays
      );
      return result;
    } finally {
      setLoading(false);
    }
  };

  const donateToCampaign = async (
    campaignId: string,
    message: string,
    amount: string
  ) => {
    if (!account) throw new Error("Wallet not connected");

    setLoading(true);
    try {
      contract.connect(account);
      const result = await contract.donate_to_campaign(campaignId, message, {
        value: amount,
      });
      return result;
    } finally {
      setLoading(false);
    }
  };

  const getCampaign = async (campaignId: string): Promise<Campaign> => {
    const result = await contract.get_campaign(campaignId);
    return result;
  };

  const getCharity = async (address: string): Promise<Charity> => {
    const result = await contract.get_charity(address);
    return result;
  };

  return {
    loading,
    registerCharity,
    createCampaign,
    donateToCampaign,
    getCampaign,
    getCharity,
  };
};
