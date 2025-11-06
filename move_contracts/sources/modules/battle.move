module tank_battle::battle {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::clock::{Self, Clock};
    use sui::event;
    use tank_battle::game::Tank;

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
        prize_pool: u64,
    }

    public struct BattleResult has copy, drop {
        battle_id: address,
        winner: address,
        loser: address,
        damage_dealt: u64,
        battle_duration: u64,
    }

    public struct BattleAction has copy, drop {
        battle_id: address,
        player: address,
        action_type: u8, // 0: move, 1: shoot, 2: special
        position_x: u64,
        position_y: u64,
        target_x: u64,
        target_y: u64,
        timestamp: u64,
    }

    public fun create_battle(
        player1: address,
        player2: address,
        tank1_id: address,
        tank2_id: address,
        prize_pool: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
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
            prize_pool,
        };
        transfer::share_object(battle);
    }

    public fun submit_action(
        battle: &Battle,
        action_type: u8,
        position_x: u64,
        position_y: u64,
        target_x: u64,
        target_y: u64,
        clock: &Clock,
        ctx: &TxContext
    ) {
        let player = tx_context::sender(ctx);
        assert!(player == battle.player1 || player == battle.player2, 0);
        assert!(battle.status == 1, 1);

        event::emit(BattleAction {
            battle_id: object::uid_to_address(&battle.id),
            player,
            action_type,
            position_x,
            position_y,
            target_x,
            target_y,
            timestamp: clock::timestamp_ms(clock),
        });
    }

    public fun finish_battle(
        battle: &mut Battle,
        winner: address,
        damage_dealt: u64,
        clock: &Clock,
    ) {
        assert!(battle.status == 1, 2);
        assert!(winner == battle.player1 || winner == battle.player2, 3);

        battle.winner = option::some(winner);
        battle.end_time = option::some(clock::timestamp_ms(clock));
        battle.status = 2;

        let loser = if (winner == battle.player1) { battle.player2 } else { battle.player1 };
        let duration = clock::timestamp_ms(clock) - battle.start_time;

        event::emit(BattleResult {
            battle_id: object::uid_to_address(&battle.id),
            winner,
            loser,
            damage_dealt,
            battle_duration: duration,
        });
    }
}