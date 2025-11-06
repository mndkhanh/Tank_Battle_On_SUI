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

#### **move_tank()**
```move
public fun move_tank(tank: &mut Tank, x: u64, y: u64)
```
- **Mục đích:** Di chuyển tank đến vị trí mới
- **Parameters:** Tank reference, tọa độ x, y
- **Usage:** Game engine gọi khi player di chuyển

---

### **Battle Module (`tank_battle::battle`)**

#### **create_battle()**
```move
public fun create_battle(
    player1: address,
    player2: address, 
    tank1_id: address,
    tank2_id: address,
    prize_pool: u64,
    clock: &Clock,
    ctx: &mut TxContext
)
```
- **Mục đích:** Tạo trận đấu PvP mới
- **Parameters:** 2 players, tank IDs, prize pool, clock
- **Returns:** Battle object (shared)
- **Events:** BattleCreated

#### **submit_action()**
```move
public fun submit_action(
    battle: &Battle,
    action_type: u8,
    position_x: u64,
    position_y: u64, 
    target_x: u64,
    target_y: u64,
    clock: &Clock,
    ctx: &TxContext
)
```
- **Mục đích:** Submit hành động trong battle
- **Action Types:** 0=move, 1=shoot, 2=special
- **Events:** BattleAction
- **Validation:** Player phải là participant

#### **finish_battle()**
```move
public fun finish_battle(
    battle: &mut Battle,
    winner: address,
    damage_dealt: u64,
    clock: &Clock
)
```
- **Mục đích:** Kết thúc battle và xác định winner
- **Authority:** Chỉ Oracle có thể gọi
- **Events:** BattleResult
- **Side Effects:** Update player stats

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

#### **submitBattleAction()**
```typescript
async submitBattleAction(
    battleId: string,
    actionType: number,
    positionX: number,
    positionY: number,
    targetX: number,
    targetY: number
): Promise<TransactionBlock>
```
- **Mục đích:** Submit game action lên blockchain
- **Real-time:** Gọi từ Phaser game engine
- **Validation:** Oracle sẽ validate sau

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

### **BattleAction Event**
```move
public struct BattleAction has copy, drop {
    battle_id: address,
    player: address,
    action_type: u8,
    position_x: u64,
    position_y: u64,
    target_x: u64,
    target_y: u64,
    timestamp: u64,
}
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