import { Link, useLocation } from "react-router";
import { NavigationMenuItem } from "../ui/navigation-menu";
import { NavigationMenu, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

export const CustomMenu = () => {
    const { pathname } = useLocation();
    const isActive = (path: string) => pathname === path;
    return (
        <NavigationMenu>
            <NavigationMenuList className="flex gap-2 py-5">
                {/* Home */}
                <NavigationMenuItem>
                    <Link to="/" className={cn(isActive("/") ? "bg-slate-200" : "", "rounded-md p-2")}>
                        Inicio
                    </Link>
                </NavigationMenuItem>
                {/* Search */}

                <NavigationMenuItem>
                    <Link to="/search" className={cn(isActive("/search") ? "bg-slate-200" : "", "rounded-md p-2")}>
                        Buscar
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};
