import { describe, expect, test, vi, afterEach } from "vitest";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { usePaginatedHero } from "./usePaginatedHero";
import type { HeroesResponse } from "../types/get-heroes.response";

vi.mock("../actions/get-heroes-by-page.action", () => ({
    getHeroesByPageAction: vi.fn(),
}));

const tanStackCustomProvider = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
            },
        },
    });
    return ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe("Testing usePaginatedHero.tsx", () => {
    const mockGetHeroesByPageAction = vi.mocked(getHeroesByPageAction);

    afterEach(() => {
        vi.clearAllMocks();
    });
    test("should return the initial state (isLoading)", async () => {
        const { result } = renderHook(() => usePaginatedHero(1, 5, "all"), {
            wrapper: tanStackCustomProvider(),
        });
        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.status).toBe("pending");
        expect(result.current.data).toBeUndefined();
    });
    test.each([
        {
            expReq: { page: 3, limit: 5, category: "all" },
            input: { page: 3, limit: 5, category: "all" },
        },
        {
            expReq: { page: 3, limit: 5, category: "111" },
            input: { page: 3, limit: 5, category: "111" },
        },
        {
            expReq: { page: 1, limit: 5, category: "all" },
            input: { page: "a", limit: 5, category: "all" },
        },
        {
            expReq: { page: 3, limit: 6, category: "all" },
            input: { page: 3, limit: "b", category: "all" },
        },
        {
            expReq: { page: 3, limit: 6, category: "abc" },
            input: { page: 3, limit: "b", category: "abc" },
        },
        {
            expReq: { page: 3, limit: 6, category: "all" },
            input: { page: 3 },
        },
        {
            expReq: { page: 1, limit: 7, category: "all" },
            input: { limit: 7 },
        },
        {
            expReq: { page: 1, limit: 6, category: "xyz" },
            input: { category: "xyz" },
        },
        {
            expReq: { page: 1, limit: 6, category: "all" },
            input: {},
        },
        // { expReq: { offset: 0, limit: 6, category: "all" }, input: { page: "abc" } },
        // { expReq: { offset: 6, limit: 6, category: "all" }, input: { page: 2 } },
        // { expReq: { offset: 12, limit: 3, category: "all" }, input: { page: 5, limit: 3 } },
        // {
        //     expReq: { offset: 8, limit: 4, category: "abc" },
        //     input: { page: 3, limit: 4, category: "abc" },
        // },
    ])("should return the initial state (isLoading)", async ({ expReq, input }) => {
        const mockHeroesResponse = { total: 100 } as HeroesResponse;

        mockGetHeroesByPageAction.mockResolvedValue(mockHeroesResponse);
        const { result } = renderHook(
            () => usePaginatedHero(input.page as number, input.limit as number, input.category),
            {
                wrapper: tanStackCustomProvider(),
            }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        console.log("result", result);

        expect(mockGetHeroesByPageAction).toBeTruthy();
        expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(expReq.page, expReq.limit, expReq.category);
        expect(mockGetHeroesByPageAction).toHaveBeenCalledOnce();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBe(mockHeroesResponse);
    });

    test("should return error state when API call fails", async () => {
        const mockError = new Error("Failed to fetch summary");
        mockGetHeroesByPageAction.mockRejectedValue(mockError);
        const { result } = renderHook(() => usePaginatedHero(1, 1), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeDefined();
        expect(result.current.error?.message).toBe("Failed to fetch summary");
        expect(result.current.isLoading).toBe(false);
        expect(mockGetHeroesByPageAction).toHaveBeenCalledOnce();
    });
});
