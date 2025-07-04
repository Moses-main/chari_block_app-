// ===============================
// src/utils/formatting.ts
// ===============================

import { formatDistanceToNow, format } from "date-fns";

export const formatEth = (wei: string | number): string => {
  const ethValue = Number(wei) / 1e18;
  return ethValue.toFixed(4);
};

export const formatAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (timestamp: string | number): string => {
  const date = new Date(Number(timestamp) * 1000);
  return format(date, "MMM dd, yyyy");
};

export const formatTimeAgo = (timestamp: string | number): string => {
  const date = new Date(Number(timestamp) * 1000);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatProgress = (raised: string, target: string): number => {
  const raisedNum = Number(raised);
  const targetNum = Number(target);
  if (targetNum === 0) return 0;
  return Math.min((raisedNum / targetNum) * 100, 100);
};
