import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { FavoriteHeroContext, FavoriteHeroProvider } from "./FavoriteHeroContext";
import { use } from "react";
import type { Hero } from "../types/hero.interface";

const mockHero = {
    id: 123,
    name: "My Test hero",
} as unknown as Hero;

const TestComponent = () => {
    const { favoritesCount, favorites, isFavorite, toggleFavorite } = use(FavoriteHeroContext);
    return (
        <div>
            <div data-testid="favorite-count">{favoritesCount}</div>
            <div data-testid="favorite-list">
                {favorites.map((f) => (
                    <div data-testid={`hero-${f.id}`}>{f.id}</div>
                ))}
            </div>
            <button data-testid="toggle-favorite" onClick={() => toggleFavorite(mockHero)}>
                Toggle Favorite
            </button>
            <div data-testid="is-favorite">{isFavorite(mockHero).toString()}</div>
        </div>
    );
};

const renderContextTest = () => {
    return render(
        <FavoriteHeroProvider>
            <TestComponent />
        </FavoriteHeroProvider>
    );
};

describe("Testing FavoriteHeroContext.tsx", () => {
    afterEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });
    test("Should be defined", () => {
        renderContextTest();

        expect(screen.getByTestId("favorite-count").textContent).toBe("0");
        expect(screen.getByTestId("favorite-list").children.length).toBe(0);
    });

    test("should add hero to favorites when toggleFavorite is called", () => {
        renderContextTest();

        expect(screen.getByTestId("is-favorite").textContent).toBe("false");
        expect(localStorage.getItem("favorites")).toBe("[]");
        const button = screen.getByTestId("toggle-favorite");
        fireEvent.click(button);

        expect(screen.getByTestId("favorite-count").textContent).toBe("1");
        expect(screen.getByTestId("favorite-list").children.length).toBe(1);
        expect(screen.getByTestId("is-favorite").textContent).toBe("true");
        expect(localStorage.getItem("favorites")).toBe('[{"id":123,"name":"My Test hero"}]');
    });

    test("should remove hero from favorites when toggleFavorite is called", () => {
        localStorage.setItem("favorites", JSON.stringify([mockHero]));

        renderContextTest();

        expect(screen.getByTestId("favorite-count").textContent).toBe("1");
        expect(screen.getByTestId("favorite-list").children.length).toBe(1);
        expect(screen.getByTestId("is-favorite").textContent).toBe("true");
        expect(screen.getByTestId("hero-123").textContent).toBe("123");
        expect(localStorage.getItem("favorites")).toBe('[{"id":123,"name":"My Test hero"}]');

        const button = screen.getByTestId("toggle-favorite");
        fireEvent.click(button);

        expect(screen.getByTestId("favorite-count").textContent).toBe("0");
        expect(screen.getByTestId("favorite-list").children.length).toBe(0);
        expect(screen.getByTestId("is-favorite").textContent).toBe("false");
        expect(screen.queryByTestId("hero-123")).toBeNull();
        expect(localStorage.getItem("favorites")).toBe("[]");
    });
});
