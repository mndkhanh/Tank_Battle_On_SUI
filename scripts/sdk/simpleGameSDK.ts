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

export interface ArenaInfo {
  id: string
  name: string
  entryFee: number
  participants: string[]
  maxPlayers: number
  isActive: boolean
}

export class SimpleGameSDK {
  private client: SuiClient

  constructor(client: SuiClient) {
    this.client = client
  }

  // Tank Operations
  async mintTank() {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::simple_game::mint_tank`,
      arguments: []
    })

    return txb
  }

  async getTanksByOwner(owner: string): Promise<TankNFT[]> {
    const objects = await this.client.getOwnedObjects({
      owner,
      filter: {
        StructType: `${PACKAGE_ID}::simple_game::Tank`
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

  // Gun Operations
  async mintGun(paymentAmount: number) {
    const txb = new TransactionBlock()
    
    // Split payment from user's TANK coins
    txb.moveCall({
      target: `0x2::coin::split`,
      typeArguments: [`${PACKAGE_ID}::token::TANK_TOKEN`],
      arguments: [
        txb.object('USER_TANK_COIN'), // User needs to provide their coin object
        txb.pure(paymentAmount)
      ]
    })

    txb.moveCall({
      target: `${PACKAGE_ID}::simple_game::mint_gun`,
      arguments: [
        txb.object('PAYMENT_COIN') // From split above
      ]
    })

    return txb
  }

  async getGunsByOwner(owner: string): Promise<GunNFT[]> {
    const objects = await this.client.getOwnedObjects({
      owner,
      filter: {
        StructType: `${PACKAGE_ID}::simple_game::Gun`
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

  async attachGunToTank(tankId: string, gunId: string) {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::simple_game::attach_gun`,
      arguments: [
        txb.object(tankId),
        txb.object(gunId)
      ]
    })

    return txb
  }

  // Arena Operations
  async createArena(name: string, entryFee: number, maxPlayers: number) {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::simple_game::create_arena`,
      arguments: [
        txb.pure(Array.from(new TextEncoder().encode(name))),
        txb.pure(entryFee),
        txb.pure(maxPlayers)
      ]
    })

    return txb
  }

  async joinArena(arenaId: string, tankId: string, entryFee: number) {
    const txb = new TransactionBlock()
    
    // Split entry fee from user's TANK coins
    txb.moveCall({
      target: `0x2::coin::split`,
      typeArguments: [`${PACKAGE_ID}::token::TANK_TOKEN`],
      arguments: [
        txb.object('USER_TANK_COIN'),
        txb.pure(entryFee)
      ]
    })

    txb.moveCall({
      target: `${PACKAGE_ID}::simple_game::join_arena`,
      arguments: [
        txb.object(arenaId),
        txb.pure(tankId),
        txb.object('ENTRY_FEE_COIN') // From split above
      ]
    })

    return txb
  }

  // Marketplace Operations
  async listTankForSale(tankId: string, price: number) {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::simple_market::list_tank`,
      arguments: [
        txb.object('MARKETPLACE_ID'), // Will be set after deployment
        txb.object(tankId),
        txb.pure(price),
        txb.object('0x6') // Clock
      ]
    })

    return txb
  }

  async listGunForSale(gunId: string, price: number) {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::simple_market::list_gun`,
      arguments: [
        txb.object('MARKETPLACE_ID'),
        txb.object(gunId),
        txb.pure(price),
        txb.object('0x6') // Clock
      ]
    })

    return txb
  }

  async buyTank(tankId: string, price: number) {
    const txb = new TransactionBlock()
    
    // Split payment
    txb.moveCall({
      target: `0x2::coin::split`,
      typeArguments: [`${PACKAGE_ID}::token::TANK_TOKEN`],
      arguments: [
        txb.object('USER_TANK_COIN'),
        txb.pure(price)
      ]
    })

    txb.moveCall({
      target: `${PACKAGE_ID}::simple_market::buy_tank`,
      arguments: [
        txb.object('MARKETPLACE_ID'),
        txb.pure(tankId),
        txb.object('PAYMENT_COIN')
      ]
    })

    return txb
  }

  async buyGun(gunId: string, price: number) {
    const txb = new TransactionBlock()
    
    // Split payment
    txb.moveCall({
      target: `0x2::coin::split`,
      typeArguments: [`${PACKAGE_ID}::token::TANK_TOKEN`],
      arguments: [
        txb.object('USER_TANK_COIN'),
        txb.pure(price)
      ]
    })

    txb.moveCall({
      target: `${PACKAGE_ID}::simple_market::buy_gun`,
      arguments: [
        txb.object('MARKETPLACE_ID'),
        txb.pure(gunId),
        txb.object('PAYMENT_COIN')
      ]
    })

    return txb
  }

  // Query Functions
  async getMarketListings() {
    const events = await this.client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::simple_market::TankListed`
      },
      limit: 50,
      order: 'descending'
    })

    return events.data.map(event => ({
      type: 'tank',
      id: (event.parsedJson as any)?.tank_id,
      seller: (event.parsedJson as any)?.seller,
      price: parseInt((event.parsedJson as any)?.price || '0')
    }))
  }

  async getTokenBalance(owner: string): Promise<number> {
    const objects = await this.client.getOwnedObjects({
      owner,
      filter: {
        StructType: `0x2::coin::Coin<${PACKAGE_ID}::token::TANK_TOKEN>`
      },
      options: {
        showContent: true
      }
    })

    let totalBalance = 0
    objects.data.forEach(obj => {
      if (obj.data?.content && obj.data.content.dataType === 'moveObject') {
        const balance = parseInt((obj.data.content as any).fields.balance)
        totalBalance += balance
      }
    })

    return totalBalance
  }

  // Utility Functions
  getRarityName(rarity: number): string {
    const names = ['Common', 'Rare', 'Epic', 'Legendary']
    return names[rarity - 1] || 'Unknown'
  }

  getRarityColor(rarity: number): string {
    const colors = ['#9CA3AF', '#3B82F6', '#8B5CF6', '#F59E0B']
    return colors[rarity - 1] || '#9CA3AF'
  }

  formatTokenAmount(amount: number): string {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M TANK`
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K TANK`
    }
    return `${amount} TANK`
  }
}