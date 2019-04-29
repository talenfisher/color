import Color, { Precision } from "../src";

describe("Color", () => {  

    describe("constructor", () => {
        it("Should detect and parse a hexadecimal correctly", () => {
            let color = new Color("#03fbff");
            expect(color.r).toBe(3);
            expect(color.g).toBe(251);
            expect(color.b).toBe(255);
            expect(color.a).toBe(255);
        });

        it("Should detect and parse an rgb() functional string correctly", () => {
            let color = new Color("rgb(230, 251, 225)");
            expect(color.r).toBe(230);
            expect(color.g).toBe(251);
            expect(color.b).toBe(225);
            expect(color.a).toBe(255);
        });

        it("Should detect and parse an rgba() functional string correctly", () => {
            let color = new Color("rgba(230, 251, 225, 0.4)");
            expect(color.r).toBe(230);
            expect(color.g).toBe(251);
            expect(color.b).toBe(225);
            expect(color.a).toBe(102);
        });

        it("Should initialize values to 0 if not given a source string to parse", () => {
            let color = new Color();
            expect(color.r).toBe(0);
            expect(color.g).toBe(0);
            expect(color.b).toBe(0);
            expect(color.a).toBe(0);
        });
    });

    describe("parseFunctional", () => {
        it("Should throw an error if the opening sequence contains invalid chars", () => {
            expect(() => {
                Color.parseFunctional("cmyk()");
            }).toThrow();
        });

        it("Should throw an error if a was in the opening sequence but the value wasn't specified", () => {
            expect(() => {
                Color.parseFunctional("rgba(255, 255, 255)");
            }).toThrow();
        });

        it("Should not throw an error if given a valid rgb string", () => {
            expect((() => {
                Color.parseFunctional("rgb(255, 255, 255)");
                return true;
            })()).toBe(true);
        });

        it("Should correctly populate the target parameter with the red value", () => {
            let color = new Color();
            Color.parseFunctional("rgb(200, 52, 35)", color);
            expect(color.r).toBe(200);
        });

        it("Should correctly populate the target parameter with the green value", () => {
            let color = new Color();
            Color.parseFunctional("rgb(200, 52, 35)", color);
            expect(color.g).toBe(52);
        });

        it("Should correctly populate the target parameter with the blue value", () => {
            let color = new Color();
            Color.parseFunctional("rgb(200, 52, 35)", color);
            expect(color.b).toBe(35);
        });

        it("Should correctly populate the target parameter with the alpha value", () => {
            let color = new Color();
            Color.parseFunctional("rgba(200, 52, 35, 0.4)", color);
            expect(color.a).toBe(102);
        });
    });

    describe("parseHex", () => {
        it("Should throw an error if the first char is not #", () => {
            expect(() => {
                Color.parseHex("ffffff");
            }).toThrow();
        });

        it("Should throw an error if the source string's length is greater than 9", () => {
            expect(() => {
                Color.parseHex("#fffffffff");
            }).toThrow();
        });

        it("Should throw an error if the source string's length is 8", () => {
            expect(() => {
                Color.parseHex("#fffffff");
            }).toThrow();
        });

        it("Should not throw an error if the source string's length is 3", () => {
            expect(function() {
                Color.parseHex("#fff");
                return true;
            }()).toBe(true);
        });

        it("Should not throw an error if given a valid hex", () => {
            expect(function() {
                Color.parseHex("#ffffff");
                return true;
            }()).toBe(true);
        });

        it("Should populate the target parameter with the correct red value", () => {
            let color = new Color();
            Color.parseHex("#03fbff", color);
            expect(color.r).toBe(3);
        });

        it("Should populate the target parameter with the correct blue value", () => {
            let color = new Color();
            Color.parseHex("#03fbff", color);
            expect(color.g).toBe(251);
        });

        it("Should populate the target parameter with the correct green value", () => {
            let color = new Color();
            Color.parseHex("#03fbff", color);
            expect(color.b).toBe(255);
        });

        it("Should default the alpha value to 255 if given a string with length 7", () => {
            let color = new Color();
            Color.parseHex("#03fbff", color)
            expect(color.a).toBe(255);
        });

        it("Should populate the target parameter with the correct alpha value", () => {
            let color = new Color();
            Color.parseHex("#03fbff05", color);
            expect(color.a).toBe(5);
        });

        it("Should correctly update all values if the given string's length is 3", () => {
            let color = new Color();
            Color.parseHex("#fcf", color);
            expect(color.r).toBe(255);
            expect(color.g).toBe(204);
            expect(color.b).toBe(255);
            expect(color.a).toBe(255);
        });

        it("Should correctly update all values if the given string's length is 4", () => {
            let color = new Color();
            Color.parseHex("#fcfc", color);
            expect(color.r).toBe(255);
            expect(color.g).toBe(204);
            expect(color.b).toBe(255);
            expect(color.a).toBe(204);
        });
    });

    describe("set r", () => {
        it("Should correctly update the red component and leave other components in tact", () => {
            let color = new Color("rgb(230, 241, 152)");
            expect(color.r).toBe(230);

            color.r = 60;
            expect(color.r).toBe(60);
            expect(color.g).toBe(241);
            expect(color.b).toBe(152);
            expect(color.a).toBe(255);
        });

        it("Should update the hexadecimal properly", () => {
            let color = new Color("#ffffff");
            expect(color.r).toBe(255);
            
            color.g = 0;
            expect(color.hex6).toBe("#ff00ff");
        });
    });

    describe("set g", () => {
        it("Should correctly update the red component and leave other components in tact", () => {
            let color = new Color("rgb(230, 241, 152)");
            expect(color.g).toBe(241);

            color.g = 60;
            expect(color.r).toBe(230);
            expect(color.g).toBe(60);
            expect(color.b).toBe(152);
            expect(color.a).toBe(255);
        });
    });

    describe("set b", () => {
        it("Should correctly update the red component and leave other components in tact", () => {
            let color = new Color("rgb(230, 241, 152)");
            expect(color.b).toBe(152);

            color.b = 60;
            expect(color.r).toBe(230);
            expect(color.g).toBe(241);
            expect(color.b).toBe(60);
            expect(color.a).toBe(255);
        });
    });

    describe("get l", () => {
        it("Should return the luminance value of the color", () => {
            let color = new Color("#ffffff");
            expect(color.l).toBe(255);
        });
    });

    describe("get hex8", () => {
        it("Should return the hexadecimal representation of the color with alpha included", () => {
            let color = new Color("rgb(66, 134, 244)");
            expect(color.hex8).toBe("#4286f4ff");
        });
    });

    describe("get hex6", () => {
        it("Should return the hexadecimal representation of the color without alpha included", () => {
            let color = new Color("rgb(66, 134, 244)");
            expect(color.hex6).toBe("#4286f4");
        });
    });

    describe("get hex", () => {
        it("Should return the full hexadecimal including alpha if the color is not fully opaque", () => {
            let color = new Color("rgba(66, 134, 244, 0.4)");
            expect(color.hex).toBe("#4286f466");
        });

        it("Should return the hexadecimal without the alpha channel if it is fully opaque", () => {
            let color = new Color("rgb(66, 134, 244)");
            expect(color.hex).toBe("#4286f4");
        });
    });

    describe("get rgba", () => {
        it("Should return the functional string representation of the color with alpha included", () => {
            let color = new Color("#4286f466");
            expect(color.rgba).toBe("rgba(66, 134, 244, 0.4)");
        });
    });

    describe("get rgb", () => {
        it("Should return the functional string representation of the color without alpha included", () => {
            let color = new Color("#4286f4");
            expect(color.rgb).toBe("rgb(66, 134, 244)");
        });
    });

    describe("get isLight", () => {
        it("Should return true for light colors", () => {
            let color = new Color("#ffffff");
            expect(color.isLight).toBe(true);
        });

        it("Should return false for dark colors", () => {
            let color = new Color("#000000");
            expect(color.isLight).toBe(false);
        });
    });

    describe("get isDark", () => {
        it("Should return true for dark colors", () => {
            let color = new Color("#000000");
            expect(color.isDark).toBe(true);
        });

        it("Should return false for light colors", () => {
            let color = new Color("#cccccc");
            expect(color.isDark).toBe(false);
        });
    });

    describe("dropPrecisionTo", () => {
        it("Should not affect colors that are divisible by factors of 2", () => {
            let color = new Color("#cd7f31");
            color.dropPrecisionTo(Precision.Color16);
            expect(color.hex).toBe("#cd7f31");
        });

        it("Should drop precision of colors that are not divisible by factors of 2", () => {
            let color = new Color("#cd7f32");
            color.dropPrecisionTo(Precision.Color16);
            expect(color.hex).toBe("#cd7f31");
        });

        it("Should not drop numbers to lower than 0", () => {
            let color = new Color("#000000");
            color.dropPrecisionTo(Precision.Color16);
            expect(color.hex).toBe("#000000");
        });
    });
});