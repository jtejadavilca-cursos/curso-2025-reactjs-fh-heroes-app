import { beforeEach, describe, expect, test, vi } from "vitest";
import SearchPage from "./SearchPage";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHeroSearch } from "@/heroes/hooks/useHeroSearch";
import type { Hero } from "@/heroes/types/hero.interface";

vi.mock("@/heroes/hooks/useHeroSearch");
const mockUseHeroSearch = vi.mocked(useHeroSearch);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderHomePage = (
    initialEntries?: string[], //
    searchResult: Hero[] = []
    // heroes: Hero[] = [mockHero], //
    // pages: number = 1 //
) => {
    mockUseHeroSearch.mockReturnValue({
        data: searchResult,
    } as unknown as ReturnType<typeof useHeroSearch>);

    // mockUseHeroSummary.mockReturnValue({
    //     data: summary,
    // } as unknown as ReturnType<typeof useHeroSummary>);

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
});
