import { snakeCaseToTitleCase } from "../snakeCaseToTitleCase";

describe("snakeCaseToTitleCase", () => {
    it("should capitalize the first letter of first word", () => {
        const input = "hello_world";
        const expected = "Hello world";
        const result = snakeCaseToTitleCase(input);
        expect(result).toEqual(expected);
    });

    it("should capitalize the first letter of a single word", () => {
        const input = "hello";
        const expected = "Hello";
        const result = snakeCaseToTitleCase(input);
        expect(result).toEqual(expected);
    });
});
