# Phân Tích Chi Tiết Cấu Trúc Thư Mục

## 📁 `/frontend` - React Game Client

### Cấu trúc thư mục:
```
frontend/
├── 📁 src/
│   ├── 📁 components/       # React components
│   ├── 📁 game/            # Phaser.js game engine
│   ├── 📁 hooks/           # Custom React hooks
│   ├── 📁 sdk/             # Sui blockchain SDK
│   ├── 📁 wallet/          # Wallet integration
│   ├── 📄 App.tsx          # Main app component
│   ├── 📄 main.tsx         # React entry point
│   └── 📄 index.css        # Global styles
├── 📁 public/              # Static assets
├── 📄 package.json         # Dependencies & scripts
├── 📄 vite.config.ts       # Vite build config
├── 📄 tailwind.config.js   # Tailwind CSS config
├── 📄 tsconfig.json        # TypeScript config
└── 📄 jest.config.js       # Jest testing config
```

### 🎯 **Mục đích từng file:**

#### **Core Components (`/src/components/`)**
- `GameContainer.tsx` - Container chứa Phaser game engine
- `WalletStatus.tsx` - Hiển thị trạng thái ví và số tank
- `GameLobby.tsx` - Sảnh game, chọn arena

#### **Game Engine (`/src/game/`)**
- `GameEngine.ts` - Phaser.js configuration và game scenes
- Chứa logic 2D game: tank movement, shooting, collision

#### **Blockchain Integration (`/src/sdk/`)**
- `suiClient.ts` - Sui blockchain client setup
- `battleSDK.ts` - Battle transaction builders
- `constants.ts` - Package IDs và game config

#### **Wallet Integration (`/src/wallet/`)**
- `WalletConnect.tsx` - Sui wallet connection component

#### **Custom Hooks (`/src/hooks/`)**
- `useWalletConnection.ts` - Wallet state management
- `test.tsx` - Testing utilities

### 🚀 **Dev Frontend bắt đầu từ đâu?**

1. **Phát triển UI:** Edit `src/components/*.tsx`
2. **Game logic:** Edit `src/game/GameEngine.ts`
3. **Blockchain tương tác:** Edit `src/sdk/*.ts`
4. **Styling:** Edit `tailwind.config.js` và `src/index.css`

---

## 📁 `/move_contracts` - Sui Smart Contracts

### Cấu trúc thư mục:
```
move_contracts/
├── 📁 sources/
│   ├── 📁 modules/          # Game logic modules
│   │   ├── 📄 token.move    # TANK_TOKEN currency
│   │   ├── 📄 arena.move    # Arena & match management
│   │   ├── 📄 treasury.move # Token staking & rewards
│   │   ├── 📄 battle.move   # PvP combat system
│   │   └── 📄 game_state.move # Player stats & matchmaking
│   └── 📄 tank_battle.move  # Core game mechanics
├── 📁 tests/               # Move unit tests
└── 📄 Move.toml            # Move package config
```

### 🎯 **Mục đích từng module:**

#### **Core Game (`tank_battle.move`)**
- Tank NFT creation và management
- Basic game mechanics

#### **Token System (`modules/token.move`)**
- TANK_TOKEN currency implementation
- Minting và treasury management

#### **Battle System (`modules/battle.move`)**
- PvP combat logic
- Battle events và result validation
- Real-time action tracking

#### **Game State (`modules/game_state.move`)**
- Player statistics tracking
- Matchmaking pool management
- Leaderboard system

#### **Arena Management (`modules/arena.move`)**
- Arena creation và configuration
- Match coordination

#### **Treasury (`modules/treasury.move`)**
- Token staking mechanism
- Reward distribution system

### 🚀 **Dev Backend bắt đầu từ đâu?**

1. **Game mechanics:** Edit `sources/tank_battle.move`
2. **Battle logic:** Edit `sources/modules/battle.move`
3. **Token economics:** Edit `sources/modules/treasury.move`
4. **Testing:** Add tests in `tests/` folder

---

## 📁 `/scripts` - Automation & Oracle

### Cấu trúc thư mục:
```
scripts/
├── 📁 deployment/          # Contract deployment
│   └── 📄 deploy-contracts.ts
├── 📁 oracle/              # Match validation system
│   ├── 📄 match-validator.ts    # Battle result validation
│   ├── 📄 result-submitter.ts   # WebSocket oracle server
│   └── 📄 anti-cheat.ts         # Anti-cheat system
├── 📁 testing/             # Integration tests
│   └── 📄 integration-test.ts
├── 📄 ai-review.js         # AI code review
└── 📄 deploy-testnet.js    # Legacy deployment
```

### 🎯 **Mục đích từng script:**

#### **Deployment (`/deployment/`)**
- `deploy-contracts.ts` - Deploy Move contracts to Sui testnet
- Auto-update package IDs in frontend

#### **Oracle System (`/oracle/`)**
- `match-validator.ts` - Validate battle results from Phaser
- `result-submitter.ts` - WebSocket server for real-time communication
- `anti-cheat.ts` - Prevent cheating (speed hacks, rapid fire)

#### **Testing (`/testing/`)**
- `integration-test.ts` - End-to-end testing suite

### 🚀 **Dev Backend Oracle bắt đầu từ đâu?**

1. **Oracle logic:** Edit `scripts/oracle/match-validator.ts`
2. **Real-time communication:** Edit `scripts/oracle/result-submitter.ts`
3. **Anti-cheat rules:** Edit `scripts/oracle/anti-cheat.ts`

---

## 📁 `/.amazonq` - AI-DLC Configuration

### Cấu trúc thư mục:
```
.amazonq/
├── 📁 rules/               # AI workflow rules
│   └── 📄 ai-dlc-rules.md
├── 📄 ai-agents.json       # AI agent configuration
└── 📄 task-board.json      # AI task management
```

### 🎯 **Mục đích:**
- **AI Agents:** MoveContractGen, FrontendGen, SDKIntegrator, QA-Bot
- **Workflow Rules:** Code review standards, deployment rules
- **Task Management:** Separate AI queues for frontend/backend devs

---

## 📁 `/.github/workflows` - CI/CD Pipelines

### Cấu trúc thư mục:
```
.github/workflows/
├── 📄 ai-dlc-frontend.yml  # Frontend CI/CD pipeline
└── 📄 ai-dlc-backend.yml   # Backend CI/CD pipeline
```

### 🎯 **Pipeline Flow:**
1. **Frontend:** Build → Test → Deploy to AWS Amplify
2. **Backend:** Security Audit → Move Tests → Deploy to Sui Testnet

---

## 📄 **Root Configuration Files**

### **package.json** - Workspace Management
```json
{
  "scripts": {
    "dev": "Start frontend + oracle",
    "build:all": "Build everything", 
    "deploy:testnet": "Deploy to Sui testnet",
    "start:oracle": "Start oracle server"
  }
}
```

### **amplify.yml** - AWS Amplify Deployment
- Frontend build và deployment configuration

### **.vscode/settings.json** - VS Code AI Integration
- Amazon Q AI agents configuration
- Auto-trigger settings cho code review