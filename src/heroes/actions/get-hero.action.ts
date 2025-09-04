import { heroApi } from "../api/hero.api";
import type { Hero } from "../types/hero.interface";

const BASE_URL = import.meta.env.VITE_API_URL;
export const getHeroeByIdOsSlugAction = async (idSlug: string): Promise<Hero> => {
    const { data: heroResponse } = await heroApi.get<Hero>(`/${idSlug}`);

    return {
        ...heroResponse,
        image: `${BASE_URL}/images/${heroResponse.image}`,
    };
};
