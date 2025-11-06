export class AntiCheatSystem {
  private suspiciousPlayers: Set<string> = new Set()
  private actionHistory: Map<string, any[]> = new Map()

  validatePlayerActions(battleId: string, actions: any[]): boolean {
    console.log(`🛡️ Running anti-cheat validation for battle ${battleId}`)
    
    // Check for impossible movement speeds
    if (!this.validateMovementSpeed(actions)) {
      return false
    }

    // Check for rapid-fire exploits
    if (!this.validateFireRate(actions)) {
      return false
    }

    // Check for teleportation hacks
    if (!this.validatePositionChanges(actions)) {
      return false
    }

    return true
  }

  private validateMovementSpeed(actions: any[]): boolean {
    const MAX_SPEED = 100 // pixels per second
    
    for (let i = 1; i < actions.length; i++) {
      const prev = actions[i-1]
      const curr = actions[i]
      
      if (prev.actionType === 0 && curr.actionType === 0) { // Both are move actions
        const distance = Math.sqrt(
          Math.pow(curr.positionX - prev.positionX, 2) + 
          Math.pow(curr.positionY - prev.positionY, 2)
        )
        const timeDiff = (curr.timestamp - prev.timestamp) / 1000
        const speed = distance / timeDiff
        
        if (speed > MAX_SPEED) {
          console.log(`❌ Speed hack detected: ${speed} > ${MAX_SPEED}`)
          return false
        }
      }
    }
    
    return true
  }

  private validateFireRate(actions: any[]): boolean {
    const MIN_FIRE_INTERVAL = 500 // milliseconds
    let lastFireTime = 0
    
    for (const action of actions) {
      if (action.actionType === 1) { // Shoot action
        if (lastFireTime > 0 && action.timestamp - lastFireTime < MIN_FIRE_INTERVAL) {
          console.log(`❌ Rapid fire detected: ${action.timestamp - lastFireTime}ms`)
          return false
        }
        lastFireTime = action.timestamp
      }
    }
    
    return true
  }

  private validatePositionChanges(actions: any[]): boolean {
    const MAX_TELEPORT_DISTANCE = 200 // pixels
    
    for (let i = 1; i < actions.length; i++) {
      const prev = actions[i-1]
      const curr = actions[i]
      
      const distance = Math.sqrt(
        Math.pow(curr.positionX - prev.positionX, 2) + 
        Math.pow(curr.positionY - prev.positionY, 2)
      )
      
      if (distance > MAX_TELEPORT_DISTANCE) {
        console.log(`❌ Teleportation detected: ${distance} pixels`)
        return false
      }
    }
    
    return true
  }

  flagSuspiciousPlayer(player: string, reason: string) {
    this.suspiciousPlayers.add(player)
    console.log(`🚨 Player flagged: ${player} - ${reason}`)
  }

  isSuspicious(player: string): boolean {
    return this.suspiciousPlayers.has(player)
  }
}