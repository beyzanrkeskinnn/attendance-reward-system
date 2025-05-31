# 🎓 Stellar-Soroban Education Reward DApp

This project is an **Education Participation Reward System** built using **Stellar and Soroban**. It automatically rewards users who participate in educational events with tokens and collects feedback from participants.

## 🚀 Features

- **Next.js** based modern frontend with TypeScript
- **Rust / Soroban** smart contracts for secure token distribution
- 🔑 **Freighter wallet** integration for seamless connection
- 🎁 **Automatic token rewards** for education participation
- 💬 **Feedback system** for collecting participant comments
- 🪙 **EDU Token** distribution with configurable amounts
- ⏰ **Token expiry** system for time-limited rewards
- 🎨 **Modern glassmorphism UI** with Tailwind CSS
- 📱 **Responsive design** for all devices
- 🔒 **Secure participation tracking** on Stellar network

## 📂 Project Structure

```bash
/contract               # Rust/Soroban smart contract
├── lib.rs             # Main contract logic
└── Cargo.toml         # Rust dependencies
/app                   # Next.js application
├── layout.tsx         # Root layout component
├── page.tsx           # Main application page
├── globals.css        # Global styles with custom animations
└── components/        # React components
/tailwind.config.js    # Tailwind configuration with custom theme
/package.json          # Node.js dependencies
/README.md             # This document!
```

## 🛠️ Installation

1️⃣ **Clone the repository:**
```bash
git clone https://github.com/<your-username>/stellar-education-reward-dapp.git
cd stellar-education-reward-dapp
```

2️⃣ **Install frontend dependencies:**
```bash
npm install
```

3️⃣ **Start the development server:**
```bash
npm run dev
```

4️⃣ **Build the smart contract:**
```bash
cd contract
cargo build --target wasm32-unknown-unknown --release
```

5️⃣ **Deploy the smart contract to Stellar:**
```bash
# Make sure you have Stellar CLI installed
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/education_reward.wasm --network testnet
```

## ⚙️ Usage

### For Participants:
1. **Connect Wallet**: Click "Freighter Cüzdanını Bağla" to connect your wallet
2. **Participate**: Fill in the feedback form about your educational experience
3. **Get Rewards**: Receive EDU tokens automatically after submitting participation
4. **Track Status**: View your participation status and reward history

### For Administrators:
1. Initialize the contract with reward parameters
2. Set token expiry periods for time-limited rewards
3. Monitor participation statistics and feedback
4. Manage token distribution and contract settings

## 🔧 Smart Contract Functions

- `initialize()` - Initialize contract with admin and reward settings
- `participate()` - Record participation and distribute rewards
- `get_participation()` - Get participation data for an address
- `get_total_participants()` - Get total number of participants
- `cleanup_expired_tokens()` - Remove expired reward tokens
- `update_reward_amount()` - Admin function to update reward amounts

## 📸 Screenshots

### Main Dashboard
- Modern glassmorphism design with gradient backgrounds
- Wallet connection status and participation tracking
- Real-time feedback on user actions

### Participation Flow
- Simple comment/feedback form for educational experiences
- Automatic token reward calculation and distribution
- Success confirmations with transaction details

## 🌟 Key Benefits

- **Automated Rewards**: No manual token distribution needed
- **Feedback Collection**: Valuable insights from participants
- **Transparent**: All transactions recorded on Stellar blockchain
- **Secure**: Smart contract ensures fair token distribution
- **User-Friendly**: Modern UI with intuitive user experience
- **Scalable**: Can handle multiple educational events and participants

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

✨ **Want to contribute?**
- We welcome your PRs and feature suggestions!
- Please open issues for bug reports and feature requests
- Follow the existing code style and patterns
- Add tests for new functionality

### Development Guidelines:
- Use TypeScript for type safety
- Follow React best practices
- Write clean, documented code
- Test smart contract functions thoroughly

---

## 🔗 Useful Links

- 🌐 [Stellar Developer Docs](https://developers.stellar.org/docs/)
- 🔧 [Soroban Documentation](https://soroban.stellar.org/docs)
- 💼 [Freighter Wallet](https://freighter.app/)
- 📚 [Next.js Documentation](https://nextjs.org/docs)
- 🎨 [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🚨 Prerequisites

- **Node.js** v18+ installed
- **Rust** and **Cargo** installed
- **Stellar CLI** for contract deployment
- **Freighter Wallet** browser extension

---

## 📝 Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_REWARD_TOKEN_ADDRESS=your_token_address_here
```

---

**Note:** Make sure to complete the Soroban smart contract compilation and deployment before running the project. The frontend requires a deployed contract address to function properly.

## 📊 Contract Deployment Status

- ✅ Smart Contract: Ready for deployment
- ✅ Frontend: Development ready
- ✅ Wallet Integration: Freighter supported
- ⏳ Testnet Deployment: Pending configuration
- ⏳ Mainnet Deployment: After testing phase

---

**Happy Learning & Building on Stellar! 🚀**
