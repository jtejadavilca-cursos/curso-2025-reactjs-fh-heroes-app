import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import HomePage from "./HomePage";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { mockHero } from "@/__data__/mocks";
import type { Hero } from "@/heroes/types/hero.interface";
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import type { SummaryInformationResponse } from "@/heroes/types/summary-information.response";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";
import { mockHeros } from "@/__data__/mocks/mock-hero";

// Mocked pages
const mockJumbotronContent = "Mocked CustomJumbotron";
const mockHeroStatsContent = "Mocked HeroStats section";
const mockHeroGridContent = "Mocked Hero Grid";
vi.mock("@/components/custom/CustomJumbotron", () => ({
    CustomJumbotron: () => <div data-testid="mocked-jumbotron-header">{mockJumbotronContent}</div>,
}));
vi.mock("@/heroes/components/HeroStats", () => ({
    HeroStats: () => <div data-testid="mocked-herostats-section">{mockHeroStatsContent}</div>,
}));

vi.mock("@/heroes/components/HeroGrid", () => ({
    HeroGrid: ({ heroes }: { heroes: Hero[] }) => (
        <div data-testid="mocked-hero-grid-section">
            <h3>{mockHeroGridContent}</h3>
            {heroes.map((h) => (
                <div key={h.id} data-testid={`card-${h.id}`}>
                    <h2>Hero {h.name}</h2>
                </div>
            ))}
        </div>
    ),
}));

vi.mock("@/components/custom/CustomPagination", () => ({
    CustomPagination: ({ totalPages }: { totalPages: number }) => (
        <div data-testid="mocked-paginator-section">
            <h3>Mocked CustomPagination section</h3>
            <h2>Total pages : {totalPages}</h2>
        </div>
    ),
}));
// End Mocked pages

// Mocked hooks
//usePaginatedHero
vi.mock("@/heroes/hooks/usePaginatedHero");
const mockUsePaginatedHero = vi.mocked(usePaginatedHero);

vi.mock("@/heroes/hooks/useHeroSummary");
const mockUseHeroSummary = vi.mocked(useHeroSummary);
// End Mocked hooks

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderHomePage = (
    initialEntries?: string[], //
    summary?: Partial<SummaryInformationResponse>,
    heroes: Hero[] = [mockHero], //
    pages: number = 1 //
) => {
    mockUsePaginatedHero.mockReturnValue({
        data: {
            heroes,
            pages,
        },
    } as unknown as ReturnType<typeof usePaginatedHero>);

    mockUseHeroSummary.mockReturnValue({
        data: summary,
    } as unknown as ReturnType<typeof useHeroSummary>);

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <FavoriteHeroProvider>
                <QueryClientProvider client={queryClient}>
                    <HomePage />
                </QueryClientProvider>
            </FavoriteHeroProvider>
        </MemoryRouter>
    );
};

describe("Testing HomePage.test", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render HomePage with default values", () => {
        // With one favorite in localStorage by default
        localStorage.setItem("favorites", JSON.stringify([mockHero]));
        const { container } = renderHomePage([""], {
            totalHeroes: 10,
            heroCount: 6,
            villainCount: 4,
        });

        // Sections.
        expect(screen.getByTestId("mocked-jumbotron-header")).toBeDefined();
        expect(screen.getByTestId("mocked-jumbotron-header").innerHTML).toContain(mockJumbotronContent);
        expect(screen.getByTestId("mocked-herostats-section")).toBeDefined();
        expect(screen.getByTestId("mocked-herostats-section").innerHTML).toContain(mockHeroStatsContent);
        expect(screen.getByTestId("mocked-hero-grid-section")).toBeDefined();
        expect(screen.getByTestId("mocked-hero-grid-section").innerHTML).toContain(mockHeroGridContent);

        // Tabs
        expect(screen.getByTestId("tab-trigger-summary-all-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-trigger-summary-all-heroes").innerHTML).toContain("All Characters (10)");
        expect(screen.getByTestId("tab-trigger-summary-favorites-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-trigger-summary-favorites-heroes").innerHTML).toContain("Favorites (1)");
        expect(screen.getByTestId("tab-trigger-summary-only-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-trigger-summary-only-heroes").innerHTML).toContain("Heroes (6)");
        expect(screen.getByTestId("tab-trigger-summary-only-villain")).toBeDefined();
        expect(screen.getByTestId("tab-trigger-summary-only-villain").innerHTML).toContain("Villains (4)");

        // Tabs content
        expect(screen.getByTestId("tab-content-summary-all-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-content-summary-all-heroes").innerHTML).toContain("Todos los personales");
        expect(screen.getByTestId("tab-content-summary-favorites-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-content-summary-favorites-heroes").innerHTML).toContain("");
        expect(screen.getByTestId("tab-content-summary-only-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-content-summary-only-heroes").innerHTML).toContain("");
        expect(screen.getByTestId("tab-content-summary-only-villain")).toBeDefined();
        expect(screen.getByTestId("tab-content-summary-only-villain").innerHTML).toContain("");

        expect(container).toMatchSnapshot();

        //screen.debug();
    });

    test("should show favorite tab", () => {
        localStorage.setItem("favorites", JSON.stringify(mockHeros));
        const { container } = renderHomePage(["/?page=2&limit=2&tab=favorites"], {
            totalHeroes: 10,
            heroCount: 6,
            villainCount: 4,
        });

        // Sections.
        expect(screen.getByTestId("mocked-jumbotron-header")).toBeDefined();
        expect(screen.getByTestId("mocked-jumbotron-header").innerHTML).toContain(mockJumbotronContent);
        expect(screen.getByTestId("mocked-herostats-section")).toBeDefined();
        expect(screen.getByTestId("mocked-herostats-section").innerHTML).toContain(mockHeroStatsContent);
        expect(screen.getByTestId("mocked-hero-grid-section")).toBeDefined();
        expect(screen.getByTestId("mocked-hero-grid-section").innerHTML).toContain(mockHeroGridContent);

        // Tabs
        expect(screen.getByTestId("tab-trigger-summary-all-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-trigger-summary-all-heroes").innerHTML).toContain("All Characters (10)");
        expect(screen.getByTestId("tab-trigger-summary-favorites-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-trigger-summary-favorites-heroes").innerHTML).toContain("Favorites (5)");
        expect(screen.getByTestId("tab-trigger-summary-only-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-trigger-summary-only-heroes").innerHTML).toContain("Heroes (6)");
        expect(screen.getByTestId("tab-trigger-summary-only-villain")).toBeDefined();
        expect(screen.getByTestId("tab-trigger-summary-only-villain").innerHTML).toContain("Villains (4)");

        // Tabs content
        expect(screen.getByTestId("tab-content-summary-all-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-content-summary-all-heroes").innerHTML).toContain("");
        expect(screen.getByTestId("tab-content-summary-favorites-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-content-summary-favorites-heroes").innerHTML).toContain("Favoritos");
        expect(screen.getByTestId("tab-content-summary-only-heroes")).toBeDefined();
        expect(screen.getByTestId("tab-content-summary-only-heroes").innerHTML).toContain("");
        expect(screen.getByTestId("tab-content-summary-only-villain")).toBeDefined();
        expect(screen.getByTestId("tab-content-summary-only-villain").innerHTML).toContain("");

        // Grid
        expect(screen.getByTestId("mocked-hero-grid-section").children.length).toBe(3);
        expect(screen.getByTestId("mocked-hero-grid-section").innerHTML).toContain(mockHeroGridContent);
        expect(screen.getByTestId("mocked-hero-grid-section").innerHTML).toContain("My Test hero 456");
        expect(screen.getByTestId("mocked-hero-grid-section").innerHTML).toContain("My Test hero 678");

        expect(container).toMatchSnapshot();

        //screen.debug();
    });

    test("should render Villains container when click in villain tab", () => {
        // With one favorite in localStorage by default
        renderHomePage([""], {
            totalHeroes: 10,
            heroCount: 6,
            villainCount: 4,
        });

        // const [allTabd, favoriteTabs, heroesTab, villainsTab] = screen.getAllByRole("tab");
        const [, , , villainsTab] = screen.getAllByRole("tab");
        fireEvent.click(villainsTab);

        expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 6, "villain");
        //screen.debug();
    });
});
