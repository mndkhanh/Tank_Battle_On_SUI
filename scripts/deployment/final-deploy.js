const { SuiClient, getFullnodeUrl } = require("@mysten/sui.js/client");
const { Ed25519Keypair } = require("@mysten/sui.js/keypairs/ed25519");
const { TransactionBlock } = require("@mysten/sui.js/transactions");
const { decodeSuiPrivateKey } = require("@mysten/sui.js/cryptography"); // Thêm import này
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Thêm để load .env

async function finalDeploy() {
  console.log("🚀 Final deployment attempt...");

  try {
    // Use private key from environment
    const privateKeyStr = process.env.SUI_PRIVATE_KEY;
    if (!privateKeyStr) {
      throw new Error(
        "SUI_PRIVATE_KEY not found in environment. Set in .env or export it."
      );
    }
    if (!privateKeyStr.startsWith("suiprivkey")) {
      throw new Error(
        'SUI_PRIVATE_KEY must be Bech32 encoded (starts with "suiprivkey"). Export from sui keytool.'
      );
    }

    // Decode Bech32 private key to raw bytes
    const { secretKey } = decodeSuiPrivateKey(privateKeyStr);
    const keypair = Ed25519Keypair.fromSecretKey(secretKey);

    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    const address = keypair.getPublicKey().toSuiAddress();

    console.log(`📍 Address: ${address}`);

    // Check balance
    const balance = await client.getBalance({ owner: address });
    console.log(
      `💰 Balance: ${Number(balance.totalBalance) / 1_000_000_000} SUI`
    );

    if (Number(balance.totalBalance) < 100_000_000) {
      throw new Error("Need more SUI for deployment");
    }

    // Get modules
    const modules = getModules();
    console.log(`📦 Modules: ${modules.length}`);

    // Deploy
    const txb = new TransactionBlock();
    const [upgradeCap] = txb.publish({
      modules,
      dependencies: ["0x1", "0x2"],
    });
    txb.transferObjects([upgradeCap], address);

    console.log("⏳ Deploying...");
    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: txb,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    console.log("✅ DEPLOYED!");
    console.log(`📋 TX: ${result.digest}`);

    const packageId = result.objectChanges?.find(
      (change) => change.type === "published"
    )?.packageId;

    if (!packageId) {
      throw new Error("No package ID found");
    }

    console.log(`📦 Package ID: ${packageId}`);

    // Save deployment
    const info = {
      network: "testnet",
      packageId,
      deployer: address,
      timestamp: new Date().toISOString(),
      transactionDigest: result.digest,
      explorerUrl: `https://suiexplorer.com/txblock/${result.digest}?network=testnet`,
    };

    fs.writeFileSync(
      path.join(__dirname, "deployment.json"),
      JSON.stringify(info, null, 2)
    );

    console.log("💾 Saved to deployment.json");
    console.log(`🔗 Explorer: ${info.explorerUrl}`);

    return info;
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

function getModules() {
  const buildDir = path.join(
    __dirname,
    "../../move_contracts/build/tank_battle/bytecode_modules"
  );
  const modules = [];

  if (!fs.existsSync(buildDir)) {
    throw new Error("Build directory not found. Run: npm run build");
  }

  const files = fs.readdirSync(buildDir);
  for (const file of files) {
    if (file.endsWith(".mv")) {
      const bytecode = fs.readFileSync(path.join(buildDir, file));
      modules.push(Array.from(bytecode));
    }
  }

  if (modules.length === 0) {
    throw new Error("No modules found");
  }

  return modules;
}

if (require.main === module) {
  finalDeploy()
    .then((info) => {
      console.log("🎉 SUCCESS! Package ID:", info.packageId);
    })
    .catch((error) => {
      console.error("💥 FAILED:", error.message);
      process.exit(1);
    });
}

module.exports = { finalDeploy };
