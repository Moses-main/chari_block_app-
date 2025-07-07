// // src/hooks/useContract.ts

// import { useState, useMemo } from "react";
// import { connect } from "starknetkit";
// import { Provider } from "starknet";
// import { Account, Contract, RpcProvider } from "starknet";
// import { useWallet } from "./useWallet";
// import { CONTRACT_ADDRESS } from "../utils/constant";
// import { Campaign, Charity } from "@/types/contract";

// // Replace this with your full Starknet Cairo ABI
// const CONTRACT_ABI = [
//   {
//     name: "get_campaign",
//     type: "function",
//     inputs: [{ name: "campaign_id", type: "u256" }],
//     outputs: [{ type: "Campaign" }],
//     state_mutability: "view",
//   },
//   // Add more functions...
// ];

// export const useContract = () => {
//   const { walletConnected, userAddress } = useWallet();
//   const [loading, setLoading] = useState(false);

//   const provider = useMemo(() => {
//     return new RpcProvider({
//       nodeUrl: "https://starknet-sepolia.public.blastapi.io",
//     });
//   }, []);

//   // Initialize the contract and account
//   const account = useMemo(() => {
//     if (!walletConnected || !userAddress) return null;
//     return new Account(provider, userAddress, CONTRACT_ABI); // Empty ABI key store for now
//   }, [walletConnected, userAddress, provider]);

//   const contract = useMemo(() => {
//     return new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account || provider);
//   }, [account, provider]);

//   // Functions
//   const registerCharity = async (name: string, description: string) => {
//     if (!account) throw new Error("Wallet not connected");

//     setLoading(true);
//     try {
//       const result = await contract.invoke("register_charity", [
//         name,
//         description,
//       ]);
//       return result;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createCampaign = async (
//     title: string,
//     description: string,
//     targetAmount: string,
//     durationDays: number
//   ) => {
//     if (!account) throw new Error("Wallet not connected");

//     setLoading(true);
//     try {
//       const result = await contract.invoke("create_campaign", [
//         title,
//         description,
//         targetAmount,
//         durationDays,
//       ]);
//       return result;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const donateToCampaign = async (
//     campaignId: string,
//     message: string,
//     amount: string
//   ) => {
//     if (!account) throw new Error("Wallet not connected");

//     setLoading(true);
//     try {
//       const result = await contract.invoke("donate_to_campaign", [
//         campaignId,
//         message,
//         amount,
//       ]);
//       return result;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCampaign = async (campaignId: string): Promise<Campaign> => {
//     const result = await contract.call("get_campaign", [campaignId]);
//     return result as unknown as Campaign;
//   };

//   const getCharity = async (address: string): Promise<Charity> => {
//     const result = await contract.call("get_charity", [address]);
//     return result as unknown as Charity;
//   };

//   return {
//     loading,
//     registerCharity,
//     createCampaign,
//     donateToCampaign,
//     getCampaign,
//     getCharity,
//   };
// };
