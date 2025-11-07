const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function testGunMinting() {
    console.log('🔫 Testing Gun Minting (0.1 SUI)...');
    
    const deploymentPath = path.join(__dirname, 'deployment.json');
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    
    try {
        // Get SUI coin for payment
        const objectsOutput = execSync('sui client objects', { encoding: 'utf8' });
        const lines = objectsOutput.split('\n');
        let coinId = null;
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('coin::Coin') && lines[i-1] && lines[i-1].includes('objectId')) {
                const idLine = lines[i-1];
                const match = idLine.match(/0x[a-fA-F0-9]{64}/);
                if (match) {
                    coinId = match[0];
                    break;
                }
            }
        }
        
        if (!coinId) {
            throw new Error('No SUI coin found for payment');
        }
        console.log(`💰 Using coin: ${coinId}`);
        
        // Mint gun with payment
        const mintOutput = execSync(`sui client call --package ${deployment.packageId} --module game --function mint_gun --args ${coinId} --gas-budget 20000000`, {
            encoding: 'utf8'
        });
        
        console.log('✅ Gun minted successfully!');
        
        // Extract transaction digest
        const txMatch = mintOutput.match(/Transaction Digest: ([a-zA-Z0-9]+)/);
        if (txMatch) {
            const txDigest = txMatch[1];
            console.log(`📋 Transaction: ${txDigest}`);
            console.log(`🔗 Explorer: https://suiexplorer.com/txblock/${txDigest}?network=testnet`);
        }
        
        // Check for gun object creation
        const gunMatch = mintOutput.match(/ObjectType: 0x[a-fA-F0-9]+::game::Gun/);
        if (gunMatch) {
            console.log('🎯 Gun NFT created successfully!');
        }
        
        // Check for GunMinted event
        if (mintOutput.includes('GunMinted')) {
            console.log('📊 GunMinted event emitted!');
        }
        
    } catch (error) {
        console.error('❌ Gun minting failed:', error.message);
    }
}

testGunMinting();