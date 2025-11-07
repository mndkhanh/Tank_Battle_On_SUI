module tank_battle::leaderboard {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::vec_map::{Self, VecMap};
    use sui::event;

    public struct Leaderboard has key {
        id: UID,
        top_players: VecMap<address, PlayerRank>,
        total_players: u64,
        season: u64,
    }

    public struct PlayerRank has store, copy, drop {
        player: address,
        wins: u64,
        losses: u64,
        total_damage: u64,
        rank_points: u64,
        last_battle: u64,
    }

    public struct RankUpdated has copy, drop {
        player: address,
        old_rank: u64,
        new_rank: u64,
        rank_points: u64,
    }

    fun init(ctx: &mut TxContext) {
        let leaderboard = Leaderboard {
            id: object::new(ctx),
            top_players: vec_map::empty(),
            total_players: 0,
            season: 1,
        };
        transfer::share_object(leaderboard);
    }

    public fun update_player_rank(
        leaderboard: &mut Leaderboard,
        _oracle_cap: &tank_battle::battle::OracleCap,
        player: address,
        won: bool,
        damage: u64,
        timestamp: u64,
    ) {
        let old_rank_points = if (vec_map::contains(&leaderboard.top_players, &player)) {
            vec_map::get(&leaderboard.top_players, &player).rank_points
        } else {
            1000 // Starting rank points
        };

        let new_rank_points = if (won) {
            old_rank_points + 25
        } else {
            if (old_rank_points > 25) old_rank_points - 25 else 0
        };

        let player_rank = PlayerRank {
            player,
            wins: if (won) 1 else 0,
            losses: if (!won) 1 else 0,
            total_damage: damage,
            rank_points: new_rank_points,
            last_battle: timestamp,
        };

        if (vec_map::contains(&leaderboard.top_players, &player)) {
            let existing = vec_map::get_mut(&mut leaderboard.top_players, &player);
            existing.wins = existing.wins + (if (won) 1 else 0);
            existing.losses = existing.losses + (if (!won) 1 else 0);
            existing.total_damage = existing.total_damage + damage;
            existing.rank_points = new_rank_points;
            existing.last_battle = timestamp;
        } else {
            vec_map::insert(&mut leaderboard.top_players, player, player_rank);
            leaderboard.total_players = leaderboard.total_players + 1;
        };

        event::emit(RankUpdated {
            player,
            old_rank: old_rank_points,
            new_rank: new_rank_points,
            rank_points: new_rank_points,
        });
    }

    public fun get_player_rank(
        leaderboard: &Leaderboard,
        player: address
    ): &PlayerRank {
        vec_map::get(&leaderboard.top_players, &player)
    }

    public fun get_top_players(
        leaderboard: &Leaderboard,
        limit: u64
    ): vector<PlayerRank> {
        let result = vector::empty<PlayerRank>();
        let (players, ranks) = vec_map::into_keys_values(leaderboard.top_players);
        
        // Simple implementation - in production would need proper sorting
        let i = 0;
        while (i < vector::length(&ranks) && i < limit) {
            vector::push_back(&mut result, *vector::borrow(&ranks, i));
            i = i + 1;
        };
        
        result
    }
}