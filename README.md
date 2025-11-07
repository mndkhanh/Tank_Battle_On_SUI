# Tank Battle on Sui - Core Game

## 🎮 Features
- **Tank NFT**: Mint free tanks with random stats
- **Gun NFT**: Gacha system (100 TANK tokens)
- **Marketplace**: Buy/sell NFTs with 5% fee
- **TANK Token**: Game currency

## 📁 Structure
```
Tank_Battle_On_SUI/
├── move_contracts/
│   └── sources/
│       ├── tank_battle.move    # Tank & Gun NFTs
│       ├── market.move         # NFT Marketplace
│       └── token.move          # TANK_TOKEN
├── scripts/
│   ├── sdk/                    # SDK for UI integration
│   └── deployment/             # Contract deployment
└── docs/                       # Documentation
```

## 🚀 Quick Start
1. Setup: `cp .env.example .env` (add your private key)
2. Install: `npm install`
3. Build: `npm run build`
4. Deploy: `npm run deploy`

## 🎯 Core Functions
- `mint_tank()` - Free tank NFT
- `mint_gun(payment)` - 100 TANK for random gun
- `list_tank/gun(price)` - List on marketplace
- `buy_tank/gun(payment)` - Purchase NFT

## 📦 SDK Integration
Copy `scripts/sdk/` to your UI project for blockchain integration.