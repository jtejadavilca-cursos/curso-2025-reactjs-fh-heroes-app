import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { CustomPagination } from "./CustomPagination";
import { MemoryRouter } from "react-router";
import { type PropsWithChildren } from "react";

vi.mock("../ui/button", () => ({
    Button: ({ children, ...props }: PropsWithChildren) => <button {...props}>{children}</button>,
}));

const renderWithRouter = (element: React.ReactElement) => {
    return render(<MemoryRouter>{element}</MemoryRouter>);
};

describe("Testing CustomPagination.test", () => {
    test("should be defined", () => {
        const { container } = renderWithRouter(<CustomPagination totalPages={3} />);

        expect(container).toMatchSnapshot();

        //screen.debug();
        const previousButton = screen.getByText("Anterior");
        const nextButton = screen.getByText("Siguiente");

        expect(previousButton).toBeDefined();
        expect(previousButton.getAttribute("disabled")).not.toBeNull();

        expect(nextButton).toBeDefined();
        expect(nextButton.getAttribute("disabled")).toBeNull();

        expect(screen.getByTestId("id-1").innerHTML).toContain("1");
        expect(screen.getByTestId("id-2").innerHTML).toContain("2");
        expect(screen.getByTestId("id-3").innerHTML).toContain("3");
        expect(screen.getByTestId("id-3")).not.toBeNull();
        expect(screen.queryByTestId("id-4")).toBeNull();
        //const val = screen.queryByTestId("id-4");
        //console.log("val", val);
    });
});
