import { CLAMP_UPPER, CLAMP_LOWER, isValidComponentValue } from "./component";
import Color from "./index";

const RGB_INVALID_ERROR = "Not a valid rgb value";

enum RGB_OP {
    OPENING_BRACE = "(",
    OPENING_VALUES = "rgba",
    NUMBERS = "0123456789.",
    CLOSERS = ",)",
    SPACE = " ",
    INVALID = "",
}

interface FunctionalParserOptions {
    source: string;
    target?: Color;
}

// parse rgb(...) and rgba(...) formats
export default class FunctionalParser {
    private source: string;
    private target: Color;
    private componentIndex = 0;
    private componentCount = 3; // expected component count
    private sourceComponents: string[] = [ "", "", "", "" ];
    private parsedComponents: number[] = [];

    constructor(options: FunctionalParserOptions) {
        this.source = options.source.toLowerCase();
        this.target = options.target || new Color();
        this.parse();           
    }
    
    getOp(value: string) {
        for(let op in RGB_OP) {
            if(RGB_OP[op].includes(value)) return RGB_OP[op];
        }

        return RGB_OP.INVALID;
    }

    parse() {
        for(let i = 0; i < this.source.length; i++) {                
            let current = this.source[i];

            switch(this.getOp(current)) {
                case RGB_OP.OPENING_VALUES: this.parseOpeningValues(i, current); break;
                case RGB_OP.OPENING_BRACE: this.parseOpeningBrace(i, current); break;
                case RGB_OP.NUMBERS: this.parseNumbers(i, current); break;
                case RGB_OP.SPACE: break;
                case RGB_OP.CLOSERS: this.parseClosers(i, current); break;
                
                default:
                case RGB_OP.INVALID: 
                    throw new Error(RGB_INVALID_ERROR);
                    break;
            }
        }

        if(this.parsedComponents.length < this.componentCount) {
            throw new Error(RGB_INVALID_ERROR);
        }

        let n = this.parsedComponents.length;
        for(let i = 0; i < n; ++i) {
            this.target.value |= this.parsedComponents[i] << (24 - i * 8); 
        }

        if(n < 4) {
            this.target.value |= 255;
        }
    }

    private parseOpeningValues(currentIndex: number, currentValue: string) {
        if(RGB_OP.OPENING_VALUES.indexOf(currentValue) !== currentIndex) {
            throw new Error(RGB_INVALID_ERROR);
        }

        if(currentValue === RGB_OP.OPENING_VALUES[3]) {
            ++this.componentCount;
        }
    }

    private parseOpeningBrace(currentIndex: number, currentValue: string) {
        if(currentIndex !== this.componentCount) { // something like rg() or r()
            throw new Error(RGB_INVALID_ERROR);
        }
    }

    private parseNumbers(currentIndex: number, currentValue: string) {
        if(currentValue === "." && this.componentIndex < 3) {
            throw new Error(RGB_INVALID_ERROR); // first 3 components should be integers between 0 and 255
        }

        this.sourceComponents[this.componentIndex] += currentValue;
    }

    private parseClosers(currentIndex: number, currentValue: string) {
        let parsed;

        if(this.componentIndex === 3) {
            parsed = parseFloat(this.sourceComponents[this.componentIndex]);
            parsed = Math.floor(parsed * CLAMP_UPPER);
        } else {
            parsed = parseInt(this.sourceComponents[this.componentIndex]);
        }
                    
        if(++this.componentIndex > this.componentCount || !isValidComponentValue(parsed)) {
            throw new Error(RGB_INVALID_ERROR);
        }

        this.parsedComponents[this.componentIndex - 1] = parsed;
    }
}