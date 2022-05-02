import {Game} from "./game";
import {Owner} from "./index";
import {computeDistance, Monster} from "./entities";

interface Point {
    x: number,
    y: number
}

export class Agent {
    game: Game;
    player: Owner;
    offensiveMonsterIds = new Set<number>();

    constructor(game: Game, player: Owner) {
        this.game = game;
        this.player = player;
    }

    act() {
        const ourBase = this.game.baseByPlayer.get(Owner.Me)!;
        const otherBase = this.game.baseByPlayer.get(Owner.Opponent)!;
        const yDelta = otherBase.y - ourBase.y;
        const xDelta = (otherBase.x - ourBase.x) / 2;
        let centerAngle = Math.atan(yDelta/xDelta);

        if (xDelta < 0) {
            centerAngle += Math.PI;
        }

        // Move each hero to the closest bug.
        const ourHeroes = Array.from(this.game.heroesById.values()).filter(hero => hero.owner & Owner.Me);
        const opponentHeroes = Array.from(this.game.heroesById.values()).filter(hero => hero.owner & Owner.Opponent);

        const offensiveMonsterIds = new Set<number>();

        const myInfo = this.game.playerInfos.get(Owner.Me)!;


        for (const [i, hero] of ourHeroes.entries()) {
            // Control opponent's heroes if possible
            if (myInfo.mana >= 10) {
                let castedSpell = false;
                for (const enemyHero of opponentHeroes) {
                    const enemyDistance = computeDistance(hero, enemyHero);
                    if (enemyDistance <= 1280 && enemyHero.shieldLife === 0) {
                        console.log(`SPELL WIND ${hero.id} ${otherBase.x} ${otherBase.y}`);
                        myInfo.mana -= 10;
                        castedSpell = true;
                        break;
                    }

                    if (computeDistance(hero, enemyHero) <= 2200) {
                        if (i === 0 && hero.shieldLife === 0) {
                            console.log(`SPELL SHIELD ${hero.id}`);
                            myInfo.mana -= 10;
                            castedSpell = true;
                            break;
                        }

                        // if (myInfo.mana >= 10 && enemyHero.shieldLife === 0) {
                        //     console.log(`SPELL CONTROL ${enemyHero.id} ${otherBase.x} ${otherBase.y}`);
                        //     myInfo.mana -= 10;
                        //     castedSpell = true;
                        //     break;
                        // }
                    }
                }
                if (castedSpell) {
                    continue;
                }
            }

            let heroMaxDistance: number;

            const xd = 3438;
            if (i === 0) {
                heroMaxDistance = xd;
            } else if (i === 1) {
                heroMaxDistance = xd * 2;
            } else if (i === 2) {
                heroMaxDistance = xd * 2;
            } else {
                throw "Why don't we have 3 heroes?";
            }

            let ourAngle = centerAngle;
            if (i === 1) {
                ourAngle += Math.PI / 6;
            } else if (i === 2) {
                ourAngle -= Math.PI / 6;
            }

            const startPoint: Point = {
                x: Math.floor(ourBase.x + Math.cos(ourAngle) * heroMaxDistance),
                y: Math.floor(ourBase.y + Math.sin(ourAngle) * heroMaxDistance)
            }

            const maxTravelDistance = xd;
            const importantDistance = xd;

            const distanceByMonster = new Map<Monster, number>();
            for (const monster of this.game.monstersById.values()) {
                distanceByMonster.set(monster, computeDistance(monster, ourBase));
            }

            // Filter out any monsters that are further than this hero's max distance.
            let filteredMonsters = Array.from(this.game.monstersById.values());

            filteredMonsters = filteredMonsters.filter(bug => bug.threatFor === Owner.Me);
            filteredMonsters = filteredMonsters.filter(monster => distanceByMonster.get(monster)! <= heroMaxDistance + maxTravelDistance);
            filteredMonsters = filteredMonsters.filter(
                monster => distanceByMonster.get(monster)! <= importantDistance ||
                    computeDistance(monster, startPoint) <= maxTravelDistance
            )

            const threats = filteredMonsters;

            if (threats.length) {
                threats.sort((a, b) => computeDistance(a, ourBase) - computeDistance(b, ourBase))

                const threat = threats[0];

                if (myInfo.mana >= 10) {
                    // if (i === 0 && hero.shieldLife === 0) {
                    //     console.log(`SPELL SHIELD ${hero.id}`);
                    //     myInfo.mana -= 10;
                    //     continue;
                    // }

                    // Check if we want to wind
                    if (i === 0 && computeDistance(hero, threat) <= 1280 &&
                        (distanceByMonster.get(threat)! <= importantDistance ||
                        myInfo.mana >= 70
                        )
                    ) {
                        console.log(`SPELL WIND ${otherBase.x} ${otherBase.y}`);
                        myInfo.mana -= 10;
                        continue;
                    }

                    // if (i === 0 && threat.shieldLife === 0 &&
                    //     computeDistance(hero, threat) <= 2200 &&
                    //     myInfo.mana >= 70
                    // ) {
                    //     console.log(`SPELL CONTROL ${threat.id} ${otherBase.x} ${otherBase.y}`);
                    //     myInfo.mana -= 10;
                    //     offensiveMonsterIds.add(threat.id);
                    //     continue;
                    // }
                }

                console.log(`MOVE ${threat.x} ${threat.y}`);
            } else {
                // Move to starting position
                console.log(`MOVE ${startPoint.x} ${startPoint.y}`);
            }
        }
    }
}