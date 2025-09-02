import { RouterProvider } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { appRouter } from "./router/app.routes";
import { FavoriteHeroProvider } from "./heroes/context/FavoriteHeroContext";

const queryClient = new QueryClient();

export const HeroesApp = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <FavoriteHeroProvider>
                <RouterProvider router={appRouter} />
                <ReactQueryDevtools />
            </FavoriteHeroProvider>
        </QueryClientProvider>
    );
};
