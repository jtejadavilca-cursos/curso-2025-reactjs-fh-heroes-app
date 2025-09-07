import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { SearchControls } from "./SearchControls";

if (typeof window.ResizeObserver === "undefined") {
    class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    window.ResizeObserver = ResizeObserver;
    //Object.defineProperty(window, "ResizeObserver", ResizeObserver);
}

const renderSearchControlWithRouter = (initialEntries: string[] = ["/"]) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <SearchControls />
        </MemoryRouter>
    );
};

describe("Testing SearchControls.test", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should be defined", () => {
        const { container } = renderSearchControlWithRouter();

        expect(container).toMatchSnapshot();
    });

    test("should be advance filters panel opened", () => {
        const { container } = renderSearchControlWithRouter(["?active-accordion=advance-filters-panel&name=Batman"]);

        // Advance filters
        const titleFilterPanel = screen.getByText("Advanced Filters");
        expect(titleFilterPanel).toBeDefined();
        expect(titleFilterPanel.tagName).toBe("H3");

        const btnClearAll = screen.getByText("Clear All");
        expect(btnClearAll).toBeDefined();
        expect(btnClearAll.tagName).toBe("BUTTON");

        const strengthControlLabel = screen.getByText("Minimum Strength: 0/10");
        expect(strengthControlLabel).toBeDefined();
        expect(strengthControlLabel.tagName).toBe("LABEL");

        // Input search
        const inputSearch = screen.getByPlaceholderText("Search heroes, villains, powers, teams...");
        expect(inputSearch.getAttribute("value")).toBe("Batman");

        expect(container).toMatchSnapshot();
    });

    test("should change params when input is changed and enter is pressed", () => {
        const { container } = renderSearchControlWithRouter(["?name=Batman"]);
        const inputSearch = screen.getByPlaceholderText("Search heroes, villains, powers, teams...");

        expect(inputSearch.getAttribute("value")).toBe("Batman");
        fireEvent.change(inputSearch, { target: { value: "Superman" } });
        fireEvent.keyDown(inputSearch, { key: "Enter" });

        expect(inputSearch.getAttribute("value")).toBe("Superman");
        expect(container).toMatchSnapshot();
    });

    test("should change params strength when slider is changed", () => {
        renderSearchControlWithRouter(["/?active-accordion=advance-filters-panel"]);

        const slider = screen.getByRole("slider");
        expect(slider.getAttribute("aria-valuenow")).toBe("0");

        fireEvent.keyDown(slider, { key: "ArrowRight" });
        fireEvent.keyDown(slider, { key: "ArrowRight" });
        fireEvent.keyDown(slider, { key: "ArrowRight" });
        expect(slider.getAttribute("aria-valuenow")).toBe("3");

        fireEvent.keyDown(slider, { key: "ArrowLeft" });
        expect(slider.getAttribute("aria-valuenow")).toBe("2");
    });

    test("should close accordion when filter button is clicked", () => {
        renderSearchControlWithRouter(["/?active-accordion=advance-filters-panel"]);
        // Advance filters is open
        const titleFilterPanel = screen.getByText("Advanced Filters");
        expect(titleFilterPanel).toBeDefined();
        expect(titleFilterPanel.tagName).toBe("H3");

        const btnClearAll = screen.getByText("Clear All");
        expect(btnClearAll).toBeDefined();
        expect(btnClearAll.tagName).toBe("BUTTON");

        const strengthControlLabel = screen.getByText("Minimum Strength: 0/10");
        expect(strengthControlLabel).toBeDefined();
        expect(strengthControlLabel.tagName).toBe("LABEL");

        // Closing advance filters
        const btnFilters = screen.getByText("Filters");
        fireEvent.click(btnFilters);
        expect(screen.queryByText("Clear All")).toBeNull();
        expect(screen.queryByText("Advanced Filters")).toBeNull();
    });
});
