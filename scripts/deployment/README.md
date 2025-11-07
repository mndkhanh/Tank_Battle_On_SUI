# 🚀 Tank Battle Deployment Guide

## Quick Start

### 1. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Add your Sui private key to .env
SUI_PRIVATE_KEY=your_private_key_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Deploy Contracts
```bash
# Build and deploy to testnet
npm run deploy
```

### 4. Test Deployment
```bash
# Check deployment status
npm run check

# Run automated tests
npm run test

# Check wallet balance
npm run balance
```

## 📋 Deployment Process

### Step 1: Build Contracts
```bash
npm run build
```
- Compiles all Move contracts
- Generates bytecode in `build/` directory
- Validates contract syntax and dependencies

### Step 2: Deploy to Network
```bash
npm run deploy
```
- Deploys to Sui testnet by default
- Creates `deployment.json` with package info
- Returns package ID and transaction hash

### Step 3: Verify Deployment
```bash
npm run check
```
- Verifies package exists on-chain
- Shows deployment information
- Checks recent contract events

### Step 4: Test Functions
```bash
npm run test
```
- Tests tank minting (free)
- Tests gun minting (0.1 SUI)
- Verifies events and objects
- Checks marketplace functions

## 📦 Contract Modules

### 1. Game Module (`tank_battle::game`)
- **Tank NFT**: Free minting with fixed stats
- **Gun NFT**: 0.1 SUI gacha with 4 rarities
- **Events**: `TankMinted`, `GunMinted`

### 2. Market Module (`tank_battle::market`)
- **Marketplace**: Buy/sell NFTs with 5% fee
- **Listings**: Tank and Gun marketplace
- **Events**: `TankListed`, `GunListed`

### 3. Battle Module (`tank_battle::battle`)
- **Battle Results**: Record match outcomes
- **Registry**: Store battle history
- **Events**: `BattleCompleted`

## 🔍 Explorer Verification

### Transaction Verification
1. Copy transaction hash from deployment
2. Visit: `https://suiexplorer.com/txblock/{hash}?network=testnet`
3. Verify "Success" status
4. Check object creation and events

### Package Verification
1. Copy package ID from `deployment.json`
2. Visit: `https://suiexplorer.com/object/{packageId}?network=testnet`
3. Verify all 3 modules are present
4. Check module functions and structs

### Event Verification
1. Go to package page on explorer
2. Click "Events" tab
3. Verify events are emitted correctly
4. Check event data structure

## 🧪 Manual Testing

### Test Tank Minting
```bash
sui client call \
  --package {PACKAGE_ID} \
  --module game \
  --function mint_tank \
  --gas-budget 10000000
```

### Test Gun Minting
```bash
sui client call \
  --package {PACKAGE_ID} \
  --module game \
  --function mint_gun \
  --args {COIN_OBJECT_ID} \
  --gas-budget 10000000
```

### Check Owned Objects
```bash
sui client objects
```

### Query Events
```bash
sui client events --package {PACKAGE_ID}
```

## 🚨 Troubleshooting

### Common Issues

**Build Failures**
- Check Move.toml dependencies
- Verify Sui CLI version
- Run `sui move clean` and rebuild

**Deployment Failures**
- Ensure sufficient SUI balance (0.5+ SUI)
- Check network connectivity
- Verify private key format

**Test Failures**
- Wait for transaction confirmation
- Check package ID in deployment.json
- Verify network configuration

**Explorer Issues**
- Wait 30 seconds for indexing
- Try refreshing the page
- Check network selection (testnet/mainnet)

### Gas Optimization
- Tank minting: ~0.001 SUI
- Gun minting: ~0.001 SUI + 0.1 SUI payment
- Marketplace operations: ~0.002 SUI
- Battle recording: ~0.001 SUI

## 📊 Success Metrics

### Deployment Success
- ✅ All contracts compile without errors
- ✅ Package deployed successfully
- ✅ Transaction confirmed on explorer
- ✅ All modules accessible

### Function Success
- ✅ Tank minting works (free)
- ✅ Gun minting works (0.1 SUI)
- ✅ Events emitted correctly
- ✅ Objects created with proper types

### Integration Ready
- ✅ Package ID documented
- ✅ SDK functions tested
- ✅ Explorer verification complete
- ✅ Ready for UI development

## 📞 Support

### Useful Commands
```bash
# Check Sui CLI version
sui --version

# Check active address
sui client active-address

# Check network configuration
sui client envs

# Switch to testnet
sui client switch --env testnet

# Get testnet SUI
# Visit: https://discord.gg/sui (use faucet)
```

### Network Information
- **Testnet RPC**: https://fullnode.testnet.sui.io:443
- **Explorer**: https://suiexplorer.com/?network=testnet
- **Faucet**: Discord #testnet-faucet channel

### Next Steps
1. ✅ Deploy contracts successfully
2. ✅ Verify all functions work
3. 🔄 Integrate with UI (separate repo)
4. 🔄 Implement battle logic
5. 🔄 Add advanced features