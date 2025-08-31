import { RouterProvider } from "react-router";
import { appRouter } from "./router/app.routes";

export const HeroesApp = () => {
    return (
        <>
            <RouterProvider router={appRouter} />
        </>
    );
};
