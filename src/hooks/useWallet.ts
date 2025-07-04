// hooks/useWallet.ts

import { useState } from "react";

export const useWallet = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const connectWallet = () => {
    setTimeout(() => {
      setWalletConnected(true);
      setUserAddress("0x1234567890abcdef...");
    }, 1000);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setUserAddress("");
  };

  return {
    walletConnected,
    userAddress,
    connectWallet,
    disconnectWallet,
  };
};
