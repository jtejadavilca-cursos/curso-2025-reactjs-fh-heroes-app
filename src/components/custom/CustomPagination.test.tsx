import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { CustomPagination } from "./CustomPagination";
import { MemoryRouter } from "react-router";
import { type PropsWithChildren } from "react";

vi.mock("../ui/button", () => ({
    Button: ({ children, ...props }: PropsWithChildren) => <button {...props}>{children}</button>,
}));

const renderWithRouter = (element: React.ReactElement, initialEntries?: string[]) => {
    return render(<MemoryRouter initialEntries={initialEntries}>{element}</MemoryRouter>);
};

describe("Testing CustomPagination.test", () => {
    test("should be defined with default values", () => {
        const { container } = renderWithRouter(<CustomPagination totalPages={3} />);

        expect(container).toMatchSnapshot();

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
    });

    test("should disable next button when we are in the last page", () => {
        renderWithRouter(<CustomPagination totalPages={5} />, ["/?page=5"]);
        const previousButton = screen.getByText("Anterior");
        const nextButton = screen.getByText("Siguiente");

        expect(nextButton).toBeDefined();
        expect(nextButton.getAttribute("disabled")).not.toBeNull();

        expect(previousButton).toBeDefined();
        expect(previousButton.getAttribute("disabled")).toBeNull();
    });

    test("should be next and previous buttons enabled when we are neither first nor last page", () => {
        const selectedPage = 3;
        const totalPage = 5;

        renderWithRouter(<CustomPagination totalPages={totalPage} />, [`/?page=${selectedPage}`]);
        const previousButton = screen.getByText("Anterior");
        const nextButton = screen.getByText("Siguiente");
        const selectedButton = screen.getByTestId(`id-${selectedPage}`);

        expect(selectedButton.innerHTML).toContain(`${selectedPage}`);
        expect(selectedButton.getAttribute("variant")).toBe("default");

        const listOfPages = Array.from({ length: totalPage }).map((_, index) => index + 1);

        listOfPages.forEach((p) => {
            const btn = screen.getByTestId(`id-${p}`);

            if (p === selectedPage) {
                expect(btn.innerHTML).toContain(`${selectedPage}`);
                expect(btn.getAttribute("variant")).toBe("default");
            } else {
                expect(btn.innerHTML).toContain(`${p}`);
                expect(btn.getAttribute("variant")).toBe("outline");
            }
        });

        expect(nextButton).toBeDefined();
        expect(nextButton.getAttribute("disabled")).toBeNull();

        expect(previousButton).toBeDefined();
        expect(previousButton.getAttribute("disabled")).toBeNull();

        //screen.debug();
    });

    test("should change page when click on number button", () => {
        const selectedPage = 4;
        const totalPage = 10;
        const clickedPage = 7;

        renderWithRouter(<CustomPagination totalPages={totalPage} />, [`/?page=${selectedPage}`]);
        const previousButton = screen.getByText("Anterior");
        const nextButton = screen.getByText("Siguiente");

        // console.log(`Selected button page should be ${selectdPage}`)
        const selectedButton = screen.getByTestId(`id-${selectedPage}`);
        expect(selectedButton.innerHTML).toContain(`${selectedPage}`);
        expect(selectedButton.getAttribute("variant")).toBe("default");

        // console.log(`When click in next button, new selected button page should be ${selectdPage + 1}`)
        fireEvent.click(nextButton);
        const newSelectedButton = screen.getByTestId(`id-${selectedPage + 1}`);
        expect(newSelectedButton.innerHTML).toContain(`${selectedPage + 1}`);
        expect(newSelectedButton.getAttribute("variant")).toBe("default");

        // console.log(`Old selected shouldn't have attributes of selected`)
        expect(selectedButton.getAttribute("variant")).toBe("outline");

        // console.log(`When click in previous button, old selected button should be selected again`)
        fireEvent.click(previousButton);
        expect(selectedButton.innerHTML).toContain(`${selectedPage}`);
        expect(selectedButton.getAttribute("variant")).toBe("default");

        // console.log(`When click ${clickedPage} it should have attributes of selected`),
        const clickedButton = screen.getByTestId(`id-${clickedPage}`);
        fireEvent.click(clickedButton);

        // console.log(`next and previous buttons shouln't be disabled`),
        expect(nextButton).toBeDefined();
        expect(nextButton.getAttribute("disabled")).toBeNull();

        expect(previousButton).toBeDefined();
        expect(previousButton.getAttribute("disabled")).toBeNull();

        //console.log(`And finally the other ones shouldn't have attributes of selected`),
        const listOfPages = Array.from({ length: totalPage }).map((_, index) => index + 1);

        listOfPages.forEach((p) => {
            const btn = screen.getByTestId(`id-${p}`);

            if (p === clickedPage) {
                expect(btn.innerHTML).toContain(`${clickedPage}`);
                expect(btn.getAttribute("variant")).toBe("default");
            } else {
                expect(btn.innerHTML).toContain(`${p}`);
                expect(btn.getAttribute("variant")).toBe("outline");
            }
        });

        //screen.debug();
    });
});
