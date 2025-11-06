# Hướng Dẫn Phát Triển Tank Battle on Sui

## 🚀 Quick Start cho Developer

### **Bước 1: Setup Environment**
```bash
# Clone repository
git clone <repo-url>
cd Tank_Battle_On_SUI

# Install dependencies
npm run install:all

# Setup branches
git checkout -b dev/frontend  # For frontend dev
git checkout -b dev/backend   # For backend dev
```

### **Bước 2: Start Development**
```bash
# Start full development environment
npm run dev

# Or start individual services
npm run dev:frontend  # React + Vite dev server
npm run dev:oracle    # Oracle WebSocket server
```

---

## 👨💻 Frontend Developer Workflow

### **🎯 Nhiệm vụ chính:**
- React UI components
- Phaser.js game integration  
- Sui wallet connection
- Game state management

### **📁 Files cần edit:**

#### **1. Game UI Development**
```
frontend/src/components/
├── GameContainer.tsx    # ✏️ Edit: Phaser game integration
├── WalletStatus.tsx     # ✏️ Edit: Wallet UI
├── GameLobby.tsx        # ✏️ Edit: Arena selection
└── [NewComponent].tsx   # ➕ Add: New UI components
```

#### **2. Game Engine Development**
```
frontend/src/game/
├── GameEngine.ts        # ✏️ Edit: Phaser scenes, game logic
├── TankController.ts    # ➕ Add: Tank movement logic
├── BattleScene.ts       # ➕ Add: PvP battle scene
└── GameAssets.ts        # ➕ Add: Asset management
```

#### **3. Blockchain Integration**
```
frontend/src/sdk/
├── suiClient.ts         # ✏️ Edit: Blockchain client
├── battleSDK.ts         # ✏️ Edit: Battle transactions
└── constants.ts         # ✏️ Edit: Package IDs, config
```

#### **4. Styling & Theme**
```
frontend/
├── tailwind.config.js   # ✏️ Edit: Game colors, themes
├── src/index.css        # ✏️ Edit: Global styles
└── src/components/*.tsx # ✏️ Edit: Component styling
```

### **🔧 Development Commands:**
```bash
cd frontend

# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm test                 # Run Jest tests
npm run lint             # ESLint check

# Testing
npm run test:watch       # Watch mode testing
npm run test:coverage    # Coverage report
```

### **🎮 Game Development Flow:**

1. **Setup Phaser Scene** (`GameEngine.ts`)
   ```typescript
   export class BattleScene extends Phaser.Scene {
     create() {
       // Add tanks, bullets, UI
     }
     update() {
       // Game loop logic
     }
   }
   ```

2. **Connect to Blockchain** (`battleSDK.ts`)
   ```typescript
   const battleSDK = new BattleSDK(suiClient)
   const txb = await battleSDK.submitBattleAction(...)
   ```

3. **Real-time Communication** (WebSocket)
   ```typescript
   const ws = new WebSocket('ws://localhost:8080')
   ws.send(JSON.stringify({ type: 'BATTLE_ACTION', data: ... }))
   ```

---

## 👨💻 Backend Developer Workflow

### **🎯 Nhiệm vụ chính:**
- Sui Move smart contracts
- Oracle validation system
- Anti-cheat mechanisms
- SDK integration scripts

### **📁 Files cần edit:**

#### **1. Smart Contract Development**
```
move_contracts/sources/
├── tank_battle.move           # ✏️ Edit: Core game mechanics
├── modules/battle.move        # ✏️ Edit: PvP combat logic
├── modules/game_state.move    # ✏️ Edit: Player stats, matchmaking
├── modules/token.move         # ✏️ Edit: Token economics
├── modules/arena.move         # ✏️ Edit: Arena management
└── modules/treasury.move      # ✏️ Edit: Staking & rewards
```

#### **2. Oracle System Development**
```
scripts/oracle/
├── match-validator.ts         # ✏️ Edit: Battle validation logic
├── result-submitter.ts        # ✏️ Edit: WebSocket server
├── anti-cheat.ts             # ✏️ Edit: Cheat detection rules
└── game-coordinator.ts        # ➕ Add: Match coordination
```

#### **3. Deployment & Testing**
```
scripts/
├── deployment/deploy-contracts.ts  # ✏️ Edit: Deployment logic
├── testing/integration-test.ts     # ✏️ Edit: Test suites
└── testing/load-test.ts           # ➕ Add: Performance testing
```

### **🔧 Development Commands:**
```bash
# Move contract development
cd move_contracts
sui move build               # Build contracts
sui move test                # Run Move tests
sui client publish           # Deploy to testnet

# Oracle development
cd scripts/oracle
ts-node result-submitter.ts  # Start oracle server
npm run test:oracle          # Test oracle logic

# Deployment
npm run deploy:testnet       # Deploy everything
npm run start:oracle         # Start production oracle
```

### **⚔️ Smart Contract Development Flow:**

1. **Define Game Logic** (`battle.move`)
   ```move
   public fun create_battle(
       player1: address,
       player2: address,
       // ... parameters
   ) {
       // Battle creation logic
   }
   ```

2. **Add Events** (for frontend listening)
   ```move
   public struct BattleResult has copy, drop {
       battle_id: address,
       winner: address,
       // ... event data
   }
   ```

3. **Test Contracts**
   ```move
   #[test]
   fun test_battle_creation() {
       // Test logic
   }
   ```

### **🛡️ Oracle Development Flow:**

1. **Validate Battle Data** (`match-validator.ts`)
   ```typescript
   async validateBattleResult(battleData: BattleData): Promise<boolean> {
       // Anti-cheat validation
       // Damage calculation check
       // Timeline validation
   }
   ```

2. **Submit to Blockchain** (`result-submitter.ts`)
   ```typescript
   const txb = new TransactionBlock()
   txb.moveCall({
       target: `${PACKAGE_ID}::battle::finish_battle`,
       arguments: [...]
   })
   ```

---

## 🤖 AI-DLC Integration

### **AI Agents tự động hỗ trợ:**

#### **MoveContractGen**
- Tự động generate Move contract templates
- Security audit và gas optimization
- **Trigger:** Edit `*.move` files

#### **FrontendGen** 
- Generate React components
- Phaser.js integration helpers
- **Trigger:** Edit `frontend/src/**/*.tsx`

#### **SDKIntegrator**
- Auto-generate SDK functions
- Transaction builder optimization
- **Trigger:** Edit `scripts/**/*.ts`

#### **QA-Bot**
- Automated testing
- Code coverage reports
- **Trigger:** Edit test files

#### **CI/CD-Manager**
- Auto-deployment to testnet
- Build optimization
- **Trigger:** Push to `main` branch

### **🔄 AI Workflow:**
1. Developer commits code
2. AI agents auto-review
3. Automated testing runs
4. Deploy to testnet (if tests pass)
5. Update frontend with new contract addresses

---

## 📊 Monitoring & Debugging

### **Frontend Debugging:**
```bash
# Browser DevTools
console.log('Battle action:', action)

# React DevTools
# Phaser Debug Mode
const config = { physics: { arcade: { debug: true } } }
```

### **Backend Debugging:**
```bash
# Move contract events
sui client events --package <PACKAGE_ID>

# Oracle logs
tail -f oracle.log

# Transaction inspection
sui client transaction <TX_HASH>
```

### **Performance Monitoring:**
- Frontend: Lighthouse, React Profiler
- Backend: Sui Explorer, Oracle metrics
- Game: Phaser Debug Mode, FPS monitoring

---

## 🚨 Common Issues & Solutions

### **Frontend Issues:**
- **Wallet not connecting:** Check Suiet wallet kit version
- **Phaser not loading:** Verify game config và assets
- **Transaction failing:** Check package ID và function signatures

### **Backend Issues:**
- **Move compilation error:** Check syntax và dependencies
- **Oracle validation failing:** Review anti-cheat rules
- **Deployment failing:** Verify Sui CLI setup và gas budget

### **Integration Issues:**
- **WebSocket connection:** Check oracle server status
- **Package ID mismatch:** Re-deploy và update constants
- **Event not emitting:** Verify Move event structure