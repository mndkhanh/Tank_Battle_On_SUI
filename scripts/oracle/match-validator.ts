import { SuiClient } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'

interface BattleData {
  battleId: string
  winner: string
  loser: string
  damageDealt: number
  battleDuration: number
  actions: BattleAction[]
}

interface BattleAction {
  player: string
  actionType: number
  positionX: number
  positionY: number
  targetX: number
  targetY: number
  timestamp: number
}

export class MatchValidator {
  private client: SuiClient
  private keypair: Ed25519Keypair
  private packageId: string

  constructor(client: SuiClient, keypair: Ed25519Keypair, packageId: string) {
    this.client = client
    this.keypair = keypair
    this.packageId = packageId
  }

  async validateBattleResult(battleData: BattleData): Promise<boolean> {
    console.log(`🔍 Validating battle ${battleData.battleId}...`)
    
    // Anti-cheat validation
    if (!this.validateActionSequence(battleData.actions)) {
      console.log('❌ Invalid action sequence detected')
      return false
    }

    if (!this.validateDamageCalculation(battleData)) {
      console.log('❌ Invalid damage calculation')
      return false
    }

    if (!this.validateBattleDuration(battleData)) {
      console.log('❌ Invalid battle duration')
      return false
    }

    console.log('✅ Battle validation passed')
    return true
  }

  async submitBattleResult(battleData: BattleData): Promise<string> {
    const isValid = await this.validateBattleResult(battleData)
    if (!isValid) {
      throw new Error('Battle validation failed')
    }

    const txb = new TransactionBlock()
    
    txb.moveCall({
      target: `${this.packageId}::battle::finish_battle`,
      arguments: [
        txb.object(battleData.battleId),
        txb.pure(battleData.winner),
        txb.pure(battleData.damageDealt),
      ]
    })

    const result = await this.client.signAndExecuteTransactionBlock({
      signer: this.keypair,
      transactionBlock: txb,
    })

    console.log(`✅ Battle result submitted: ${result.digest}`)
    return result.digest
  }

  private validateActionSequence(actions: BattleAction[]): boolean {
    // Validate action timestamps are sequential
    for (let i = 1; i < actions.length; i++) {
      if (actions[i].timestamp <= actions[i-1].timestamp) {
        return false
      }
    }
    return true
  }

  private validateDamageCalculation(battleData: BattleData): boolean {
    // Validate damage is within reasonable bounds
    return battleData.damageDealt > 0 && battleData.damageDealt <= 1000
  }

  private validateBattleDuration(battleData: BattleData): boolean {
    // Battle should be between 30 seconds and 10 minutes
    return battleData.battleDuration >= 30000 && battleData.battleDuration <= 600000
  }
}