import { heroApi } from "../api/hero.api";
import type { Hero } from "../types/hero.interface";

export interface SearchProps {
    name?: string;
    strength?: number;
}

const BASE_URL = import.meta.env.VITE_API_URL;
export const getSearchAction = async (filters: SearchProps) => {
    const hasValues = Object.values(filters).length > 0;
    console.log("->hasValues", hasValues, "filters", filters);
    if (!hasValues) return [];

    const { data } = await heroApi.get<Hero[]>("/search", {
        params: filters,
    });

    return data.map((hero) => ({
        ...hero,
        image: `${BASE_URL}/images/${hero.image}`,
    }));
};
