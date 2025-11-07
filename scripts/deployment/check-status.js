const fs = require('fs');
const path = require('path');

function checkDeploymentStatus() {
    console.log('🔍 Checking Tank Battle deployment status...');
    
    // Check if deployment exists
    const deploymentPath = path.join(__dirname, 'deployment.json');
    if (!fs.existsSync(deploymentPath)) {
        console.log('❌ No deployment found. Run `npm run deploy` first.');
        return;
    }
    
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    
    console.log('\n📦 Deployment Information:');
    console.log(`  Network: ${deployment.network}`);
    console.log(`  Package ID: ${deployment.packageId}`);
    console.log(`  Transaction: ${deployment.transactionDigest}`);
    console.log(`  Explorer: ${deployment.explorerUrl}`);
    
    if (deployment.objects) {
        console.log('\n🏗️  Created Objects:');
        console.log(`  Marketplace: ${deployment.objects.marketplace}`);
        console.log(`  Battle Registry: ${deployment.objects.battleRegistry}`);
        console.log(`  Upgrade Cap: ${deployment.objects.upgradeCap}`);
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('  1. Test functions: npm run test-simple');
    console.log('  2. View on explorer: Copy URLs above');
    console.log('  3. Manual testing: Use sui client commands');
    
    console.log('\n📋 Manual Test Commands:');
    console.log(`  # Mint Tank (Free)`);
    console.log(`  sui client call --package ${deployment.packageId} --module game --function mint_tank --gas-budget 10000000`);
    console.log(`  `);
    console.log(`  # Check owned objects`);
    console.log(`  sui client objects`);
    console.log(`  `);
    console.log(`  # View package details`);
    console.log(`  sui client object ${deployment.packageId}`);
}

checkDeploymentStatus();