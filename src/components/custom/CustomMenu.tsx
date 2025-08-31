import { Link, useLocation } from "react-router";
import { NavigationMenuItem, NavigationMenuLink } from "../ui/navigation-menu";
import { NavigationMenu, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

export const CustomMenu = () => {
    const { pathname } = useLocation();
    const isActive = (path: string) => pathname === path;
    return (
        <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
                {/* Home */}
                <NavigationMenuItem>
                    <NavigationMenuLink className={cn(isActive("/") ? "bg-slate-200" : "", "rounded-md p-2")}>
                        <Link to="/">Inicio</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                {/* Search */}

                <NavigationMenuItem>
                    <NavigationMenuLink className={cn(isActive("/search") ? "bg-slate-200" : "", "rounded-md p-2")}>
                        <Link to="/search">Buscar</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};
