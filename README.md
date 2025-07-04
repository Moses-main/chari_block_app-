# Charity Donation Platform

A decentralized charity donation platform built on StarkNet that enables transparent, secure, and efficient charitable giving. This smart contract facilitates trustless donations between donors and verified charitable organizations.

## 🌟 Features

### Core Functionality
- **Charity Registration**: Organizations can register and get verified on the platform
- **Campaign Management**: Charities can create time-bound fundraising campaigns
- **Secure Donations**: Donors can contribute to campaigns with transparent tracking
- **Fund Withdrawal**: Verified charities can withdraw raised funds with purpose documentation
- **Platform Fees**: Configurable platform fees to sustain the ecosystem

### Security & Administration
- **Admin Controls**: Comprehensive admin functions for platform management
- **Pause Mechanism**: Emergency pause functionality for security
- **Verification System**: Admin-verified charity status for trust
- **Transparent Tracking**: All donations and withdrawals are publicly recorded

## 🏗️ Architecture

### Smart Contract Structure

```
CharityDonationContract
├── Storage
│   ├── Charities mapping
│   ├── Campaigns mapping
│   ├── Donations mapping
│   └── Withdrawals mapping
├── Events
│   ├── CharityRegistered
│   ├── CampaignCreated
│   ├── DonationMade
│   └── FundsWithdrawn
└── Functions
    ├── Charity Management
    ├── Campaign Operations
    ├── Donation Processing
    └── Admin Controls
```

### Key Data Structures

#### Charity
```rust
struct Charity {
    name: ByteArray,
    description: ByteArray,
    wallet_address: ContractAddress,
    is_verified: bool,
    total_raised: u256,
    campaigns_count: u256,
    registration_date: u64,
}
```

#### Campaign
```rust
struct Campaign {
    id: u256,
    charity_address: ContractAddress,
    title: ByteArray,
    description: ByteArray,
    target_amount: u256,
    raised_amount: u256,
    deadline: u64,
    is_active: bool,
    created_at: u64,
    total_donors: u256,
}
```

#### Donation
```rust
struct Donation {
    id: u256,
    donor_address: ContractAddress,
    campaign_id: u256,
    amount: u256,
    timestamp: u64,
    donor_message: ByteArray,
}
```

## 🚀 Getting Started

### Prerequisites
- StarkNet development environment
- Cairo compiler
- OpenZeppelin Cairo contracts
- ETH token contract for donations

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/charity-donation-platform
cd charity-donation-platform
```

2. **Install dependencies**
```bash
scarb build
```

3. **Deploy to StarkNet**
```bash
starknet deploy --contract charity_donation_contract.json
```

### Constructor Parameters

When deploying the contract, you need to provide:

- `admin`: Address of the platform administrator
- `eth_token_address`: Address of the ETH token contract
- `platform_treasury`: Address where platform fees are collected
- `initial_platform_fee`: Initial fee in basis points (100 = 1%)

## 📖 Usage Guide

### For Charities

#### 1. Register Your Charity
```rust
// Call register_charity function
register_charity(
    name: "Your Charity Name",
    description: "Description of your charitable work"
)
```

#### 2. Get Verified
Contact the platform admin to verify your charity status.

#### 3. Create Campaigns
```rust
// Create a new fundraising campaign
create_campaign(
    title: "Campaign Title",
    description: "Campaign description",
    target_amount: 1000000000000000000, // 1 ETH in wei
    duration_days: 30
)
```

#### 4. Withdraw Funds
```rust
// Withdraw raised funds
withdraw_funds(
    campaign_id: 1,
    amount: 500000000000000000, // 0.5 ETH
    purpose: "Medical supplies purchase"
)
```

### For Donors

#### 1. Find Active Campaigns
```rust
// Get list of active campaigns
let active_campaigns = get_active_campaigns();
```

#### 2. Make a Donation
```rust
// Donate to a campaign
donate_to_campaign(
    campaign_id: 1,
    amount: 100000000000000000, // 0.1 ETH
    donor_message: "Keep up the great work!"
)
```

### For Administrators

#### 1. Verify Charities
```rust
// Verify a registered charity
verify_charity(charity_address: 0x123...)
```

#### 2. Platform Management
```rust
// Update platform fee
update_platform_fee(new_fee: 200) // 2%

// Pause/unpause contract
pause_contract()
unpause_contract()
```

## 🔧 API Reference

### Charity Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `register_charity` | Register a new charity | `name`, `description` |
| `verify_charity` | Verify a charity (admin only) | `charity_address` |
| `get_charity` | Get charity details | `charity_address` |

### Campaign Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `create_campaign` | Create a new campaign | `title`, `description`, `target_amount`, `duration_days` |
| `end_campaign` | End a campaign | `campaign_id` |
| `get_campaign` | Get campaign details | `campaign_id` |
| `get_active_campaigns` | Get all active campaigns | None |

### Donation Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `donate_to_campaign` | Make a donation | `campaign_id`, `amount`, `donor_message` |
| `withdraw_funds` | Withdraw funds (charity only) | `campaign_id`, `amount`, `purpose` |
| `get_donation` | Get donation details | `donation_id` |

### View Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `get_total_campaigns` | Total number of campaigns | `u256` |
| `get_total_donations` | Total number of donations | `u256` |
| `is_contract_paused` | Check if contract is paused | `bool` |
| `get_platform_fee` | Get current platform fee | `u256` |

## 📊 Events

The contract emits the following events for tracking and indexing:

- `CharityRegistered`: When a charity registers
- `CharityVerified`: When a charity gets verified
- `CampaignCreated`: When a new campaign is created
- `CampaignEnded`: When a campaign ends
- `DonationMade`: When a donation is made
- `FundsWithdrawn`: When funds are withdrawn
- `ContractPaused/Unpaused`: When contract status changes
- `PlatformFeeUpdated`: When platform fee is updated

## 🛡️ Security Features

### Access Control
- **Admin-only functions**: Charity verification, contract management
- **Charity-only functions**: Fund withdrawal, campaign management
- **Public functions**: Donations, viewing data

### Safety Mechanisms
- **Pause functionality**: Emergency stop for security incidents
- **Verification requirement**: Only verified charities can create campaigns
- **Time-based controls**: Campaign deadlines and duration limits
- **Amount validations**: Minimum donation amounts and withdrawal limits

### Transparency
- **Public audit trail**: All transactions are recorded on-chain
- **Event emissions**: Real-time tracking of all platform activities
- **Open data**: Campaign and donation data is publicly accessible

## 💰 Fee Structure

The platform operates on a fee-based model:
- **Platform Fee**: Configurable percentage (default: 1-10%)
- **Fee Distribution**: Collected fees go to platform treasury
- **Fee Transparency**: All fees are clearly communicated and tracked

## 🔒 Security Considerations

### Best Practices
1. **Verify charity legitimacy** before donating
2. **Check campaign deadlines** and targets
3. **Monitor withdrawal activities** for transparency
4. **Keep private keys secure** for all transactions

### Known Limitations
- Platform relies on admin verification for charity trust
- Campaign success depends on reaching target amounts
- Platform fees reduce the amount received by charities
- Smart contract risks inherent to blockchain technology

## 🤝 Contributing

We welcome contributions to improve the platform:

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add comprehensive tests
5. Submit a pull request

### Development Guidelines
- Follow Cairo coding standards
- Write comprehensive tests
- Document new features
- Ensure backward compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Join our community Discord
- Contact the development team

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic charity registration and verification
- [x] Campaign creation and management
- [x] Donation processing
- [x] Fund withdrawal system

### Phase 2 (Planned)
- [ ] Multi-token support (beyond ETH)
- [ ] Reputation system for charities
- [ ] Milestone-based fund release
- [ ] Integration with external verification services

### Phase 3 (Future)
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Community governance features
- [ ] Cross-chain compatibility

## 🔗 Links

- [StarkNet Documentation](https://docs.starknet.io/)
- [Cairo Language](https://cairo-lang.org/)
- [OpenZeppelin Cairo](https://github.com/OpenZeppelin/cairo-contracts)

---

**Built with ❤️ for charitable giving on StarkNet**