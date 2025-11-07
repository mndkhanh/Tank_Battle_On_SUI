module tank_battle::market {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::coin::{Self, Coin};
    use sui::event;
    use sui::sui::SUI;
    use tank_battle::game::{Tank, Gun};

    public struct Marketplace has key {
        id: UID,
        tank_listings: Table<address, TankListing>,
        gun_listings: Table<address, GunListing>,
    }

    public struct TankListing has store, drop {
        seller: address,
        price: u64,
    }

    public struct GunListing has store, drop {
        seller: address,
        price: u64,
        rarity: u8,
    }

    public struct TankListed has copy, drop {
        tank_id: address,
        seller: address,
        price: u64,
    }

    public struct GunListed has copy, drop {
        gun_id: address,
        seller: address,
        price: u64,
        rarity: u8,
    }

    fun init(ctx: &mut TxContext) {
        let marketplace = Marketplace {
            id: object::new(ctx),
            tank_listings: table::new(ctx),
            gun_listings: table::new(ctx),
        };
        transfer::share_object(marketplace);
    }

    // List Tank for sale
    public fun list_tank(
        marketplace: &mut Marketplace,
        tank: Tank,
        price: u64,
        ctx: &mut TxContext
    ) {
        let seller = tx_context::sender(ctx);
        let tank_id = object::id_to_address(&object::id(&tank));

        let listing = TankListing {
            seller,
            price,
        };

        table::add(&mut marketplace.tank_listings, tank_id, listing);
        transfer::public_transfer(tank, @tank_battle);

        event::emit(TankListed { tank_id, seller, price });
    }

    // List Gun for sale
    public fun list_gun(
        marketplace: &mut Marketplace,
        gun: Gun,
        price: u64,
        ctx: &mut TxContext
    ) {
        let seller = tx_context::sender(ctx);
        let gun_id = object::id_to_address(&object::id(&gun));
        let (_, _, _, rarity) = tank_battle::game::get_gun_stats(&gun);

        let listing = GunListing {
            seller,
            price,
            rarity,
        };

        table::add(&mut marketplace.gun_listings, gun_id, listing);
        transfer::public_transfer(gun, @tank_battle);

        event::emit(GunListed { gun_id, seller, price, rarity });
    }

    // Buy Tank
    public fun buy_tank(
        marketplace: &mut Marketplace,
        tank_id: address,
        mut payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&marketplace.tank_listings, tank_id), 0);

        let listing = table::remove(&mut marketplace.tank_listings, tank_id);
        assert!(coin::value(&payment) >= listing.price, 1);

        // 5% marketplace fee
        let fee = (listing.price * 5) / 100;
        let fee_coin = coin::split(&mut payment, fee, ctx);
        transfer::public_transfer(fee_coin, @tank_battle);
        transfer::public_transfer(payment, listing.seller);
    }

    // Buy Gun
    public fun buy_gun(
        marketplace: &mut Marketplace,
        gun_id: address,
        mut payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&marketplace.gun_listings, gun_id), 0);

        let listing = table::remove(&mut marketplace.gun_listings, gun_id);
        assert!(coin::value(&payment) >= listing.price, 1);

        // 5% marketplace fee
        let fee = (listing.price * 5) / 100;
        let fee_coin = coin::split(&mut payment, fee, ctx);
        transfer::public_transfer(fee_coin, @tank_battle);
        transfer::public_transfer(payment, listing.seller);
    }
}