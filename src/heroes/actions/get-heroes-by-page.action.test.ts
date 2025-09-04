import { afterEach, describe, expect, test } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";
import { getHeroesByPageAction } from "./get-heroes-by-page.action";
import { heroApi } from "../api/hero.api";

describe("Testing get-heroes-by-page.action.ts", () => {
    const heroesApiMock = new AxiosMockAdapter(heroApi);

    afterEach(() => {
        //vi.restoreAllMocks();
        heroesApiMock.reset();
    });

    test("should return default heroes", async () => {
        const mockApiResponse = {
            total: 10,
            pages: 5,
            heroes: [
                {
                    id: 1,
                    image: "1.jpeg",
                },
                {
                    id: 2,
                    image: "2.jpeg",
                },
            ],
        };
        const expectedResult = {
            total: 10,
            pages: 5,
            heroes: [
                {
                    id: 1,
                    image: "http://localhost:12345/images/1.jpeg",
                },
                {
                    id: 2,
                    image: "http://localhost:12345/images/2.jpeg",
                },
            ],
        };
        heroesApiMock.onGet("/").reply(200, mockApiResponse);

        const response = await getHeroesByPageAction(1);

        expect(response).toStrictEqual(expectedResult);
    });

    test.each([
        { expectedRequestParams: { offset: 0, limit: 6, category: "all" }, input: {} },
        { expectedRequestParams: { offset: 0, limit: 6, category: "all" }, input: { page: "abc" } },
        { expectedRequestParams: { offset: 6, limit: 6, category: "all" }, input: { page: 2 } },
        { expectedRequestParams: { offset: 12, limit: 3, category: "all" }, input: { page: 5, limit: 3 } },
        {
            expectedRequestParams: { offset: 8, limit: 4, category: "abc" },
            input: { page: 3, limit: 4, category: "abc" },
        },
    ])("should set right requets params %s according to input params %s", async ({ expectedRequestParams, input }) => {
        const mockApiResponse = {
            total: 1,
            pages: 1,
            heroes: [],
        };

        heroesApiMock.onGet("/").reply(200, mockApiResponse);

        await getHeroesByPageAction(input.page as number, input.limit, input.category);
        // const [history] = heroesApiMock.history;
        // expect(history.params).toEqual(expectedParams);

        const [{ params }] = heroesApiMock.history;
        expect(params).toEqual(expectedRequestParams);
    });
});
