# 🚀 Quick Start Guide - Tank Battle on Sui

## ⚡ 5-Minute Setup

### **Bước 1: Clone & Install**
```bash
git clone <repo-url>
cd Tank_Battle_On_SUI
npm run install:all
```

### **Bước 2: Start Development**
```bash
npm run dev
```
- ✅ Frontend: http://localhost:3000
- ✅ Oracle: WebSocket on port 8080

### **Bước 3: Deploy Contracts (Optional)**
```bash
npm run deploy:testnet
```

---

## 🎯 Developer Quick Actions

### **Frontend Developer - Bắt đầu ngay:**

#### **1. Tạo Component mới:**
```bash
# Tạo file mới
touch frontend/src/components/NewComponent.tsx
```

```typescript
// Template component
import React from 'react'

const NewComponent: React.FC = () => {
  return (
    <div className="bg-game-primary p-4 rounded-lg">
      <h2 className="text-white">New Feature</h2>
    </div>
  )
}

export default NewComponent
```

#### **2. Edit Game Logic:**
```typescript
// frontend/src/game/GameEngine.ts
export class GameScene extends Phaser.Scene {
  create() {
    // ✏️ Add your game objects here
    const tank = this.add.image(200, 300, 'tank')
  }
  
  update() {
    // ✏️ Add game loop logic here
  }
}
```

#### **3. Connect to Blockchain:**
```typescript
// frontend/src/hooks/useWalletConnection.ts
const { connected, account, signAndExecuteTransactionBlock } = useWallet()

const mintTank = async () => {
  const txb = await sdk.mintTank(account.address)
  const result = await signAndExecuteTransactionBlock({ transactionBlock: txb })
}
```

### **Backend Developer - Bắt đầu ngay:**

#### **1. Edit Smart Contract:**
```move
// move_contracts/sources/tank_battle.move
public fun new_game_function(ctx: &mut TxContext) {
    // ✏️ Add your Move logic here
}
```

#### **2. Test Contract:**
```bash
cd move_contracts
sui move test
```

#### **3. Add Oracle Logic:**
```typescript
// scripts/oracle/match-validator.ts
private validateNewRule(battleData: BattleData): boolean {
  // ✏️ Add your validation logic here
  return true
}
```

---

## 📁 File Templates

### **React Component Template:**
```typescript
import React, { useState, useEffect } from 'react'
import { useWalletConnection } from '../hooks/useWalletConnection'

interface ComponentProps {
  // Define props here
}

const ComponentName: React.FC<ComponentProps> = ({ }) => {
  const { connected, account } = useWalletConnection()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Component logic here
  }, [connected])

  if (!connected) {
    return <div>Please connect wallet</div>
  }

  return (
    <div className="bg-game-primary p-4 rounded-lg">
      {/* Component JSX here */}
    </div>
  )
}

export default ComponentName
```

### **Move Module Template:**
```move
module tank_battle::new_module {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    public struct NewStruct has key {
        id: UID,
        // Add fields here
    }

    public fun new_function(ctx: &mut TxContext) {
        // Add logic here
    }

    #[test]
    fun test_new_function() {
        // Add tests here
    }
}
```

### **Oracle Validator Template:**
```typescript
export class NewValidator {
  async validateNewRule(data: any): Promise<boolean> {
    console.log('🔍 Validating new rule...')
    
    // Add validation logic here
    
    console.log('✅ Validation passed')
    return true
  }
}
```

---

## 🎮 Game Development Shortcuts

### **Phaser Scene Setup:**
```typescript
// Quick Phaser scene
export class NewScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NewScene' })
  }

  preload() {
    // Load assets
    this.load.image('sprite', 'path/to/image.png')
  }

  create() {
    // Create game objects
    const sprite = this.add.image(400, 300, 'sprite')
  }

  update() {
    // Game loop
  }
}
```

### **WebSocket Integration:**
```typescript
// Quick WebSocket setup
const ws = new WebSocket('ws://localhost:8080')

ws.onopen = () => {
  console.log('🔗 Connected to oracle')
}

ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  console.log('📨 Received:', message)
}

// Send battle action
ws.send(JSON.stringify({
  type: 'BATTLE_ACTION',
  data: { battleId, player, actionType, positionX, positionY }
}))
```

---

## 🔧 Common Commands

### **Development:**
```bash
# Start everything
npm run dev

# Start individual services  
npm run dev:frontend     # React dev server
npm run dev:oracle       # Oracle WebSocket server

# Build
npm run build:all        # Build everything
npm run build:frontend   # Build React app
npm run build:contracts  # Build Move contracts
```

### **Testing:**
```bash
# Test everything
npm run test:all

# Test individual parts
npm run test:frontend    # Jest tests
npm run test:contracts   # Move tests
cd scripts && npm test   # Oracle tests
```

### **Deployment:**
```bash
# Deploy to testnet
npm run deploy:testnet

# Start production oracle
npm run start:oracle
```

---

## 🚨 Troubleshooting

### **Common Issues:**

#### **Frontend not starting:**
```bash
# Clear cache and reinstall
rm -rf frontend/node_modules
cd frontend && npm install
```

#### **Move compilation error:**
```bash
# Check Move.toml dependencies
cd move_contracts
sui move build --verbose
```

#### **Oracle connection failed:**
```bash
# Check if oracle is running
netstat -an | grep 8080
npm run start:oracle
```

#### **Wallet not connecting:**
```bash
# Check Suiet wallet extension
# Verify network is set to testnet
# Clear browser cache
```

### **Debug Commands:**
```bash
# Check Sui CLI
sui --version

# Check Node.js
node --version

# Check npm packages
npm list

# Check git status
git status
git branch
```

---

## 📚 Next Steps

### **After Quick Start:**

1. **Read Full Documentation:**
   - `SYSTEM_ARCHITECTURE.md` - Hiểu tổng quan hệ thống
   - `FOLDER_STRUCTURE.md` - Chi tiết cấu trúc code
   - `DEVELOPMENT_GUIDE.md` - Hướng dẫn phát triển đầy đủ
   - `API_REFERENCE.md` - Tài liệu API chi tiết

2. **Join Development:**
   - Checkout branch `dev/frontend` hoặc `dev/backend`
   - Follow AI-DLC workflow rules
   - Submit PR với AI agent review

3. **Extend Features:**
   - Add new game mechanics
   - Implement advanced UI
   - Enhance oracle validation
   - Add more test coverage

### **Resources:**
- [Sui Documentation](https://docs.sui.io/)
- [Phaser.js Guide](https://phaser.io/tutorials)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)