import { isValidComponentValue } from "../src/component";

describe("isValidComponentValue", () => {
    it("Should return false if the value is not a number", () => {
        // @ts-ignore
        expect(isValidComponentValue("test")).toBe(false);
    });

    it("Should return false if the value is greater than 255", () => {
        expect(isValidComponentValue(256)).toBe(false);
    });

    it("Should return false if the value is less than 0", () => {
        expect(isValidComponentValue(-1)).toBe(false);
    });

    it("Should return true if a number between 0 and 255 was specified", () => {
        expect(isValidComponentValue(125)).toBe(true);
    });
});