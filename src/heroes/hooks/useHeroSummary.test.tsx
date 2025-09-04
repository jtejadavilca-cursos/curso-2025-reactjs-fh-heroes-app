import { afterEach, describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useHeroSummary } from "./useHeroSummary";
import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getSummaryAction } from "../actions/get-summary.action";
import type { SummaryInformationResponse } from "../types/summary-information.response";
import type { Hero } from "../types/hero.interface";

vi.mock("../actions/get-summary.action", () => ({
    getSummaryAction: vi.fn(),
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

describe("Testing useHeroSummary.tsx", () => {
    const mockGetSummaryAction = vi.mocked(getSummaryAction);
    afterEach(() => {
        vi.clearAllMocks();
    });

    test("should return the initial state (isLoading)", async () => {
        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider(),
        });
        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.status).toBe("pending");
        expect(result.current.data).toBeUndefined();
    });

    test("should return success state with data when API call success", async () => {
        const mockSummaryData = {
            totalHeroes: 10,
            strongestHero: {
                id: 1,
                name: "Superman",
            } as unknown as Hero,
            smartestHero: {
                id: 2,
                name: "Batman",
            } as unknown as Hero,
            heroCount: 18,
            villainCount: 7,
        } as SummaryInformationResponse;

        mockGetSummaryAction.mockResolvedValue(mockSummaryData);
        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });
        expect(result.current.data).toBeDefined();
        expect(mockGetSummaryAction).toHaveBeenCalledOnce();
    });

    test("should return error state when API call fails", async () => {
        const mockError = new Error("Failed to fetch summary");
        mockGetSummaryAction.mockRejectedValue(mockError);
        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeDefined();
        expect(result.current.error?.message).toBe("Failed to fetch summary");
        expect(result.current.isLoading).toBe(false);
        expect(mockGetSummaryAction).toHaveBeenCalledOnce();
    });
});
