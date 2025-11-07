module tank_battle::game {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::event;
    use sui::sui::SUI;
    use std::option::{Self, Option};

    // Tank NFT
    public struct Tank has key, store {
        id: UID,
        owner: address,
        health: u64,
        armor: u64,
        speed: u64,
        gun_id: Option<address>,
    }

    // Gun NFT  
    public struct Gun has key, store {
        id: UID,
        owner: address,
        damage: u64,
        fire_rate: u64,
        range: u64,
        rarity: u8,
    }

    // Events
    public struct TankMinted has copy, drop {
        tank_id: address,
        owner: address,
    }

    public struct GunMinted has copy, drop {
        gun_id: address,
        owner: address,
        rarity: u8,
    }

    // Mint Tank NFT (free)
    public fun mint_tank(ctx: &mut TxContext) {
        let tank = Tank {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            health: 100,
            armor: 50,
            speed: 75,
            gun_id: option::none(),
        };

        let tank_id = object::id_to_address(&object::id(&tank));
        
        event::emit(TankMinted {
            tank_id,
            owner: tx_context::sender(ctx),
        });

        transfer::transfer(tank, tx_context::sender(ctx));
    }

    // Mint Gun NFT (gacha) - costs 0.1 SUI
    public fun mint_gun(
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(coin::value(&payment) >= 100_000_000, 0); // 0.1 SUI in MIST
        
        // Burn payment
        transfer::public_transfer(payment, @0x0);

        // Random rarity
        let rarity = ((tx_context::epoch(ctx) % 100) / 25) + 1;
        
        let (damage, fire_rate, range) = if (rarity == 4) {
            (100, 10, 1000)
        } else if (rarity == 3) {
            (80, 8, 800)
        } else if (rarity == 2) {
            (60, 6, 600)
        } else {
            (40, 4, 400)
        };

        let gun = Gun {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            damage,
            fire_rate,
            range,
            rarity: (rarity as u8),
        };

        let gun_id = object::id_to_address(&object::id(&gun));
        
        event::emit(GunMinted {
            gun_id,
            owner: tx_context::sender(ctx),
            rarity: (rarity as u8),
        });

        transfer::transfer(gun, tx_context::sender(ctx));
    }

    // Getters
    public fun get_tank_stats(tank: &Tank): (u64, u64, u64, Option<address>) {
        (tank.health, tank.armor, tank.speed, tank.gun_id)
    }

    public fun get_gun_stats(gun: &Gun): (u64, u64, u64, u8) {
        (gun.damage, gun.fire_rate, gun.range, gun.rarity)
    }
}