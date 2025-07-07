// use starknet::ContractAddress;

#[starknet::contract]
mod CharityDonationContract {
    use starknet::{
        ContractAddress, get_caller_address, get_block_timestamp, 
        get_contract_address
        //  contract_address_const
    };
    
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess,
        Map, StoragePathEntry
    };

    use core::num::traits::Zero;

    // Import ERC20 interface for ETH transfers
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    // ===============================
    // STRUCTS DEFINITIONS
    // ===============================
    
    
    #[derive(Drop, Serde, Clone, starknet::Store)]
    pub struct Charity {
        pub name: ByteArray,
        pub description: ByteArray,
        pub wallet_address: ContractAddress,
        pub is_verified: bool,
        pub total_raised: u256,
        pub campaigns_count: u256,
        pub registration_date: u64,
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct Campaign {
        pub id: u256,
        pub charity_address: ContractAddress,
        pub title: ByteArray,
        pub description: ByteArray,
        pub target_amount: u256,
        pub raised_amount: u256,
        pub deadline: u64,
        pub is_active: bool,
        pub created_at: u64,
        pub total_donors: u256,
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct Donation {
        pub id: u256,
        pub donor_address: ContractAddress,
        pub campaign_id: u256,
        pub amount: u256,
        pub timestamp: u64,
        pub donor_message: ByteArray,
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct Withdrawal {
        pub id: u256,
        pub campaign_id: u256,
        pub amount: u256,
        pub purpose: ByteArray,
        pub timestamp: u64,
        pub approved: bool,
    }

    // ===============================
    // STORAGE
    // ===============================
    
    #[storage]
    struct Storage {
        // Contract admin
        admin: ContractAddress,
        
        // ETH token contract address
        eth_token: ContractAddress,
        
        // Main data storage
        charities: Map<ContractAddress, Charity>,
        campaigns: Map<u256, Campaign>,
        donations: Map<u256, Donation>,
        withdrawals: Map<u256, Withdrawal>,
        
        // ID counters
        next_campaign_id: u256,
        next_donation_id: u256,
        next_withdrawal_id: u256,
        
        // Helper mappings
        has_donated_to_campaign: Map<(ContractAddress, u256), bool>,
        charity_campaigns: Map<(ContractAddress, u256), u256>,
        donor_donations: Map<(ContractAddress, u256), u256>,
        campaign_donations: Map<(u256, u256), u256>,
        
        // Donation counts for iteration
        donor_donation_count: Map<ContractAddress, u256>,
        campaign_donation_count: Map<u256, u256>,
        
        // Contract pause mechanism
        is_paused: bool,
        
        // Platform fee (in basis points, 100 = 1%)
        platform_fee: u256,
        platform_treasury: ContractAddress,
    }

    // ===============================
    // EVENTS
    // ===============================
    
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        CharityRegistered: CharityRegistered,
        CharityVerified: CharityVerified,
        CampaignCreated: CampaignCreated,
        CampaignEnded: CampaignEnded,
        DonationMade: DonationMade,
        FundsWithdrawn: FundsWithdrawn,
        ContractPaused: ContractPaused,
        ContractUnpaused: ContractUnpaused,
        PlatformFeeUpdated: PlatformFeeUpdated,
    }

    #[derive(Drop, starknet::Event)]
    struct CharityRegistered {
        #[key]
        charity_address: ContractAddress,
        name: ByteArray,
        registration_date: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct CharityVerified {
        #[key]
        charity_address: ContractAddress,
        verified_by: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct CampaignCreated {
        #[key]
        campaign_id: u256,
        #[key]
        charity_address: ContractAddress,
        title: ByteArray,
        target_amount: u256,
        deadline: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct CampaignEnded {
        #[key]
        campaign_id: u256,
        total_raised: u256,
        target_reached: bool,
    }

    #[derive(Drop, starknet::Event)]
    struct DonationMade {
        #[key]
        donor_address: ContractAddress,
        #[key]
        campaign_id: u256,
        amount: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct FundsWithdrawn {
        #[key]
        charity_address: ContractAddress,
        #[key]
        campaign_id: u256,
        amount: u256,
        purpose: ByteArray,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct ContractPaused {
        paused_by: ContractAddress,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct ContractUnpaused {
        unpaused_by: ContractAddress,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct PlatformFeeUpdated {
        old_fee: u256,
        new_fee: u256,
        updated_by: ContractAddress,
    }

    // ===============================
    // CONSTRUCTOR
    // ===============================
    
    #[constructor]
    fn constructor(
        ref self: ContractState, 
        admin: ContractAddress,
        eth_token_address: ContractAddress,
        platform_treasury: ContractAddress,
        initial_platform_fee: u256
    ) {
        self.admin.write(admin);
        self.eth_token.write(eth_token_address);
        self.platform_treasury.write(platform_treasury);
        self.platform_fee.write(initial_platform_fee);
        self.next_campaign_id.write(1);
        self.next_donation_id.write(1);
        self.next_withdrawal_id.write(1);
        self.is_paused.write(false);
    }

    // ===============================
    // INTERNAL FUNCTIONS
    // ===============================
    
    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn assert_admin(self: @ContractState) {
            let caller = get_caller_address();
            let admin = self.admin.read();
            assert(caller == admin, 'Only admin can call');
        }

        fn assert_not_paused(self: @ContractState) {
            let is_paused = self.is_paused.read();
            assert(!is_paused, 'Contract is paused');
        }

        fn calculate_platform_fee(self: @ContractState, amount: u256) -> u256 {
            let fee_rate = self.platform_fee.read();
            (amount * fee_rate) / 10000 // Basis points conversion
        }

        fn transfer_eth(self: @ContractState, to: ContractAddress, amount: u256) {
            let eth_token = IERC20Dispatcher { contract_address: self.eth_token.read() };
            let success = eth_token.transfer(to, amount);
            assert(success, 'ETH transfer failed');
        }

        fn transfer_eth_from(
            self: @ContractState, 
            from: ContractAddress, 
            to: ContractAddress, 
            amount: u256
        ) {
            let eth_token = IERC20Dispatcher { contract_address: self.eth_token.read() };
            let success = eth_token.transfer_from(from, to, amount);
            assert(success, 'ETH transfer failed');
        }
    }

    // ===============================
    // EXTERNAL FUNCTIONS
    // ===============================
    
    #[starknet::interface]
    pub trait ICharityDonation<TContractState> {
        // Charity management
        fn register_charity(ref self: TContractState, name: ByteArray, description: ByteArray);
        fn verify_charity(ref self: TContractState, charity_address: ContractAddress);
        
        // Campaign management
        fn create_campaign(
            ref self: TContractState,
            title: ByteArray,
            description: ByteArray,
            target_amount: u256,
            duration_days: u64
        );
        fn end_campaign(ref self: TContractState, campaign_id: u256);
        
        // Donation and withdrawal
        fn donate_to_campaign(ref self: TContractState, campaign_id: u256, amount: u256, donor_message: ByteArray);
        fn withdraw_funds(ref self: TContractState, campaign_id: u256, amount: u256, purpose: ByteArray);
        
        // Admin functions
        fn pause_contract(ref self: TContractState);
        fn unpause_contract(ref self: TContractState);
        fn update_platform_fee(ref self: TContractState, new_fee: u256);
        
        // View functions
        fn get_charity(self: @TContractState, charity_address: ContractAddress) -> Charity;
        fn get_campaign(self: @TContractState, campaign_id: u256) -> Campaign;
        fn get_donation(self: @TContractState, donation_id: u256) -> Donation;
        fn get_withdrawal(self: @TContractState, withdrawal_id: u256) -> Withdrawal;
        fn get_total_campaigns(self: @TContractState) -> u256;
        fn get_total_donations(self: @TContractState) -> u256;
        fn is_contract_paused(self: @TContractState) -> bool;
        fn get_platform_fee(self: @TContractState) -> u256;
        fn get_active_campaigns(self: @TContractState) -> Array<u256>;
    }

    #[abi(embed_v0)]
    impl CharityDonationImpl of ICharityDonation<ContractState> {
        
        fn register_charity(
            ref self: ContractState,
            name: ByteArray,
            description: ByteArray
        ) {
            self.assert_not_paused();
            let caller = get_caller_address();
            
            // Check if charity already exists
            let existing_charity = self.charities.entry(caller).read();
            // let zero_address: ContractAddress = 0x0.try_into().unwrap();
            assert(existing_charity.wallet_address.is_zero(), 'Charity already registered');
            
            let current_time = get_block_timestamp();
            let new_charity = Charity {
                name: name.clone(),
                description: description,
                wallet_address: caller,
                is_verified: false,
                total_raised: 0,
                campaigns_count: 0,
                registration_date: current_time,
            };
            
            self.charities.entry(caller).write(new_charity);
            
            self.emit(CharityRegistered { 
                charity_address: caller, 
                name: name,
                registration_date: current_time,
            });
        }

        fn verify_charity(ref self: ContractState, charity_address: ContractAddress) {
            self.assert_admin();
            
            let charity = self.charities.entry(charity_address).read();
            // let zero_address: ContractAddress = 0x0.try_into().unwrap();            
            assert(!charity.wallet_address.is_zero(), 'Charity does not exist');
            assert(!charity.is_verified, 'Charity already verified');
            
            // Create a new charity struct with is_verified set to true
            let updated_charity = Charity {
                name: charity.name,
                description: charity.description,
                wallet_address: charity.wallet_address,
                is_verified: true,
                total_raised: charity.total_raised,
                campaigns_count: charity.campaigns_count,
                registration_date: charity.registration_date,
            };
            
            self.charities.entry(charity_address).write(updated_charity);
            
            self.emit(CharityVerified { 
                charity_address: charity_address,
                verified_by: get_caller_address(),
            });
        }

        fn create_campaign(
            ref self: ContractState,
            title: ByteArray,
            description: ByteArray,
            target_amount: u256,
            duration_days: u64
        ) {
            self.assert_not_paused();
            let caller = get_caller_address();
            let charity = self.charities.entry(caller).read();
            
            assert(charity.is_verified, 'Charity not verified');
            assert(target_amount > 0, 'Target amount < 0');
            assert(duration_days > 0, 'Duration must be greater than 0');
            assert(duration_days <= 365, 'Duration too long');
            
            let campaign_id = self.next_campaign_id.read();
            let current_time = get_block_timestamp();
            let deadline = current_time + (duration_days * 86400);
            
            let new_campaign = Campaign {
                id: campaign_id,
                charity_address: caller,
                title: title.clone(),
                description: description,
                target_amount: target_amount,
                raised_amount: 0,
                deadline: deadline,
                is_active: true,
                created_at: current_time,
                total_donors: 0,
            };
            
            self.campaigns.entry(campaign_id).write(new_campaign);
            self.next_campaign_id.write(campaign_id + 1);
            
            // Update charity's campaign count
            let updated_charity = Charity {
                name: charity.name,
                description: charity.description,
                wallet_address: charity.wallet_address,
                is_verified: charity.is_verified,
                total_raised: charity.total_raised,
                campaigns_count: charity.campaigns_count + 1,
                registration_date: charity.registration_date,
            };
            self.charities.entry(caller).write(updated_charity.clone());
            
            // Store campaign mapping for charity
            self.charity_campaigns.entry((caller, updated_charity.campaigns_count - 1)).write(campaign_id);
            
            self.emit(CampaignCreated { 
                campaign_id: campaign_id,
                charity_address: caller,
                title: title,
                target_amount: target_amount,
                deadline: deadline,
            });
        }

        fn donate_to_campaign(
            ref self: ContractState,
            campaign_id: u256,
            amount: u256,
            donor_message: ByteArray
        ) {
            self.assert_not_paused();
            let caller = get_caller_address();
            
            assert(amount > 0, 'Donation must be greater than 0');
            
            let campaign = self.campaigns.entry(campaign_id).read();
            assert(campaign.is_active, 'Campaign is not active');
            assert(get_block_timestamp() <= campaign.deadline, 'Campaign has ended');
            
            // Calculate platform fee
            let platform_fee = self.calculate_platform_fee(amount);
            let donation_amount = amount - platform_fee;
            
            // Transfer ETH from donor to contract
            self.transfer_eth_from(caller, get_contract_address(), amount);
            
            // Transfer platform fee to treasury
            if platform_fee > 0 {
                self.transfer_eth(self.platform_treasury.read(), platform_fee);
            }
            
            let donation_id = self.next_donation_id.read();
            let current_time = get_block_timestamp();
            
            let new_donation = Donation {
                id: donation_id,
                donor_address: caller,
                campaign_id: campaign_id,
                amount: donation_amount,
                timestamp: current_time,
                donor_message: donor_message,
            };
            
            self.donations.entry(donation_id).write(new_donation);
            
            // Update campaign totals
            let updated_campaign = Campaign {
                id: campaign.id,
                charity_address: campaign.charity_address,
                title: campaign.title,
                description: campaign.description,
                target_amount: campaign.target_amount,
                raised_amount: campaign.raised_amount + donation_amount,
                deadline: campaign.deadline,
                is_active: campaign.is_active,
                created_at: campaign.created_at,
                total_donors: if !self.has_donated_to_campaign.entry((caller, campaign_id)).read() {
                    self.has_donated_to_campaign.entry((caller, campaign_id)).write(true);
                    campaign.total_donors + 1
                } else {
                    campaign.total_donors
                },
            };
            
            self.campaigns.entry(campaign_id).write(updated_campaign);
            
            // Update charity total
            let charity_address = campaign.charity_address;
            let charity = self.charities.entry(charity_address).read();
            let updated_charity = Charity {
                name: charity.name,
                description: charity.description,
                wallet_address: charity.wallet_address,
                is_verified: charity.is_verified,
                total_raised: charity.total_raised + donation_amount,
                campaigns_count: charity.campaigns_count,
                registration_date: charity.registration_date,
            };
            self.charities.entry(charity_address).write(updated_charity);
            
            // Update donation mappings
            let donor_count = self.donor_donation_count.entry(caller).read();
            let campaign_donation_count = self.campaign_donation_count.entry(campaign_id).read();
            
            self.donor_donations.entry((caller, donor_count)).write(donation_id);
            self.campaign_donations.entry((campaign_id, campaign_donation_count)).write(donation_id);
            
            self.donor_donation_count.entry(caller).write(donor_count + 1);
            self.campaign_donation_count.entry(campaign_id).write(campaign_donation_count + 1);
            
            self.next_donation_id.write(donation_id + 1);
            
            self.emit(DonationMade { 
                donor_address: caller,
                campaign_id: campaign_id,
                amount: donation_amount,
                timestamp: current_time,
            });
        }

        fn withdraw_funds(
            ref self: ContractState,
            campaign_id: u256,
            amount: u256,
            purpose: ByteArray
        ) {
            self.assert_not_paused();
            let caller = get_caller_address();
            let campaign = self.campaigns.entry(campaign_id).read();
            
            assert(caller == campaign.charity_address, 'Not authorized');
            assert(amount <= campaign.raised_amount, 'Insufficient funds');
            assert(amount > 0, 'Invalid withdrawal amount');
            
            let withdrawal_id = self.next_withdrawal_id.read();
            let current_time = get_block_timestamp();
            
            let new_withdrawal = Withdrawal {
                id: withdrawal_id,
                campaign_id: campaign_id,
                amount: amount,
                purpose: purpose.clone(),
                timestamp: current_time,
                approved: true,
            };
            
            self.withdrawals.entry(withdrawal_id).write(new_withdrawal);
            
            // Update campaign balance
            let updated_campaign = Campaign {
                id: campaign.id,
                charity_address: campaign.charity_address,
                title: campaign.title,
                description: campaign.description,
                target_amount: campaign.target_amount,
                raised_amount: campaign.raised_amount - amount,
                deadline: campaign.deadline,
                is_active: campaign.is_active,
                created_at: campaign.created_at,
                total_donors: campaign.total_donors,
            };
            self.campaigns.entry(campaign_id).write(updated_campaign);
            
            // Transfer funds to charity
            self.transfer_eth(campaign.charity_address, amount);
            
            self.next_withdrawal_id.write(withdrawal_id + 1);
            
            self.emit(FundsWithdrawn { 
                charity_address: caller,
                campaign_id: campaign_id,
                amount: amount,
                purpose: purpose,
                timestamp: current_time,
            });
        }

        fn end_campaign(ref self: ContractState, campaign_id: u256) {
            let caller = get_caller_address();
            let campaign = self.campaigns.entry(campaign_id).read();
            
            assert(caller == campaign.charity_address || caller == self.admin.read(), 'Not authorized');
            assert(campaign.is_active, 'Campaign already ended');
            
            let updated_campaign = Campaign {
                id: campaign.id,
                charity_address: campaign.charity_address,
                title: campaign.title,
                description: campaign.description,
                target_amount: campaign.target_amount,
                raised_amount: campaign.raised_amount,
                deadline: campaign.deadline,
                is_active: false,
                created_at: campaign.created_at,
                total_donors: campaign.total_donors,
            };
            self.campaigns.entry(campaign_id).write(updated_campaign);
            
            let target_reached = campaign.raised_amount >= campaign.target_amount;
            
            self.emit(CampaignEnded {
                campaign_id: campaign_id,
                total_raised: campaign.raised_amount,
                target_reached: target_reached,
            });
        }

        // Admin functions
        fn pause_contract(ref self: ContractState) {
            self.assert_admin();
            self.is_paused.write(true);
            
            self.emit(ContractPaused {
                paused_by: get_caller_address(),
                timestamp: get_block_timestamp(),
            });
        }

        fn unpause_contract(ref self: ContractState) {
            self.assert_admin();
            self.is_paused.write(false);
            
            self.emit(ContractUnpaused {unpaused_by: get_caller_address(),timestamp: get_block_timestamp(),});
        }

        fn update_platform_fee(ref self: ContractState, new_fee: u256) {
            self.assert_admin();
            assert(new_fee <= 1000, 'Fee too high'); // Max 10%
            
            let old_fee = self.platform_fee.read();
            self.platform_fee.write(new_fee);
            
            self.emit(PlatformFeeUpdated {
                old_fee: old_fee,
                new_fee: new_fee,
                updated_by: get_caller_address(),
            });
        }

        // View functions
        fn get_charity(self: @ContractState, charity_address: ContractAddress) -> Charity {
            self.charities.entry(charity_address).read()
        }

        fn get_campaign(self: @ContractState, campaign_id: u256) -> Campaign {
            self.campaigns.entry(campaign_id).read()
        }

        fn get_donation(self: @ContractState, donation_id: u256) -> Donation {
            self.donations.entry(donation_id).read()
        }

        fn get_withdrawal(self: @ContractState, withdrawal_id: u256) -> Withdrawal {
            self.withdrawals.entry(withdrawal_id).read()
        }

        fn get_total_campaigns(self: @ContractState) -> u256 {
            self.next_campaign_id.read() - 1
        }

        fn get_total_donations(self: @ContractState) -> u256 {
            self.next_donation_id.read() - 1
        }

        fn is_contract_paused(self: @ContractState) -> bool {
            self.is_paused.read()
        }

        fn get_platform_fee(self: @ContractState) -> u256 {
            self.platform_fee.read()
        }

        fn get_active_campaigns(self: @ContractState) -> Array<u256> {
            let mut active_campaigns = ArrayTrait::new();
            let total_campaigns = self.get_total_campaigns();
            let current_time = get_block_timestamp();
            
            let mut i = 1;
            
            
            while i != total_campaigns + 1 {
                if i > total_campaigns {
                    break;
                }
                
                let campaign = self.campaigns.entry(i).read();
                if campaign.is_active && current_time <= campaign.deadline {
                    active_campaigns.append(i);
                }
                
                i += 1;
            };
            
            active_campaigns
        }
    }
}