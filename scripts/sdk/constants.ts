// Load environment variables
require('dotenv').config()

// Game Configuration
export const PACKAGE_ID = process.env.PACKAGE_ID || '0x0'
export const MARKETPLACE_ID = process.env.MARKETPLACE_ID || '0x0'
export const BATTLE_REGISTRY_ID = process.env.BATTLE_REGISTRY_ID || '0x0'

// Pricing (in MIST)
export const TANK_PRICE = parseInt(process.env.TANK_PRICE || '0')
export const GUN_PRICE = parseInt(process.env.GUN_PRICE || '100000000')
export const MARKETPLACE_FEE = parseInt(process.env.MARKETPLACE_FEE || '5')
export const GAS_BUDGET = parseInt(process.env.GAS_BUDGET || '10000000')

// Gun Rarity Weights
export const RARITY_WEIGHTS = {
  COMMON: 60,    // 60%
  RARE: 25,      // 25%
  EPIC: 12,      // 12%
  LEGENDARY: 3   // 3%
}

// Network Configuration
export const NETWORK_CONFIG = {
  testnet: process.env.TESTNET_URL || 'https://fullnode.testnet.sui.io:443',
  mainnet: process.env.MAINNET_URL || 'https://fullnode.mainnet.sui.io:443',
  devnet: process.env.DEVNET_URL || 'https://fullnode.devnet.sui.io:443'
}

export const CURRENT_NETWORK = process.env.NETWORK || 'testnet'

// Explorer URLs
export const EXPLORER_CONFIG = {
  testnet: process.env.TESTNET_EXPLORER || 'https://suiexplorer.com',
  mainnet: process.env.MAINNET_EXPLORER || 'https://suiexplorer.com'
}