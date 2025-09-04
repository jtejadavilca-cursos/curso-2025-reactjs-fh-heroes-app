import { describe, expect, test } from "vitest";
import { heroApi } from "@/heroes/api/hero.api";

const BASE_URL = import.meta.env.VITE_API_URL;
describe("Testing hero.api.ts", () => {
    test("should be defined", () => {
        expect(heroApi).toBeDefined();
    });

    test("BASE_URL should be set in environment variable", () => {
        expect(BASE_URL).toContain(":12345");
    });

    test("should be configured pointing to the testing server", () => {
        expect(heroApi.defaults.baseURL).toBe(`${BASE_URL}/api/heroes`);
    });
});
