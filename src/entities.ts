import {Owner} from "./index";

interface HasCoordinates {
    x: number;
    y: number;
}

export function computeDistance(a: HasCoordinates, b: HasCoordinates) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export abstract class Entity {
    id: number;
    x: number = 0;
    y: number = 0;
    shieldLife = 0;
    isControlled = 0;

    constructor(id: number) {
        this.id = id;
    }

    updateEntity(x: number, y: number, shieldLife: number, isControlled: number) {
        this.setPosition(x, y);
        this.shieldLife = shieldLife;
        this.isControlled = isControlled;
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Hero extends Entity {
    owner: Owner;

    constructor(id: number, owner: Owner) {
        super(id);
        this.owner = owner;
    }
}

export class Monster extends Entity {
    health: number = 100;
    vx: number = 0;
    vy: number = 0;
    nearBase = false;
    threatFor: Owner | null = null;

    update(x: number, y: number, shieldLife: number, isControlled: number,
           health: number, vx: number, vy: number, nearBase: boolean, threatFor: Owner | null) {
        super.updateEntity(x, y, shieldLife, isControlled);

        this.health = health;
        this.vx = vx;
        this.vy = vy;
        this.nearBase = nearBase;
        this.threatFor = threatFor;
    }
}

export class Base {
    owner: Owner;
    x: number;
    y: number;

    constructor(owner: Owner, x: number, y: number) {
        this.owner = owner;
        this.x = x;
        this.y = y;
    }

}