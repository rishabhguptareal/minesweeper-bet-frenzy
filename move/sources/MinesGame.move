
module mines_game::mines {
    use std::error;
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use aptos_framework::account;
    use aptos_framework::aptos_coin::AptosCoin;

    // Error codes
    const EINVALID_BET: u64 = 1;
    const EGAME_NOT_ACTIVE: u64 = 2;
    const EINVALID_TILE: u64 = 3;
    const EGAME_OVER: u64 = 4;

    struct Game has key {
        active_games: Table<address, GameState>,
    }

    struct GameState has store {
        bet_amount: u64,
        multiplier: u64,
        mine_position: u8,
        revealed_tiles: vector<u8>,
        is_active: bool,
    }

    public fun init_module(account: &signer) {
        move_to(account, Game {
            active_games: table::new(),
        });
    }

    public entry fun place_bet(account: &signer, bet_amount: u64) acquires Game {
        let account_addr = signer::address_of(account);
        let game = borrow_global_mut<Game>(@mines_game);
        
        assert!(bet_amount > 0, error::invalid_argument(EINVALID_BET));
        
        // Transfer bet amount to module account
        coin::transfer<AptosCoin>(account, @mines_game, bet_amount);
        
        // Generate random mine position (0-8)
        let mine_position = ((timestamp::now_microseconds() % 9) as u8);
        
        let new_game = GameState {
            bet_amount,
            multiplier: 100, // 1.00x
            mine_position,
            revealed_tiles: vector::empty(),
            is_active: true,
        };
        
        table::upsert(&mut game.active_games, account_addr, new_game);
    }

    public entry fun reveal_tile(account: &signer, tile_position: u8) acquires Game {
        let account_addr = signer::address_of(account);
        let game = borrow_global_mut<Game>(@mines_game);
        let game_state = table::borrow_mut(&mut game.active_games, account_addr);
        
        assert!(game_state.is_active, error::invalid_state(EGAME_NOT_ACTIVE));
        assert!(tile_position < 9, error::invalid_argument(EINVALID_TILE));
        
        vector::push_back(&mut game_state.revealed_tiles, tile_position);
        
        if (tile_position == game_state.mine_position) {
            // Game over - player loses
            game_state.is_active = false;
        } else {
            // Update multiplier (increases by 0.5x for each safe tile)
            game_state.multiplier = game_state.multiplier + 50;
            
            // Check for win condition (4 safe tiles revealed)
            if (vector::length(&game_state.revealed_tiles) == 4) {
                // Player wins
                let winnings = (game_state.bet_amount * game_state.multiplier) / 100;
                coin::transfer<AptosCoin>(@mines_game, account_addr, winnings);
                game_state.is_active = false;
            }
        }
    }

    public entry fun cash_out(account: &signer) acquires Game {
        let account_addr = signer::address_of(account);
        let game = borrow_global_mut<Game>(@mines_game);
        let game_state = table::borrow_mut(&mut game.active_games, account_addr);
        
        assert!(game_state.is_active, error::invalid_state(EGAME_NOT_ACTIVE));
        
        let winnings = (game_state.bet_amount * game_state.multiplier) / 100;
        coin::transfer<AptosCoin>(@mines_game, account_addr, winnings);
        game_state.is_active = false;
    }
}
