import WebSocket from 'ws'
import { MatchValidator } from './match-validator'
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'

export class ResultSubmitter {
  private validator: MatchValidator
  private wsServer: WebSocket.Server
  private activeBattles: Map<string, any> = new Map()

  constructor() {
    const client = new SuiClient({ url: getFullnodeUrl('testnet') })
    const keypair = Ed25519Keypair.fromSecretKey(process.env.ORACLE_PRIVATE_KEY!)
    const packageId = process.env.PACKAGE_ID!
    
    this.validator = new MatchValidator(client, keypair, packageId)
    this.wsServer = new WebSocket.Server({ port: 8080 })
    
    this.setupWebSocketHandlers()
  }

  private setupWebSocketHandlers() {
    this.wsServer.on('connection', (ws) => {
      console.log('🔗 Game client connected')
      
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString())
          await this.handleMessage(ws, message)
        } catch (error) {
          console.error('❌ Message handling error:', error)
        }
      })

      ws.on('close', () => {
        console.log('🔌 Game client disconnected')
      })
    })
  }

  private async handleMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'BATTLE_START':
        await this.handleBattleStart(message.data)
        break
        
      case 'BATTLE_ACTION':
        await this.handleBattleAction(message.data)
        break
        
      case 'BATTLE_END':
        await this.handleBattleEnd(ws, message.data)
        break
        
      default:
        console.log('❓ Unknown message type:', message.type)
    }
  }

  private async handleBattleStart(data: any) {
    console.log(`🚀 Battle started: ${data.battleId}`)
    this.activeBattles.set(data.battleId, {
      startTime: Date.now(),
      actions: [],
      players: [data.player1, data.player2]
    })
  }

  private async handleBattleAction(data: any) {
    const battle = this.activeBattles.get(data.battleId)
    if (battle) {
      battle.actions.push({
        player: data.player,
        actionType: data.actionType,
        positionX: data.positionX,
        positionY: data.positionY,
        targetX: data.targetX,
        targetY: data.targetY,
        timestamp: Date.now()
      })
    }
  }

  private async handleBattleEnd(ws: WebSocket, data: any) {
    console.log(`🏁 Battle ended: ${data.battleId}`)
    
    const battle = this.activeBattles.get(data.battleId)
    if (!battle) {
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Battle not found' }))
      return
    }

    const battleData = {
      battleId: data.battleId,
      winner: data.winner,
      loser: data.loser,
      damageDealt: data.damageDealt,
      battleDuration: Date.now() - battle.startTime,
      actions: battle.actions
    }

    try {
      const txHash = await this.validator.submitBattleResult(battleData)
      
      ws.send(JSON.stringify({
        type: 'BATTLE_RESULT_CONFIRMED',
        data: { battleId: data.battleId, txHash }
      }))
      
      this.activeBattles.delete(data.battleId)
    } catch (error) {
      console.error('❌ Failed to submit battle result:', error)
      ws.send(JSON.stringify({
        type: 'BATTLE_RESULT_FAILED',
        data: { battleId: data.battleId, error: error.message }
      }))
    }
  }

  start() {
    console.log('🚀 Oracle Result Submitter started on port 8080')
  }
}

// Start the oracle
if (require.main === module) {
  const submitter = new ResultSubmitter()
  submitter.start()
}