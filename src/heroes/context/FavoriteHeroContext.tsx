import { createContext, useEffect, useState, type PropsWithChildren } from "react";
import type { Hero } from "../types/hero.interface";
import { useSearchParams } from "react-router";

interface FavoriteHeroContextProps {
    // State
    favorites: Hero[];
    favoritesPaginated: Hero[];
    favoritesCount: number;
    totalFavoritePages: number;

    // Methods
    isFavorite: (hero: Hero) => boolean;
    toggleFavorite: (hero: Hero) => void;
    calculatePercentage: (total: number) => string;
}

export const FavoriteHeroContext = createContext<FavoriteHeroContextProps>({} as FavoriteHeroContextProps);

const FAVORITES_LOCAL_STORAGE_KEY = "favorites";

const getFavoritesfromLocalStorage = (): Hero[] => {
    const favorites = localStorage.getItem(FAVORITES_LOCAL_STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
};

export const FavoriteHeroProvider = ({ children }: PropsWithChildren) => {
    const [favorites, setFavorites] = useState<Hero[]>(getFavoritesfromLocalStorage());

    const [searchParams] = useSearchParams();

    const category = searchParams.get("tab") ?? "all";
    const page = searchParams.get("page") ?? 1;
    const offset = isNaN(+page) || +page < 1 ? 1 : +page - 1;

    let limit = searchParams.get("limit") ?? 6;
    limit = isNaN(+limit) ? 6 : +limit;
    const showFavorites = category === "favorites";

    const isFavorite = (hero: Hero) => {
        return favorites.some((h) => h.id === hero.id);
    };

    const toggleFavorite = (hero: Hero) => {
        const heroExists = favorites.find((h) => h.id === hero.id);

        if (heroExists) {
            const newFavorites = favorites.filter((h) => h.id !== hero.id);
            setFavorites(newFavorites);
            return;
        }
        setFavorites([...favorites, hero]);
    };

    const calculatePercentage = (total: number): string => {
        if (total <= 0) return "0.00";

        return ((favorites.length / total) * 100).toFixed(2);
    };

    useEffect(() => {
        localStorage.setItem(FAVORITES_LOCAL_STORAGE_KEY, JSON.stringify(favorites));
    }, [favorites]);

    return (
        <FavoriteHeroContext
            value={{
                totalFavoritePages: showFavorites ? Math.ceil(favorites.length / limit) : 0,
                favoritesCount: favorites.length,

                favorites,
                favoritesPaginated: favorites.slice(offset * limit, offset * limit + limit),
                isFavorite,
                toggleFavorite,
                calculatePercentage,
            }}
        >
            {children}
        </FavoriteHeroContext>
    );
};
