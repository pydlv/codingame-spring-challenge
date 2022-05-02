import {Owner, PlayerInfo} from "./index";
import {Base, Hero, Monster} from "./entities";

export class Game {
    baseByPlayer = new Map<Owner, Base>();
    numHeroesPerPlayer: number = 3;
    heroesById = new Map<number, Hero>();
    monstersById = new Map<number, Monster>();

    playerInfos = new Map<Owner, PlayerInfo>();

    constructor() {
        // Initialize player infos
        for (const player of [Owner.Me, Owner.Opponent]) {
            this.playerInfos.set(player, {
                health: 3,
                mana: 100
            })
        }
    }

    read_init() {
        // Read base coordinates
        const ourCoords = readline().split(" ").map(Number);
        const ourBase = new Base(Owner.Me, ourCoords[0], ourCoords[1]);

        this.baseByPlayer.set(Owner.Me, ourBase);

        this.numHeroesPerPlayer = parseInt(readline());
    }

    read_turn() {
        const healths = readline().split(" ").map(Number);
        const manas = readline().split(" ").map(Number);

        // Update player infos
        for (const [i, player] of [Owner.Me, Owner.Opponent].entries()) {
            const playerInfo = this.playerInfos.get(player)!;
            playerInfo.health = healths[i];
            playerInfo.mana = manas[i];
        }

        this.baseByPlayer.get(Owner.Me);

        // Important to clear entities because it doesn't tell us when one dies
        this.heroesById = new Map();
        this.monstersById = new Map();

        const numEntities = parseInt(readline());

        for (let i = 0; i < numEntities; i++) {
            const values = readline().split(" ").map(Number);

            const entityId = values[0];
            const entityType = values[1];
            const x = values[2];
            const y = values[3];
            const shieldLife = values[4];
            const isControlled = values[5];
            const health = values[6];
            const vx = values[7];
            const vy = values[8];
            const nearBase = Boolean(values[9]);
            const threatFor: Owner | null = values[10] === 0 ? null : (
                values[10] === 1 ? Owner.Me : Owner.Opponent
            );

            if (entityType === 0) {
                // Monster
                let entity = this.monstersById.get(entityId);
                if (entity === undefined) {
                    entity = new Monster(entityId);
                    this.monstersById.set(entityId, entity);
                }

                entity.update(x, y, shieldLife, isControlled, health,
                    vx, vy, nearBase, threatFor);
            } else {
                let entity = this.heroesById.get(entityId);
                if (entity === undefined) {
                    entity = new Hero(entityId, entityType === 1 ? Owner.Me : Owner.Opponent);
                    this.heroesById.set(entityId, entity);
                }

                entity.updateEntity(x, y, shieldLife, isControlled);
            }
        }
    }
}