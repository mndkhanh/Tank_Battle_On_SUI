# API Reference - Tank Battle on Sui

## 🔗 Smart Contract Functions

### **Core Game Module (`tank_battle::game`)**

#### **mint_tank()**
```move
public fun mint_tank(ctx: &mut TxContext)
```
- **Mục đích:** Tạo Tank NFT mới cho player
- **Parameters:** TxContext (auto-provided)
- **Returns:** Tank object được transfer cho sender
- **Gas:** ~1,000,000 MIST

#### **~~move_tank()~~** ❌ DEPRECATED
```move
// ❌ KHÔNG DÙNG: Movement được xử lý trong Phaser.js
// ✅ CHỈ LƯU: Final tank stats sau battle
```
- **Lý do:** Real-time movement trong game engine (off-chain)
- **Thay thế:** Tank stats chỉ update sau khi kết thúc battle

---

### **Battle Module (`tank_battle::battle`)** - Settlement Only

#### **create_battle()**
```move
public fun create_battle(
    player1: address,
    player2: address, 
    tank1_id: address,
    tank2_id: address,
    entry_fee: Coin<TANK_TOKEN>,
    clock: &Clock,
    ctx: &mut TxContext
)
```
- **Mục đích:** Tạo battle contract và escrow entry fees
- **Parameters:** 2 players, tank IDs, entry fee coins
- **Returns:** Battle object (shared)
- **Logic:** Lock entry fees, chờ Oracle kết quả

#### **~~submit_action()~~** ❌ REMOVED
```
❌ KHÔNG CẦN: Real-time actions được xử lý off-chain
✅ THAY BẰNG: Oracle validation + finish_battle()
```
- **Lý do:** Game actions xử lý trong Phaser.js (off-chain)
- **Thay thế:** Oracle aggregate actions → call finish_battle()

#### **finish_battle()** - Oracle Only
```move
public fun finish_battle(
    battle: &mut Battle,
    oracle_cap: &OracleCap,
    winner: address,
    total_damage: u64,
    battle_duration: u64,
    clock: &Clock,
    ctx: &mut TxContext
)
```
- **Mục đích:** Settlement battle results và distribute rewards
- **Authority:** Chỉ Oracle (có OracleCap) có thể gọi
- **Logic:** Transfer prize pool đến winner, update stats
- **Events:** BattleResult, RewardDistributed

---

### **Token Module (`tank_battle::token`)**

#### **mint()**
```move
public fun mint(
    treasury_cap: &mut coin::TreasuryCap<TANK_TOKEN>,
    amount: u64,
    ctx: &mut TxContext
): Coin<TANK_TOKEN>
```
- **Mục đích:** Mint TANK tokens
- **Authority:** Treasury cap holder only
- **Returns:** Coin object

---

### **Game State Module (`tank_battle::game_state`)**

#### **join_matchmaking()**
```move
public fun join_matchmaking(
    pool: &mut MatchmakingPool,
    game_state: &GameState,
    ctx: &TxContext
)
```
- **Mục đích:** Tham gia matchmaking pool
- **Logic:** Rank-based matching
- **Side Effects:** Add player to waiting pool

#### **update_player_stats()**
```move
public fun update_player_stats(
    game_state: &mut GameState,
    player: address,
    won: bool,
    damage: u64,
    clock: &Clock
)
```
- **Mục đích:** Cập nhật thống kê player
- **Authority:** Oracle only
- **Updates:** Wins/losses, rank points, damage

---

## 🎮 Frontend SDK Functions

### **TankBattleSDK Class**

#### **mintTank()**
```typescript
async mintTank(signer: string): Promise<TransactionBlock>
```
- **Mục đích:** Tạo transaction mint tank
- **Returns:** TransactionBlock để sign
- **Usage:** `await wallet.signAndExecuteTransactionBlock({ transactionBlock: txb })`

#### **joinArena()**
```typescript
async joinArena(arenaId: string, entryFee: number): Promise<TransactionBlock>
```
- **Mục đích:** Tham gia arena với entry fee
- **Parameters:** Arena ID, fee amount
- **Returns:** TransactionBlock

#### **getTanksByOwner()**
```typescript
async getTanksByOwner(owner: string): Promise<SuiObjectResponse[]>
```
- **Mục đích:** Query tanks của player
- **Returns:** Array of tank objects
- **Usage:** Display trong UI

---

### **BattleSDK Class**

#### **createBattle()**
```typescript
async createBattle(
    player1: string,
    player2: string,
    tank1Id: string, 
    tank2Id: string,
    prizePool: number
): Promise<TransactionBlock>
```
- **Mục đích:** Tạo battle transaction
- **Authority:** Matchmaking system

#### **~~submitBattleAction()~~** ❌ REMOVED
```typescript
// ❌ KHÔNG CẦN: Actions được gửi qua WebSocket đến Oracle
// ✅ THAY BẰNG: WebSocket communication
ws.send(JSON.stringify({
  type: 'BATTLE_ACTION',
  data: { battleId, actionType, positionX, positionY }
}))
```
- **Lý do:** Real-time actions không cần blockchain
- **Thay thế:** WebSocket → Oracle → finish_battle()

#### **getBattleHistory()**
```typescript
async getBattleHistory(player: string): Promise<SuiEvent[]>
```
- **Mục đích:** Query lịch sử battles
- **Returns:** Array of BattleResult events

---

## 🛡️ Oracle API

### **WebSocket Events**

#### **BATTLE_START**
```json
{
  "type": "BATTLE_START",
  "data": {
    "battleId": "0x...",
    "player1": "0x...",
    "player2": "0x...",
    "startTime": 1234567890
  }
}
```

#### **BATTLE_ACTION**
```json
{
  "type": "BATTLE_ACTION", 
  "data": {
    "battleId": "0x...",
    "player": "0x...",
    "actionType": 1,
    "positionX": 100,
    "positionY": 200,
    "targetX": 150,
    "targetY": 250,
    "timestamp": 1234567890
  }
}
```

#### **BATTLE_END**
```json
{
  "type": "BATTLE_END",
  "data": {
    "battleId": "0x...",
    "winner": "0x...",
    "loser": "0x...", 
    "damageDealt": 850,
    "endTime": 1234567890
  }
}
```

### **Oracle Validation Rules**

#### **Anti-Cheat Checks:**
- **Movement Speed:** Max 100 pixels/second
- **Fire Rate:** Min 500ms between shots
- **Teleportation:** Max 200 pixels instant movement
- **Battle Duration:** 30s - 10 minutes

#### **Damage Validation:**
- **Range:** 1-1000 damage per battle
- **Calculation:** Based on hits và weapon type
- **Consistency:** Cross-check với action history

---

## 🎨 React Components API

### **GameContainer Component**
```typescript
interface GameContainerProps {
  onBattleStart?: (battleId: string) => void
  onBattleEnd?: (result: BattleResult) => void
}
```

### **WalletStatus Component**
```typescript
interface WalletStatusProps {
  showTankCount?: boolean
  showBalance?: boolean
  onMintTank?: () => void
}
```

### **GameLobby Component**
```typescript
interface GameLobbyProps {
  arenas: Arena[]
  onJoinArena?: (arenaId: string) => void
  playerRank?: number
}
```

---

## 🔧 Configuration Constants

### **Game Config (`constants.ts`)**
```typescript
export const GAME_CONFIG = {
  TANK_MINT_FEE: 1000000,        // 1 SUI in MIST
  ARENA_ENTRY_FEES: {
    NEWBIE: 10,                   // 10 TANK tokens
    PRO: 50,                      // 50 TANK tokens  
    EXPERT: 100                   // 100 TANK tokens
  },
  BATTLE_TIMEOUT: 600000,         // 10 minutes
  MAX_PLAYERS_PER_ARENA: 4
}
```

### **Network Config**
```typescript
export const NETWORK = 'testnet'
export const PACKAGE_ID = '0x...'  // Updated after deployment
export const GAME_STATE_ID = '0x...'
export const MATCHMAKING_POOL_ID = '0x...'
```

---

## 📊 Event Structures

### **BattleResult Event**
```move
public struct BattleResult has copy, drop {
    battle_id: address,
    winner: address,
    loser: address,
    damage_dealt: u64,
    battle_duration: u64,
}
```

### **~~BattleAction Event~~** ❌ REMOVED
```move
// ❌ KHÔNG CẦN: Real-time actions không emit events
// ✅ THAY BẰNG: WebSocket messages đến Oracle
```

---

## 🚨 Error Codes

### **Move Contract Errors:**
- `0`: Unauthorized player
- `1`: Battle not active
- `2`: Battle already finished
- `3`: Invalid winner address

### **Oracle Errors:**
- `VALIDATION_FAILED`: Battle data validation failed
- `CHEAT_DETECTED`: Anti-cheat system triggered
- `TIMEOUT`: Battle exceeded time limit
- `INVALID_ACTION`: Action sequence invalid