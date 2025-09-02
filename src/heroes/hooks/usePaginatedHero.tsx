import { useQuery } from "@tanstack/react-query";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";

export const usePaginatedHero = (page: number, limit: number, category: string = "all") => {
    const sanitizedPage = isNaN(page) ? 1 : +page;
    const sanitizedLimit = isNaN(limit) ? 6 : +limit;

    return useQuery({
        queryKey: ["heroes", { page: sanitizedPage, limit: sanitizedLimit, category }],
        queryFn: () => getHeroesByPageAction(sanitizedPage, sanitizedLimit, category),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};
