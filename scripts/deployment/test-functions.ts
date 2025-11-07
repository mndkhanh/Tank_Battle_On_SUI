import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { decodeSuiPrivateKey } from '@mysten/sui.js/cryptography'

import * as fs from 'fs'
import * as path from 'path'

interface DeploymentInfo {
    network: string
    packageId: string
    deployer: string
    timestamp: string
    transactionDigest: string
    explorerUrl: string
}

async function testContractFunctions() {
    console.log('🧪 Testing Tank Battle contract functions...')
    
    // Load deployment info
    const deploymentPath = path.join(__dirname, 'deployment.json')
    if (!fs.existsSync(deploymentPath)) {
        throw new Error('❌ deployment.json not found. Run deployment first.')
    }
    
    const deployment: DeploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'))
    console.log(`📦 Using package: ${deployment.packageId}`)
    
    // Setup client
    const client = new SuiClient({ url: getFullnodeUrl(deployment.network as any) })
    const { secretKey } = decodeSuiPrivateKey(process.env.SUI_PRIVATE_KEY!);
    const keypair = Ed25519Keypair.fromSecretKey(secretKey);
    const address = keypair.getPublicKey().toSuiAddress()
    
    console.log(`👤 Tester address: ${address}`)
    
    // Test 1: Mint Tank (Free)
    console.log('\n🎯 Test 1: Minting Tank NFT (Free)')
    try {
        const txb1 = new TransactionBlock()
        txb1.moveCall({
            target: `${deployment.packageId}::game::mint_tank`
        })
        
        const result1 = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: txb1,
            options: { showEffects: true, showEvents: true }
        })
        
        console.log(`✅ Tank minted! TX: ${result1.digest}`)
        console.log(`🔗 Explorer: https://suiexplorer.com/txblock/${result1.digest}?network=${deployment.network}`)
        
        // Find tank object
        const tankObject = result1.effects?.created?.find(obj => 
            obj.owner && typeof obj.owner === 'object' && 'AddressOwner' in obj.owner
        )
        
        if (tankObject) {
            console.log(`🚗 Tank Object ID: ${tankObject.reference.objectId}`)
        }
        
    } catch (error) {
        console.error('❌ Tank minting failed:', error)
    }
    
    // Test 2: Mint Gun (0.1 SUI)
    console.log('\n🎯 Test 2: Minting Gun NFT (0.1 SUI)')
    try {
        const txb2 = new TransactionBlock()
        
        // Split coin for payment
        const [coin] = txb2.splitCoins(txb2.gas, [100_000_000]) // 0.1 SUI
        
        txb2.moveCall({
            target: `${deployment.packageId}::game::mint_gun`,
            arguments: [coin]
        })
        
        const result2 = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: txb2,
            options: { showEffects: true, showEvents: true }
        })
        
        console.log(`✅ Gun minted! TX: ${result2.digest}`)
        console.log(`🔗 Explorer: https://suiexplorer.com/txblock/${result2.digest}?network=${deployment.network}`)
        
        // Find gun object
        const gunObject = result2.effects?.created?.find(obj => 
            obj.owner && typeof obj.owner === 'object' && 'AddressOwner' in obj.owner
        )
        
        if (gunObject) {
            console.log(`🔫 Gun Object ID: ${gunObject.reference.objectId}`)
        }
        
    } catch (error) {
        console.error('❌ Gun minting failed:', error)
    }
    
    // Test 3: Check Events
    console.log('\n🎯 Test 3: Checking Events')
    try {
        const events = await client.queryEvents({
            query: { MoveModule: { package: deployment.packageId, module: 'game' } },
            limit: 10,
            order: 'descending'
        })
        
        console.log(`📊 Found ${events.data.length} events:`)
        events.data.forEach((event, index) => {
            console.log(`  ${index + 1}. ${event.type} - TX: ${event.id.txDigest}`)
        })
        
    } catch (error) {
        console.error('❌ Event query failed:', error)
    }
    
    // Test 4: Get Objects owned by address
    console.log('\n🎯 Test 4: Checking Owned Objects')
    try {
        const objects = await client.getOwnedObjects({
            owner: address,
            filter: { StructType: `${deployment.packageId}::game::Tank` }
        })
        
        console.log(`🚗 Tanks owned: ${objects.data.length}`)
        
        const guns = await client.getOwnedObjects({
            owner: address,
            filter: { StructType: `${deployment.packageId}::game::Gun` }
        })
        
        console.log(`🔫 Guns owned: ${guns.data.length}`)
        
    } catch (error) {
        console.error('❌ Object query failed:', error)
    }
    
    console.log('\n✅ Testing completed!')
}

// Run tests
if (require.main === module) {
    testContractFunctions()
        .catch((error) => {
            console.error('❌ Testing failed:', error.message)
            process.exit(1)
        })
}

export { testContractFunctions }