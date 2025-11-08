import { SuiClient } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { PACKAGE_ID } from './constants'

export interface BattleAction {
  battleId: string
  player: string
  actionType: number // 0=move, 1=shoot, 2=special
  positionX: number
  positionY: number
  targetX?: number
  targetY?: number
  timestamp: number
}

export interface BattleResult {
  battleId: string
  winner: string
  loser: string
  damageDealt: number
  battleDuration: number
}

export class BattleSDK {
  private client: SuiClient
  private websocket: WebSocket | null = null

  constructor(client: SuiClient) {
    this.client = client
  }

  // WebSocket Connection to Oracle
  connectToOracle(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      this.websocket = new WebSocket('ws://localhost:8080')
      
      this.websocket.onopen = () => {
        console.log('🔗 Connected to Battle Oracle')
        resolve(this.websocket!)
      }
      
      this.websocket.onerror = (error) => {
        console.error('❌ Oracle connection failed:', error)
        reject(error)
      }
      
      this.websocket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        this.handleOracleMessage(message)
      }
    })
  }

  private handleOracleMessage(message: any) {
    switch (message.type) {
      case 'BATTLE_RESULT_CONFIRMED':
        console.log('✅ Battle result confirmed:', message.data)
        break
      case 'BATTLE_RESULT_FAILED':
        console.error('❌ Battle result failed:', message.data)
        break
      default:
        console.log('📨 Oracle message:', message)
    }
  }

  // Send Battle Actions to Oracle
  sendBattleAction(action: BattleAction) {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.error('❌ Oracle not connected')
      return
    }

    this.websocket.send(JSON.stringify({
      type: 'BATTLE_ACTION',
      data: action
    }))
  }

  // Battle Lifecycle
  startBattle(battleId: string, player1: string, player2: string) {
    if (!this.websocket) return

    this.websocket.send(JSON.stringify({
      type: 'BATTLE_START',
      data: {
        battleId,
        player1,
        player2,
        startTime: Date.now()
      }
    }))
  }

  endBattle(battleId: string, winner: string, loser: string, damageDealt: number) {
    if (!this.websocket) return

    this.websocket.send(JSON.stringify({
      type: 'BATTLE_END',
      data: {
        battleId,
        winner,
        loser,
        damageDealt,
        endTime: Date.now()
      }
    }))
  }

  // Query Battle Data
  async getBattleById(battleId: string) {
    return await this.client.getObject({
      id: battleId,
      options: {
        showContent: true
      }
    })
  }

  async getActiveBattles() {
    const events = await this.client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::battle::BattleCreated`
      },
      limit: 50,
      order: 'descending'
    })

    return events.data.filter(event => {
      // Filter for active battles only
      return true // Simplified for prototype
    })
  }

  async getBattleEvents(battleId: string) {
    return await this.client.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::battle::BattleResult`
      },
      limit: 100
    })
  }

  // Validation Helpers
  validateAction(action: BattleAction): boolean {
    // Basic client-side validation
    if (action.actionType < 0 || action.actionType > 2) return false
    if (action.positionX < 0 || action.positionY < 0) return false
    
    return true
  }

  // Disconnect
  disconnect() {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
      console.log('🔌 Disconnected from Battle Oracle')
    }
  }
}