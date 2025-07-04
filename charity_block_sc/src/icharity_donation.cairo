// // ===============================
// // INTERFACE DEFINITION
// // ===============================

// use starknet::ContractAddress;

// // Import the structs from the contract
// use super::CharityDonationContract::{Charity, Campaign, Donation, Withdrawal};

// #[starknet::interface]
// pub trait ICharityDonation<TContractState> {
//     // Charity management
//     fn register_charity(ref self: TContractState, name: ByteArray, description: ByteArray);
//     fn verify_charity(ref self: TContractState, charity_address: ContractAddress);
    
//     // Campaign management
//     fn create_campaign(
//         ref self: TContractState,
//         title: ByteArray,
//         description: ByteArray,
//         target_amount: u256,
//         duration_days: u64
//     );
//     fn end_campaign(ref self: TContractState, campaign_id: u256);
    
//     // Donation and withdrawal
//     fn donate_to_campaign(ref self: TContractState, campaign_id: u256, amount: u256, donor_message: ByteArray);
//     fn withdraw_funds(ref self: TContractState, campaign_id: u256, amount: u256, purpose: ByteArray);
    
//     // Admin functions
//     fn pause_contract(ref self: TContractState);
//     fn unpause_contract(ref self: TContractState);
//     fn update_platform_fee(ref self: TContractState, new_fee: u256);
    
//     // View functions
//     fn get_charity(self: @TContractState, charity_address: ContractAddress) -> Charity;
//     fn get_campaign(self: @TContractState, campaign_id: u256) -> Campaign;
//     fn get_donation(self: @TContractState, donation_id: u256) -> Donation;
//     fn get_withdrawal(self: @TContractState, withdrawal_id: u256) -> Withdrawal;
//     fn get_total_campaigns(self: @TContractState) -> u256;
//     fn get_total_donations(self: @TContractState) -> u256;
//     fn is_contract_paused(self: @TContractState) -> bool;
//     fn get_platform_fee(self: @TContractState) -> u256;
//     fn get_active_campaigns(self: @TContractState) -> Array<u256>;
// }