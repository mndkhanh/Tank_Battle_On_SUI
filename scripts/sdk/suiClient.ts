import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { CURRENT_NETWORK } from './constants'

// Singleton Sui Client
let suiClientInstance: SuiClient | null = null

export function getSuiClient(): SuiClient {
  if (!suiClientInstance) {
    suiClientInstance = new SuiClient({
      url: getFullnodeUrl(CURRENT_NETWORK as any)
    })
  }
  return suiClientInstance
}

// Export for direct use
export const suiClient = getSuiClient()

// Utility functions
export async function waitForTransaction(txDigest: string): Promise<any> {
  const client = getSuiClient()
  
  let attempts = 0
  const maxAttempts = 30 // 30 seconds timeout
  
  while (attempts < maxAttempts) {
    try {
      const result = await client.getTransactionBlock({
        digest: txDigest,
        options: {
          showEffects: true,
          showEvents: true
        }
      })
      
      if (result.effects?.status?.status === 'success') {
        return result
      } else if (result.effects?.status?.status === 'failure') {
        throw new Error(`Transaction failed: ${result.effects.status.error}`)
      }
    } catch (error) {
      // Transaction might not be indexed yet
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    attempts++
  }
  
  throw new Error('Transaction timeout')
}

export async function getGasPrice(): Promise<number> {
  const client = getSuiClient()
  
  try {
    const gasPrice = await client.getReferenceGasPrice()
    return parseInt(gasPrice.toString())
  } catch (error) {
    console.warn('Failed to get gas price, using default')
    return 1000 // Default gas price
  }
}