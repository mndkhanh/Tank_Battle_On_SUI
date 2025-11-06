# Tank Battle on Sui - Phân Tích Kiến Trúc Hệ Thống

## 📋 Tổng Quan Hệ Thống

Tank Battle on Sui là một Web3 game DApp được xây dựng trên Sui blockchain với kiến trúc AI-Driven Lifecycle (AI-DLC). Hệ thống bao gồm 4 thành phần chính:

1. **Frontend** - React + Phaser.js game client
2. **Smart Contracts** - Sui Move blockchain logic  
3. **Oracle System** - Match validation và anti-cheat
4. **AI-DLC Workflow** - Automated development pipeline

## 🏗️ Cấu Trúc Repository

```
Tank_Battle_On_SUI/
├── 📁 frontend/              # React + Phaser game client
├── 📁 move_contracts/        # Sui Move smart contracts
├── 📁 scripts/              # Deployment & Oracle scripts
├── 📁 .github/workflows/    # CI/CD pipelines
├── 📁 .amazonq/            # AI agent configurations
├── 📁 .vscode/             # VS Code settings
├── 📁 docs/                # Documentation
├── 📄 package.json         # Root workspace config
├── 📄 amplify.yml          # AWS Amplify deployment
└── 📄 README.md            # Project overview
```

## 🎯 Luồng Phát Triển Theo Role

### 👨‍💻 **Frontend Developer**
**Branch:** `dev/frontend`
**Công việc chính:** React UI, Phaser game, Wallet integration

### 👨‍💻 **Backend Developer**  
**Branch:** `dev/backend`
**Công việc chính:** Move contracts, Oracle system, SDK integration

### 🤖 **AI Agents**
- **MoveContractGen** - Smart contract generation
- **FrontendGen** - UI component generation
- **SDKIntegrator** - Blockchain integration
- **QA-Bot** - Automated testing
- **CI/CD-Manager** - Deployment automation