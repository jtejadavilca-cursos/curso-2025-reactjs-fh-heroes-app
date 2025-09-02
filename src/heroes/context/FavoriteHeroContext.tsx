import { createContext, useEffect, useState, type PropsWithChildren } from "react";
import type { Hero } from "../types/hero.interface";

interface FavoriteHeroContextProps {
    // State
    favorites: Hero[];
    favoritesCount: number;

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
                favoritesCount: favorites.length,
                favorites,
                isFavorite,
                toggleFavorite,
                calculatePercentage,
            }}
        >
            {children}
        </FavoriteHeroContext>
    );
};
