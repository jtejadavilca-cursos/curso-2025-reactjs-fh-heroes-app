import { Link, useLocation } from "react-router";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator } from "../ui/breadcrumb";
import { useMemo } from "react";

const getBreadcrumbs = (paths: string[]): string[] => {
    if (paths.length <= 1 || (paths.length === 2 && paths[1] === "")) {
        return [];
    }

    return paths;
};

const toTitleCase = (value: string) => {
    if (!value || value.trim().length === 0) return "";

    return value.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
};

export const CustomBreadcrums = () => {
    const { pathname } = useLocation();
    const paths = useMemo(() => getBreadcrumbs(pathname.split("/")), [pathname]);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {paths.length > 0 && (
                    <>
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                    </>
                )}
                {/* {paths.slice(1).map((path) => {
                    return (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link to={`/${path}`}>{toTitleCase(path)}</Link>
                            </BreadcrumbItem>
                        </>
                    );
                })} */}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
