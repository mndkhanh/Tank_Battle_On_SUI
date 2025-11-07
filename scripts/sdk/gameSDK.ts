import { SuiClient } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { PACKAGE_ID } from './constants'

export interface TankNFT {
  id: string
  owner: string
  health: number
  armor: number
  speed: number
  gunId?: string
}

export interface GunNFT {
  id: string
  owner: string
  damage: number
  fireRate: number
  range: number
  rarity: number
}

export class GameSDK {
  private client: SuiClient

  constructor(client: SuiClient) {
    this.client = client
  }

  // Mint Tank (free)
  async mintTank() {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::game::mint_tank`,
      arguments: []
    })

    return txb
  }

  // Mint Gun (0.1 SUI)
  async mintGun(suiCoinId: string) {
    const txb = new TransactionBlock()
    
    // Split 0.1 SUI for gun minting
    const [payment] = txb.splitCoins(txb.object(suiCoinId), [100_000_000]) // 0.1 SUI
    
    txb.moveCall({
      target: `${PACKAGE_ID}::game::mint_gun`,
      arguments: [payment]
    })

    return txb
  }

  // List Tank for sale
  async listTank(marketplaceId: string, tankId: string, price: number) {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::market::list_tank`,
      arguments: [
        txb.object(marketplaceId),
        txb.object(tankId),
        txb.pure(price)
      ]
    })

    return txb
  }

  // List Gun for sale
  async listGun(marketplaceId: string, gunId: string, price: number) {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::market::list_gun`,
      arguments: [
        txb.object(marketplaceId),
        txb.object(gunId),
        txb.pure(price)
      ]
    })

    return txb
  }

  // Buy Tank
  async buyTank(marketplaceId: string, tankId: string, suiCoinId: string, price: number) {
    const txb = new TransactionBlock()
    
    const [payment] = txb.splitCoins(txb.object(suiCoinId), [price])
    
    txb.moveCall({
      target: `${PACKAGE_ID}::market::buy_tank`,
      arguments: [
        txb.object(marketplaceId),
        txb.pure(tankId),
        payment
      ]
    })

    return txb
  }

  // Buy Gun
  async buyGun(marketplaceId: string, gunId: string, suiCoinId: string, price: number) {
    const txb = new TransactionBlock()
    
    const [payment] = txb.splitCoins(txb.object(suiCoinId), [price])
    
    txb.moveCall({
      target: `${PACKAGE_ID}::market::buy_gun`,
      arguments: [
        txb.object(marketplaceId),
        txb.pure(gunId),
        payment
      ]
    })

    return txb
  }

  // Get user's tanks
  async getTanksByOwner(owner: string): Promise<TankNFT[]> {
    const objects = await this.client.getOwnedObjects({
      owner,
      filter: {
        StructType: `${PACKAGE_ID}::game::Tank`
      },
      options: {
        showContent: true
      }
    })

    return objects.data.map(obj => {
      if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') {
        return null
      }

      const fields = (obj.data.content as any).fields
      return {
        id: obj.data.objectId,
        owner: fields.owner,
        health: parseInt(fields.health),
        armor: parseInt(fields.armor),
        speed: parseInt(fields.speed),
        gunId: fields.gun_id?.fields ? fields.gun_id.fields : undefined
      }
    }).filter(tank => tank !== null) as TankNFT[]
  }

  // Get user's guns
  async getGunsByOwner(owner: string): Promise<GunNFT[]> {
    const objects = await this.client.getOwnedObjects({
      owner,
      filter: {
        StructType: `${PACKAGE_ID}::game::Gun`
      },
      options: {
        showContent: true
      }
    })

    return objects.data.map(obj => {
      if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') {
        return null
      }

      const fields = (obj.data.content as any).fields
      return {
        id: obj.data.objectId,
        owner: fields.owner,
        damage: parseInt(fields.damage),
        fireRate: parseInt(fields.fire_rate),
        range: parseInt(fields.range),
        rarity: parseInt(fields.rarity)
      }
    }).filter(gun => gun !== null) as GunNFT[]
  }

  // Get marketplace listings
  async getMarketListings() {
    const tankEvents = await this.client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::market::TankListed`
      },
      limit: 50
    })

    const gunEvents = await this.client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::market::GunListed`
      },
      limit: 50
    })

    return {
      tanks: tankEvents.data.map(event => ({
        id: (event.parsedJson as any)?.tank_id,
        seller: (event.parsedJson as any)?.seller,
        price: parseInt((event.parsedJson as any)?.price || '0')
      })),
      guns: gunEvents.data.map(event => ({
        id: (event.parsedJson as any)?.gun_id,
        seller: (event.parsedJson as any)?.seller,
        price: parseInt((event.parsedJson as any)?.price || '0'),
        rarity: parseInt((event.parsedJson as any)?.rarity || '1')
      }))
    }
  }

  // Utility functions
  getRarityName(rarity: number): string {
    const names = ['Common', 'Rare', 'Epic', 'Legendary']
    return names[rarity - 1] || 'Unknown'
  }

  getRarityColor(rarity: number): string {
    const colors = ['#9CA3AF', '#3B82F6', '#8B5CF6', '#F59E0B']
    return colors[rarity - 1] || '#9CA3AF'
  }

  // Get SUI balance
  async getSuiBalance(owner: string): Promise<number> {
    const balance = await this.client.getBalance({
      owner,
      coinType: '0x2::sui::SUI'
    })
    return parseInt(balance.totalBalance)
  }

  // Format SUI amount
  formatSuiAmount(amount: number): string {
    const sui = amount / 1_000_000_000 // Convert MIST to SUI
    if (sui >= 1000) {
      return `${(sui / 1000).toFixed(1)}K SUI`
    } else if (sui >= 1) {
      return `${sui.toFixed(3)} SUI`
    } else {
      return `${(sui * 1000).toFixed(1)} mSUI`
    }
  }
}