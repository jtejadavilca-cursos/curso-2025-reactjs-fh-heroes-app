import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { HeroStats } from "./HeroStats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHeroSummary } from "../hooks/useHeroSummary";
import type { SummaryInformationResponse } from "../types/summary-information.response";
import { FavoriteHeroProvider } from "../context/FavoriteHeroContext";
import { mockHero, mockSummaryData } from "@/__data__/mocks";
import { MemoryRouter } from "react-router";

vi.mock("@/heroes/hooks/useHeroSummary");
const mockUseHeroSummary = vi.mocked(useHeroSummary);
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderHeroStats = (mockData?: Partial<SummaryInformationResponse>) => {
    mockUseHeroSummary.mockReturnValue({
        data: mockData,
    } as unknown as ReturnType<typeof useHeroSummary>);
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <FavoriteHeroProvider>
                    <HeroStats />
                </FavoriteHeroProvider>
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe("Testing HeroStats.test", () => {
    test("should render components with default values", () => {
        const { container } = renderHeroStats();

        expect(screen.getByText("Loading...")).toBeDefined();
        expect(container).toMatchSnapshot();
    });

    test("should render HeroStats with mocked information", () => {
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([mockHero]));
        const { container } = renderHeroStats(mockSummaryData);
        expect(container).toMatchSnapshot();

        const favoritePercentageElement = screen.getByTestId("favorite-percentage");
        expect(favoritePercentageElement.innerHTML).toContain("4.00 % of total");

        const favoriteCountElement = screen.getByTestId("favorite-count");
        expect(favoriteCountElement.innerHTML).toContain("1");

        expect(container.getElementsByClassName("@container/card-header")).toBeDefined();
        expect(container.getElementsByClassName("@container/card-header").length).toBe(4);
    });
});
