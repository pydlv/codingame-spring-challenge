import {Agent} from "./agent";
import {Game} from "./game";

export enum Owner {
    Me = 1,
    Opponent = 1 << 1,
    All = Me & Opponent
}

export interface PlayerInfo {
    health: number;
    mana: number;
}

const game = new Game();
game.read_init();

const agent = new Agent(game, Owner.Me);

while (true) {
    game.read_turn();

    agent.act();
}