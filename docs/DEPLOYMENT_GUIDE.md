# 🚀 Deployment Guide - Tank Battle on Sui

## 📋 Prerequisites

### 1. Install Sui CLI
```bash
# Install Sui CLI
curl -fLJO https://github.com/MystenLabs/sui/releases/download/testnet-v1.14.0/sui-testnet-v1.14.0-ubuntu-x86_64.tgz
tar -xzf sui-testnet-v1.14.0-ubuntu-x86_64.tgz
sudo mv sui-testnet-v1.14.0-ubuntu-x86_64/sui /usr/local/bin/

# Verify installation
sui --version
```

### 2. Create Sui Wallet
```bash
# Generate new keypair
sui client new-address ed25519

# Get testnet SUI tokens
# Visit: https://discord.gg/sui (use #testnet-faucet channel)
# Or: https://faucet.testnet.sui.io/
```

### 3. Setup Environment Variables
```bash
# Copy example file
cp .env.example .env

# Edit .env with your keys
nano .env
```

## 🔑 Required Environment Variables

### `.env` file:
```env
# Deployment Account (your wallet private key)
SUI_PRIVATE_KEY=0x1234567890abcdef...

# Oracle Service Account (separate key for oracle)
ORACLE_PRIVATE_KEY=0xabcdef1234567890...

# Network Configuration
SUI_NETWORK=testnet
ORACLE_PORT=8080
GUN_ECONOMY_PORT=3001
```

### 🔍 How to Get Private Keys:

#### **Method 1: From Sui CLI**
```bash
# Show your addresses
sui client addresses

# Export private key for specific address
sui keytool export --address <YOUR_ADDRESS> --key-identity ed25519
```

#### **Method 2: Create New Keys**
```bash
# Generate new keypair
sui client new-address ed25519

# The private key will be displayed
# Copy it to your .env file
```

## 🚀 Deployment Steps

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Fund Your Account
```bash
# Check balance
sui client balance

# If balance is 0, get testnet tokens:
# - Discord: https://discord.gg/sui (#testnet-faucet)
# - Faucet: https://faucet.testnet.sui.io/
```

### 3. Deploy Smart Contracts
```bash
npm run deploy:testnet
```

### 4. Start Backend Services
```bash
# Start oracle and gun economy services
npm run dev
```

## 📊 Deployment Output

After successful deployment, you'll see:
```
✅ Smart contracts deployed successfully!
📦 Package ID: 0x1234567890abcdef...
🔑 Oracle Cap ID: 0xabcdef1234567890...
🎯 Architecture: On-chain settlement + Off-chain gameplay

🌐 Services running:
- Oracle WebSocket: ws://localhost:8080
- Gun Economy API: http://localhost:3001
```

## 🔧 Troubleshooting

### **Error: Insufficient Gas**
```bash
# Get more testnet SUI
# Visit faucet and request tokens for your address
sui client balance  # Check if tokens received
```

### **Error: Private Key Invalid**
```bash
# Verify key format (should start with 0x)
# Re-export from Sui CLI:
sui keytool export --address <ADDRESS> --key-identity ed25519
```

### **Error: Network Connection**
```bash
# Check Sui CLI configuration
sui client envs
sui client switch --env testnet
```

### **Error: Move Compilation Failed**
```bash
# Clean and rebuild
cd move_contracts
sui move clean
sui move build
```

## 🔄 Re-deployment

If you need to redeploy:
```bash
# Clean previous build
cd move_contracts && sui move clean

# Deploy again
npm run deploy:testnet
```

## 🌐 Network Information

### **Testnet:**
- RPC: https://fullnode.testnet.sui.io:443
- Explorer: https://suiexplorer.com/?network=testnet
- Faucet: https://faucet.testnet.sui.io/

### **Mainnet (Future):**
- RPC: https://fullnode.mainnet.sui.io:443
- Explorer: https://suiexplorer.com/?network=mainnet

## 🔐 Security Notes

- **Never commit private keys** to version control
- Use separate keys for deployment vs oracle
- Keep `.env` file in `.gitignore`
- For production, use hardware wallets or key management services

## 📝 Post-Deployment Checklist

- [ ] Smart contracts deployed successfully
- [ ] Package ID updated in SDK constants
- [ ] Oracle services running
- [ ] Gun economy API responding
- [ ] WebSocket connection working
- [ ] Test transactions working
- [ ] SDK exported for UI integration