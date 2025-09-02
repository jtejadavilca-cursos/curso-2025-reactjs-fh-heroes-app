import { useQuery } from "@tanstack/react-query";
import type { SearchProps } from "../actions/search-heroes.action";
import { getSearchAction } from "../actions/search-heroes.action";

export const useHeroSearch = (filters: SearchProps) => {
    const cleanedFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => !!value)) as SearchProps;

    return useQuery({
        queryKey: ["search-heroes", { ...cleanedFilters }],
        queryFn: () => getSearchAction(cleanedFilters),
        staleTime: 1000 * 60 * 5,
    });
};
