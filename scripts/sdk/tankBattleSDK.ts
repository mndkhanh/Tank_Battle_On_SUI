import { SuiClient } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { PACKAGE_ID, OBJECT_IDS } from './constants'

export class TankBattleSDK {
  private client: SuiClient

  constructor(client: SuiClient) {
    this.client = client
  }

  // Tank Operations
  async mintTank() {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::game::mint_tank`,
      arguments: []
    })

    return txb
  }

  async getTanksByOwner(owner: string) {
    return await this.client.getOwnedObjects({
      owner,
      filter: {
        StructType: `${PACKAGE_ID}::game::Tank`
      },
      options: {
        showContent: true
      }
    })
  }

  // Matchmaking Operations
  async joinMatchmaking(tankId: string, rankPoints: number, entryFee: number) {
    const txb = new TransactionBlock()
    
    // Create entry fee coin
    txb.moveCall({
      target: `0x2::coin::split`,
      typeArguments: [`${PACKAGE_ID}::token::TANK_TOKEN`],
      arguments: [
        txb.object('USER_TANK_COIN'), // User's TANK coin
        txb.pure(entryFee)
      ]
    })

    txb.moveCall({
      target: `${PACKAGE_ID}::matchmaking::join_matchmaking`,
      arguments: [
        txb.object(OBJECT_IDS.MATCHMAKING_POOL_ID),
        txb.pure(tankId),
        txb.pure(rankPoints),
        txb.object('ENTRY_FEE_COIN'), // From split above
        txb.object('0x6') // Clock
      ]
    })

    return txb
  }

  async leaveMatchmaking() {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::matchmaking::leave_matchmaking`,
      arguments: [
        txb.object(OBJECT_IDS.MATCHMAKING_POOL_ID)
      ]
    })

    return txb
  }

  // Battle Operations
  async getBattleHistory(player: string) {
    return await this.client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::battle::BattleResult`
      },
      limit: 50
    })
  }

  // Player Stats
  async getPlayerStats(player: string) {
    return await this.client.getObject({
      id: OBJECT_IDS.GAME_STATE_ID,
      options: {
        showContent: true
      }
    })
  }

  async getLeaderboard(limit: number = 10) {
    return await this.client.getObject({
      id: OBJECT_IDS.LEADERBOARD_ID,
      options: {
        showContent: true
      }
    })
  }

  // Token Operations
  async getTokenBalance(owner: string) {
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
  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
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