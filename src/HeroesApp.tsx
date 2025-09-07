import { RouterProvider } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { appRouter } from "./router/app.routes";

const queryClient = new QueryClient();

export const HeroesApp = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={appRouter}></RouterProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
};
