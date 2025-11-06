module tank_battle::game_state {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::clock::Clock;

    public struct GameState has key {
        id: UID,
        active_battles: Table<address, address>, // battle_id -> oracle_address
        player_stats: Table<address, PlayerStats>,
        total_battles: u64,
        total_players: u64,
    }

    public struct PlayerStats has store {
        wins: u64,
        losses: u64,
        total_damage: u64,
        rank_points: u64,
        last_battle: u64,
    }

    public struct MatchmakingPool has key {
        id: UID,
        waiting_players: Table<address, u64>, // player -> rank_points
        pool_size: u64,
    }

    public fun init_game_state(ctx: &mut TxContext) {
        let game_state = GameState {
            id: object::new(ctx),
            active_battles: table::new(ctx),
            player_stats: table::new(ctx),
            total_battles: 0,
            total_players: 0,
        };
        transfer::share_object(game_state);

        let matchmaking = MatchmakingPool {
            id: object::new(ctx),
            waiting_players: table::new(ctx),
            pool_size: 0,
        };
        transfer::share_object(matchmaking);
    }

    public fun join_matchmaking(
        pool: &mut MatchmakingPool,
        game_state: &GameState,
        ctx: &TxContext
    ) {
        let player = tx_context::sender(ctx);
        let rank_points = if (table::contains(&game_state.player_stats, player)) {
            table::borrow(&game_state.player_stats, player).rank_points
        } else { 1000 };

        table::add(&mut pool.waiting_players, player, rank_points);
        pool.pool_size = pool.pool_size + 1;
    }

    public fun update_player_stats(
        game_state: &mut GameState,
        player: address,
        won: bool,
        damage: u64,
        clock: &Clock,
    ) {
        if (!table::contains(&game_state.player_stats, player)) {
            table::add(&mut game_state.player_stats, player, PlayerStats {
                wins: 0,
                losses: 0,
                total_damage: 0,
                rank_points: 1000,
                last_battle: 0,
            });
            game_state.total_players = game_state.total_players + 1;
        };

        let stats = table::borrow_mut(&mut game_state.player_stats, player);
        if (won) {
            stats.wins = stats.wins + 1;
            stats.rank_points = stats.rank_points + 25;
        } else {
            stats.losses = stats.losses + 1;
            if (stats.rank_points > 25) {
                stats.rank_points = stats.rank_points - 25;
            };
        };
        stats.total_damage = stats.total_damage + damage;
        stats.last_battle = sui::clock::timestamp_ms(clock);
    }
}