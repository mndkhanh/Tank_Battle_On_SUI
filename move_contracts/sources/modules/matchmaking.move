module tank_battle::matchmaking {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::coin::{Self, Coin};
    use sui::event;
    use tank_battle::token::TANK_TOKEN;
    use tank_battle::battle;

    public struct MatchmakingPool has key {
        id: UID,
        waiting_players: Table<address, PlayerEntry>,
        pool_size: u64,
        entry_fee: u64,
    }

    public struct PlayerEntry has store {
        player: address,
        tank_id: address,
        rank_points: u64,
        entry_fee: Coin<TANK_TOKEN>,
        join_time: u64,
    }

    public struct MatchFound has copy, drop {
        battle_id: address,
        player1: address,
        player2: address,
        entry_fee: u64,
    }

    public fun create_pool(
        entry_fee: u64,
        ctx: &mut TxContext
    ) {
        let pool = MatchmakingPool {
            id: object::new(ctx),
            waiting_players: table::new(ctx),
            pool_size: 0,
            entry_fee,
        };
        transfer::share_object(pool);
    }

    public fun join_matchmaking(
        pool: &mut MatchmakingPool,
        tank_id: address,
        rank_points: u64,
        entry_fee: Coin<TANK_TOKEN>,
        clock: &sui::clock::Clock,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        
        // Validate entry fee
        assert!(coin::value(&entry_fee) == pool.entry_fee, 0);
        
        // Check if player already in pool
        assert!(!table::contains(&pool.waiting_players, player), 1);

        let entry = PlayerEntry {
            player,
            tank_id,
            rank_points,
            entry_fee,
            join_time: sui::clock::timestamp_ms(clock),
        };

        table::add(&mut pool.waiting_players, player, entry);
        pool.pool_size = pool.pool_size + 1;

        // Try to find match
        try_create_match(pool, player, ctx);
    }

    fun try_create_match(
        pool: &mut MatchmakingPool,
        new_player: address,
        ctx: &mut TxContext
    ) {
        if (pool.pool_size < 2) return;

        let new_entry = table::borrow(&pool.waiting_players, new_player);
        let new_rank = new_entry.rank_points;

        // Find suitable opponent (within 100 rank points)
        let players = table::keys(&pool.waiting_players);
        let i = 0;
        while (i < vector::length(&players)) {
            let opponent = *vector::borrow(&players, i);
            if (opponent != new_player) {
                let opponent_entry = table::borrow(&pool.waiting_players, opponent);
                let rank_diff = if (new_rank > opponent_entry.rank_points) {
                    new_rank - opponent_entry.rank_points
                } else {
                    opponent_entry.rank_points - new_rank
                };

                if (rank_diff <= 100) {
                    // Create battle
                    create_battle_from_match(pool, new_player, opponent, ctx);
                    return
                };
            };
            i = i + 1;
        };
    }

    fun create_battle_from_match(
        pool: &mut MatchmakingPool,
        player1: address,
        player2: address,
        ctx: &mut TxContext
    ) {
        let entry1 = table::remove(&mut pool.waiting_players, player1);
        let entry2 = table::remove(&mut pool.waiting_players, player2);
        
        pool.pool_size = pool.pool_size - 2;

        // Create battle with entry fees
        battle::create_battle(
            player1,
            player2,
            entry1.tank_id,
            entry2.tank_id,
            entry1.entry_fee,
            entry2.entry_fee,
            &sui::clock::Clock { id: sui::object::new(ctx) }, // Placeholder
            ctx
        );

        event::emit(MatchFound {
            battle_id: @0x0, // Will be filled by battle creation
            player1,
            player2,
            entry_fee: pool.entry_fee,
        });
    }

    public fun leave_matchmaking(
        pool: &mut MatchmakingPool,
        ctx: &TxContext
    ) {
        let player = tx_context::sender(ctx);
        assert!(table::contains(&pool.waiting_players, player), 2);

        let entry = table::remove(&mut pool.waiting_players, player);
        pool.pool_size = pool.pool_size - 1;

        // Return entry fee
        transfer::public_transfer(entry.entry_fee, player);
    }
}