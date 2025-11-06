import { SuiClient } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { PACKAGE_ID } from './constants'

export class BattleSDK {
  private client: SuiClient

  constructor(client: SuiClient) {
    this.client = client
  }

  async createBattle(
    player1: string,
    player2: string,
    tank1Id: string,
    tank2Id: string,
    prizePool: number
  ) {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::battle::create_battle`,
      arguments: [
        txb.pure(player1),
        txb.pure(player2),
        txb.pure(tank1Id),
        txb.pure(tank2Id),
        txb.pure(prizePool),
        txb.object('0x6'), // Clock object
      ]
    })

    return txb
  }

  async submitBattleAction(
    battleId: string,
    actionType: number,
    positionX: number,
    positionY: number,
    targetX: number,
    targetY: number
  ) {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::battle::submit_action`,
      arguments: [
        txb.object(battleId),
        txb.pure(actionType),
        txb.pure(positionX),
        txb.pure(positionY),
        txb.pure(targetX),
        txb.pure(targetY),
        txb.object('0x6'), // Clock object
      ]
    })

    return txb
  }

  async joinMatchmaking() {
    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${PACKAGE_ID}::game_state::join_matchmaking`,
      arguments: [
        txb.object('MATCHMAKING_POOL_ID'), // Will be set after deployment
        txb.object('GAME_STATE_ID'), // Will be set after deployment
      ]
    })

    return txb
  }

  async getBattleHistory(player: string) {
    return await this.client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::battle::BattleResult`
      },
      limit: 50
    })
  }

  async getPlayerStats(player: string) {
    // Query player stats from game state
    return await this.client.getObject({
      id: 'GAME_STATE_ID',
      options: {
        showContent: true
      }
    })
  }
}