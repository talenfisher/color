import { 
    KEYS, 
    BIT_OFFSETS, 
    BIT_MASKS, 
    CLAMP_UPPER, 
    validateComponent 
} from "./component";

import FunctionalParser from "./functional-parser";

const HEX_INVALID_ERROR = "Not a valid hexadecimal";
const HEX_VALID_LENGTHS = [ 3, 4, 6, 8 ];

export enum Precision {
    Color32   = 0, // rrrrrrrr-gggggggg-bbbbbbbb-aaaaaaaa
    Color24   = 2, // rrrrrr-gggggg-bbbbbb-aaaaaa
    Color16   = 4, // rrrr-gggg-bbbb-aaaa
    Color8    = 6, // rr-gg-bb-aa
}

const $value = Symbol("The color's 32 bit value");

class Color {
    private [$value] = 0;
    public r: number;
    public g: number;
    public b: number;
    public a: number;
    
    /**
     * Constructs a new color object
     * 
     * @param source the color string to parse
     */
    constructor(source?: string) { 
        if(typeof source === "undefined") {
            return;
        }

        switch(source[0]) {
            case "r": Color.parseFunctional(source, this); break;
            case "#": Color.parseHex(source, this); break;
        }
    }

    /**
     * Get the 32-bit integer value of the color
     */
    get value() {
        return this[$value];
    }

    /**
     * Set the 32-bit integer value of the color
     */
    set value(value: number) {
        this[$value] = value;
    }

    /**
     * Get the luminance value using ITU-R BT.709 luma coefficients
     */
    get l() {
        return Math.ceil((0.2126 * this.r) + (0.7152 * this.g) + (0.0722 * this.b));
    }

    /**
     * Get the hexadecimal representation of the color with the alpha channel included
     */
    get hex8() {
        return "#" + ("00000000" + this.value.toString(16)).slice(-8);
    }

    /**
     * Get the hexadecimal representation of the color without the alpha channel
     */
    get hex6() {
        return this.hex8.substring(0, 7);
    }

    /**
     * Get the functional notation with alpha included
     */
    get rgba() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 0xff})`;
    }

    /**
     * Get the functional notation without alpha included
     */
    get rgb() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

   
    /**
     * Get the hexadecimal.  Includes alpha channel if its not fully opaque.
     */
    get hex() {
        return this.a < 0xff ? this.hex8 : this.hex6;
    }

    /**
     * Determines if the color is dark
     */
    get isDark() {
        return this.l < 128;
    }

    /**
     * Determines if the color is light
     */
    get isLight() {
        return this.l > 128;
    }

    /**
     * Drops the precision of a color
     */
    dropPrecisionTo(precision: Precision) {
        this.r = ((this.r >>> precision) / (0xff >>> precision)) * 0xff;
        this.g = ((this.g >>> precision) / (0xff >>> precision)) * 0xff;
        this.b = ((this.b >>> precision) / (0xff >>> precision)) * 0xff;
        this.a = ((this.a >>> precision) / (0xff >>> precision)) * 0xff;
    }

    /**
     * Get the distance between two colors, not factoring in the alpha component.
     * 
     * @param color the secondary color to compare
     */
    distanceTo(color: Color) {
        return Color.distanceBetween(this, color);
    }

    /**
     * Find the distance between two colors, not factoring in the alpha component.
     * Adapted from the algorithm found on https://www.compuphase.com/cmetric.htm
     * 
     * @param color1 the first color to compare
     * @param color2 the second color to compare
     * @return the distance between color1 and color2
     */
    static distanceBetween(color1: Color, color2: Color) {
        let rmean = (color1.r + color2.r) / 2;
        let r = color1.r - color2.r;
        let g = color1.g - color2.g;
        let b = color1.b - color2.b;

        return Math.sqrt((((512 + rmean) * r * 4) >> 8) + (4 * g * g) + (((767 - rmean) * b * b) >> 8));
    }

    /**
     * Parse a hexadecimal string (#ffffff)
     * 
     * @param source the source string to parse
     * @param target target variable to populate
     */
    static parseHex(source: string, target: Color = new Color()) {
        let lead = source[0];
        let raw = source.substring(1);
        let length = raw.length;
        
        if(lead !== "#" || !HEX_VALID_LENGTHS.includes(length)) {
            throw new Error(HEX_INVALID_ERROR);
        }

        if(length === 3 || length === 4) {
            let adjusted = "";

            for(let i = 0; i < length; ++i) {
                adjusted += raw[i] + raw[i];
            }

            raw = adjusted;
            length *= 2;
        }

        if(length === 6) {
            raw += "ff";
        }
        
        target.value = parseInt(raw, 16);
        return target;
    }

    /**
     * Parse a functional rgb() or rgba() string
     * 
     * @param source the source string to parse
     * @param target target variable to populate
     */
    static parseFunctional(source: string, target: Color = new Color()) {
        new FunctionalParser({ source, target });
    }
}

for(let component in KEYS) {
    let propKey = KEYS[component];
    let offset = BIT_OFFSETS[component] as unknown as number;
    let mask = BIT_MASKS[component] as unknown as number;
    let maskNot = ~mask >>> 0;

    Object.defineProperty(Color.prototype, propKey, {
        get: function() {
            return (this.value >>> offset) & CLAMP_UPPER;
        },

        set: function(value) {
            validateComponent(value);
            let shift = (value << offset) >>> 0;
            let left = (maskNot & this.value) >>> 0;
            let right = (shift & mask) >>> 0;
            this.value = (left | right) >>> 0;
        }
    });
}

export default Color;