// component utilities

export const CLAMP_ERROR = "Not a valid component value";
export const CLAMP_UPPER = 0xff;
export const CLAMP_LOWER = 0x00;

export enum KEYS {
    RED     = "r",
    GREEN   = "g",
    BLUE    = "b",
    ALPHA   = "a"
}

export enum BIT_OFFSETS {
    RED     = 24,
    GREEN   = 16,
    BLUE    = 8,
    ALPHA   = 0,
}

export enum BIT_MASKS {
    RED         = 0xff000000,
    GREEN       = 0x00ff0000,
    BLUE        = 0x0000ff00,
    ALPHA       = 0x000000ff,
}

export function isValidComponentValue(value: number) {
    return (typeof value === "number" && value >= CLAMP_LOWER && value <= CLAMP_UPPER);
}

export function validateComponent(value: number) {
    if(!isValidComponentValue(value)) {
        throw new Error(CLAMP_ERROR);
    }
}