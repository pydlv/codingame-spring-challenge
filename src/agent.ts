import {Game} from "./game";
import {Owner} from "./index";
import {computeDistance} from "./entities";

export class Agent {
    game: Game;
    player: Owner;

    constructor(game: Game, player: Owner) {
        this.game = game;
        this.player = player;
    }

    act() {
        // Move each hero to the closest bug.
        const ourHeroes = Array.from(this.game.heroesById.values()).filter(hero => hero.owner & Owner.Me);

        const ourBase = this.game.baseByPlayer.get(Owner.Me)!;

        for (const hero of ourHeroes) {
            const bugs = Array.from(this.game.monstersById.values());
            const threats = bugs.filter(bug => bug.threatFor === Owner.Me);

            if (threats.length) {
                threats.sort((a, b) => computeDistance(a, ourBase) - computeDistance(b, ourBase))

                const threat = threats[0];

                console.log(`MOVE ${threat.x} ${threat.y}`);
            } else {
                console.log("WAIT");
            }
        }
    }
}