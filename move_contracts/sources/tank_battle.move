module tank_battle::game {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    public struct Tank has key, store {
        id: UID,
        owner: address,
        health: u64,
        position_x: u64,
        position_y: u64,
        ammunition: u64,
    }

    public struct GameSession has key {
        id: UID,
        players: vector<address>,
        is_active: bool,
    }

    public fun create_tank(ctx: &mut TxContext): Tank {
        Tank {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            health: 100,
            position_x: 0,
            position_y: 0,
            ammunition: 10,
        }
    }

    // ❌ REMOVED: move_tank() - Real-time movement handled in Phaser.js
    // Tank position only matters for final stats after battle

    public fun mint_tank(ctx: &mut TxContext) {
        let tank = create_tank(ctx);
        transfer::transfer(tank, tx_context::sender(ctx));
    }
}