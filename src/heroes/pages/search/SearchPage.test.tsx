import { beforeEach, describe, expect, test, vi } from "vitest";
import SearchPage from "./SearchPage";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHeroSearch } from "@/heroes/hooks/useHeroSearch";
import type { Hero } from "@/heroes/types/hero.interface";
import { mockHeros } from "@/__data__/mocks/mock-hero";

vi.mock("@/heroes/components/HeroGrid", () => ({
    HeroGrid: ({ heroes }: { heroes: Hero[] }) => (
        <div data-testid="mocked-herogrid">Mocked HeroGrid - Total heroes: {heroes.length}</div>
    ),
}));

vi.mock("./ui/SearchControls", () => ({
    SearchControls: () => <div data-testid="mocked-search-control">Mocked SearchControls</div>,
}));

vi.mock("@/heroes/hooks/useHeroSearch");
const mockUseHeroSearch = vi.mocked(useHeroSearch);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
}); //

const renderHomePage = (
    initialEntries?: string[], //
    searchResult: Hero[] = []
) => {
    mockUseHeroSearch.mockReturnValue({
        data: searchResult,
    } as unknown as ReturnType<typeof useHeroSearch>);

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            {/* <FavoriteHeroProvider> */}
            <QueryClientProvider client={queryClient}>
                <SearchPage />
            </QueryClientProvider>
            {/* </FavoriteHeroProvider> */}
        </MemoryRouter>
    );
};

describe("Testing SearchPage.test", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render SearchPage with default values", () => {
        const { container } = renderHomePage(["/"], []);

        expect(mockUseHeroSearch).toHaveBeenCalledWith({
            name: undefined,
            strength: undefined,
        });

        expect(container).toMatchSnapshot();
    });

    test.each([
        {
            searchQuery: "",
            searchParams: {},
        },
        {
            searchQuery: "/search?name=superman",
            searchParams: { name: "superman" },
        },
        {
            searchQuery: "/search?strength=5",
            searchParams: { strength: 5 },
        },
        {
            searchQuery: "/search?name=superman&strength=5",
            searchParams: { name: "superman", strength: 5 },
        },
    ])(
        "should call search action with parameters $searchParams for queries $searchQuery",
        ({ searchQuery, searchParams }) => {
            renderHomePage([searchQuery], []);
            expect(mockUseHeroSearch).toHaveBeenCalledWith(searchParams);
        }
    );

    test("should render HeroGrid with search results", async () => {
        //
        renderHomePage([""], mockHeros);

        expect(screen.getByTestId("mocked-herogrid")).toBeDefined();
        expect(screen.getByTestId("mocked-herogrid").innerHTML).toContain("Mocked HeroGrid - Total heroes: 5");

        screen.debug();
    });
});
