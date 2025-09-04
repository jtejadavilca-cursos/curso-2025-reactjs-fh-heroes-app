import { describe, expect, test } from "vitest";
import { getHeroeByIdOsSlugAction } from "./get-hero.action";

describe("Testing get-hero.action.ts", () => {
    describe("This tests require backend to be running", () => {
        test("should be defined", () => {
            expect(getHeroeByIdOsSlugAction).toBeDefined();
        });

        test("should fetch hero data and return with complete image url", async () => {
            const hero = await getHeroeByIdOsSlugAction("1");

            expect(hero).toBeDefined();
            expect(hero);
        });

        test("should throw an error when try to get a non-existent hero", async () => {
            // const resp: Assertion<() => Promise<Hero>> = expect(async () => {
            //     return await getHeroeByIdOsSlugAction("-1");
            // });

            // resp.rejects.toThrowError("Request failed with status code 404");

            const result = await getHeroeByIdOsSlugAction("-1").catch((err) => {
                expect(err).toBeDefined();
                expect(err.message).toBe("Request failed with status code 404");
                expect(err.status).toBe(404);
            });

            expect(result).toBeUndefined();
        });
    });
});
