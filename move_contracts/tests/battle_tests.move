#[test_only]
module tank_battle::battle_tests {
    use sui::test_scenario::{Self, Scenario};
    use sui::coin::{Self, Coin};
    use sui::clock;
    use tank_battle::battle::{Self, Battle, OracleCap};
    use tank_battle::token::{Self, TANK_TOKEN};

    #[test]
    fun test_create_battle() {
        let admin = @0xAD;
        let player1 = @0x1;
        let player2 = @0x2;
        
        let mut scenario = test_scenario::begin(admin);
        
        // Initialize modules
        {
            let ctx = test_scenario::ctx(&mut scenario);
            battle::init_for_testing(ctx);
            token::init_for_testing(token::TANK_TOKEN {}, ctx);
        };
        
        test_scenario::next_tx(&mut scenario, admin);
        
        // Create battle
        {
            let oracle_cap = test_scenario::take_from_sender<OracleCap>(&scenario);
            let treasury_cap = test_scenario::take_from_sender<coin::TreasuryCap<TANK_TOKEN>>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            // Mint entry fees
            let entry_fee1 = coin::mint(&mut treasury_cap, 100, test_scenario::ctx(&mut scenario));
            let entry_fee2 = coin::mint(&mut treasury_cap, 100, test_scenario::ctx(&mut scenario));
            
            battle::create_battle(
                player1,
                player2,
                @0x123, // tank1_id
                @0x456, // tank2_id
                entry_fee1,
                entry_fee2,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_to_sender(&scenario, oracle_cap);
            test_scenario::return_to_sender(&scenario, treasury_cap);
            clock::destroy_for_testing(clock);
        };
        
        test_scenario::next_tx(&mut scenario, admin);
        
        // Finish battle
        {
            let mut battle = test_scenario::take_shared<Battle>(&scenario);
            let oracle_cap = test_scenario::take_from_sender<OracleCap>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            battle::finish_battle(
                &mut battle,
                &oracle_cap,
                player1, // winner
                500, // total_damage
                60000, // battle_duration (1 minute)
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(battle);
            test_scenario::return_to_sender(&scenario, oracle_cap);
            clock::destroy_for_testing(clock);
        };
        
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 3)]
    fun test_invalid_winner() {
        let admin = @0xAD;
        let player1 = @0x1;
        let player2 = @0x2;
        let invalid_winner = @0x999;
        
        let mut scenario = test_scenario::begin(admin);
        
        // Setup battle (similar to above)
        // ... setup code ...
        
        // Try to finish with invalid winner
        {
            let mut battle = test_scenario::take_shared<Battle>(&scenario);
            let oracle_cap = test_scenario::take_from_sender<OracleCap>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            battle::finish_battle(
                &mut battle,
                &oracle_cap,
                invalid_winner, // Should fail
                500,
                60000,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            test_scenario::return_shared(battle);
            test_scenario::return_to_sender(&scenario, oracle_cap);
            clock::destroy_for_testing(clock);
        };
        
        test_scenario::end(scenario);
    }
}