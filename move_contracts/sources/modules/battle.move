module tank_battle::battle {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::clock::{Self, Clock};
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use tank_battle::token::TANK_TOKEN;

    public struct OracleCap has key, store {
        id: UID,
    }

    public struct Battle has key {
        id: UID,
        player1: address,
        player2: address,
        tank1_id: address,
        tank2_id: address,
        winner: option::Option<address>,
        start_time: u64,
        end_time: option::Option<u64>,
        status: u8, // 0: waiting, 1: active, 2: finished
        prize_pool: Balance<TANK_TOKEN>,
    }

    public struct BattleResult has copy, drop {
        battle_id: address,
        winner: address,
        loser: address,
        damage_dealt: u64,
        battle_duration: u64,
    }

    public struct RewardDistributed has copy, drop {
        battle_id: address,
        winner: address,
        reward_amount: u64,
        house_fee: u64,
    }

    fun init(ctx: &mut TxContext) {
        transfer::transfer(OracleCap {
            id: object::new(ctx)
        }, tx_context::sender(ctx));
    }

    public fun create_battle(
        player1: address,
        player2: address,
        tank1_id: address,
        tank2_id: address,
        entry_fee1: Coin<TANK_TOKEN>,
        entry_fee2: Coin<TANK_TOKEN>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let total_prize = coin::value(&entry_fee1) + coin::value(&entry_fee2);
        
        let battle = Battle {
            id: object::new(ctx),
            player1,
            player2,
            tank1_id,
            tank2_id,
            winner: option::none(),
            start_time: clock::timestamp_ms(clock),
            end_time: option::none(),
            status: 1,
            prize_pool: balance::zero(),
        };
        
        balance::join(&mut battle.prize_pool, coin::into_balance(entry_fee1));
        balance::join(&mut battle.prize_pool, coin::into_balance(entry_fee2));
        
        transfer::share_object(battle);
    }

    // ❌ REMOVED: submit_action() - Real-time actions handled off-chain
    // ✅ REPLACED: Oracle WebSocket communication + finish_battle()

    public fun finish_battle(
        battle: &mut Battle,
        _oracle_cap: &OracleCap,
        winner: address,
        total_damage: u64,
        battle_duration: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(battle.status == 1, 2);
        assert!(winner == battle.player1 || winner == battle.player2, 3);
        assert!(total_damage <= 1000, 4); // Max damage validation

        battle.winner = option::some(winner);
        battle.end_time = option::some(clock::timestamp_ms(clock));
        battle.status = 2;

        let loser = if (winner == battle.player1) { battle.player2 } else { battle.player1 };
        
        // Distribute rewards: 90% to winner, 10% house fee
        let total_prize = balance::value(&battle.prize_pool);
        let winner_reward = (total_prize * 90) / 100;
        let house_fee = total_prize - winner_reward;
        
        let winner_coin = coin::take(&mut battle.prize_pool, winner_reward, ctx);
        transfer::public_transfer(winner_coin, winner);
        
        // House fee stays in contract for now
        
        event::emit(BattleResult {
            battle_id: object::uid_to_address(&battle.id),
            winner,
            loser,
            damage_dealt: total_damage,
            battle_duration,
        });
        
        event::emit(RewardDistributed {
            battle_id: object::uid_to_address(&battle.id),
            winner,
            reward_amount: winner_reward,
            house_fee,
        });
    }
}