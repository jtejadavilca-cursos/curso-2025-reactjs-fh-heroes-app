import { describe, expect, test } from "vitest";
import { getSummaryAction } from "./get-summary.action";

describe("Testing get-summary.action.ts", async () => {
    test("", async () => {
        const summary = await getSummaryAction();

        expect(summary).toBeDefined();
        expect(summary).toEqual(
            expect.objectContaining({
                totalHeroes: expect.any(Number),
                heroCount: expect.any(Number),
                villainCount: expect.any(Number),
                strongestHero: expect.any(Object),
                smartestHero: expect.any(Object),
            })
        );
    });
});
