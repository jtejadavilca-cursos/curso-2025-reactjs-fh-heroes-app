import { describe, expect, test, vi } from "vitest";
import { appRouter } from "./app.routes";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, Outlet, RouterProvider, useParams } from "react-router";

vi.mock("@/heroes/layouts/HeroesLayout", () => ({
    HeroesLayout: () => (
        <div data-testid="heroes-layout">
            <Outlet />
        </div>
    ),
}));

vi.mock("@/heroes/pages/home/HomePage", () => ({
    HomePage: () => <div data-testid="home-page">Mocked Home Page</div>,
}));

vi.mock("@/heroes/pages/hero/HeroPage", () => ({
    HeroPage: () => {
        const { idSlug = "" } = useParams();

        return <div data-testid="hero-page">Mocked Hero Page with id:{idSlug}</div>;
    },
}));
vi.mock("@/heroes/pages/search/SearchPage", () => ({
    default: () => <div data-testid="search-page">Mocked Search Page</div>,
}));

describe("Testing app.routes.test", () => {
    test("Should be defined", () => {
        expect(appRouter).toBeDefined();
    });

    test("should be configured as expected", () => {
        expect(appRouter.routes).toMatchSnapshot();
    });

    test("should render home page at root path", () => {
        const router = createMemoryRouter(appRouter.routes, {
            initialEntries: ["/"],
        });
        render(<RouterProvider router={router} />);

        expect(screen.getByTestId("home-page")).toBeDefined();
    });

    test("should render home page at root /heroes/:idSlug", () => {
        const idSlug = "superman";
        const router = createMemoryRouter(appRouter.routes, {
            initialEntries: [`/heroes/${idSlug}`],
        });
        render(<RouterProvider router={router} />);

        expect(screen.getByTestId("hero-page")).toBeDefined();
        expect(screen.getByTestId("hero-page").innerHTML).toContain(`Mocked Hero Page with id:${idSlug}`);
    });

    test("should render search page at /search path", async () => {
        const router = createMemoryRouter(appRouter.routes, {
            initialEntries: ["/search"],
        });
        render(<RouterProvider router={router} />);

        expect(await screen.findByText("Mocked Search Page")).toBeDefined();
    });

    test("should render home page at unknown path", () => {
        const router = createMemoryRouter(appRouter.routes, {
            initialEntries: ["/xyz"],
        });
        render(<RouterProvider router={router} />);

        expect(screen.getByTestId("home-page")).toBeDefined();
    });
});
