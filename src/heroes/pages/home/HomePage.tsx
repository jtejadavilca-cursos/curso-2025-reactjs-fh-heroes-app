import { use } from "react";
import { Heart } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { useSearchParams } from "react-router";
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext";

type TabsType = "all" | "favorites" | "hero" | "villain";

export const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const category = searchParams.get("tab") ?? "all";
    const page = searchParams.get("page") ?? 1;
    const limit = searchParams.get("limit") ?? 6;

    const { data: heroesResponse } = usePaginatedHero(+page, +limit, category);
    const { data: summary } = useHeroSummary();
    const { favoritesCount, favorites } = use(FavoriteHeroContext);

    const handleClickTab = (category: TabsType) => {
        setSearchParams((prev) => {
            prev.set("tab", category);
            prev.set("page", "1");
            return prev;
        });
    };

    return (
        <>
            {/* Header */}
            <CustomJumbotron
                title="Universo de Superheroes!"
                description="Descubre, explora, y administra tus superhéroes y villanos favoritos!"
            />

            {/* Stats Dashboard */}
            <HeroStats />

            {/* Tabs */}
            <Tabs value={category} className="mb-8">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger onClick={() => handleClickTab("all")} value="all">
                        All Characters ({summary?.totalHeroes})
                    </TabsTrigger>
                    <TabsTrigger
                        onClick={() => handleClickTab("favorites")}
                        value="favorites"
                        className="flex items-center gap-2"
                    >
                        <Heart className="h-4 w-4" />
                        Favorites ({favoritesCount})
                    </TabsTrigger>
                    <TabsTrigger onClick={() => handleClickTab("hero")} value="hero">
                        Heroes ({summary?.heroCount})
                    </TabsTrigger>
                    <TabsTrigger onClick={() => handleClickTab("villain")} value="villain">
                        Villains ({summary?.villainCount})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <h1>Todos los personales</h1>
                </TabsContent>
                <TabsContent value="favorites">
                    <h1>Favoritos</h1>
                </TabsContent>
                <TabsContent value="hero">
                    <h1>Héroes!</h1>
                </TabsContent>
                <TabsContent value="villain">
                    <h1>Villanos</h1>
                </TabsContent>
            </Tabs>

            {/* Character Grid */}
            {category === "favorites" ? (
                <HeroGrid heroes={favorites} />
            ) : (
                <HeroGrid heroes={heroesResponse?.heroes ?? []} />
            )}

            {/* Pagination */}
            <CustomPagination totalPages={heroesResponse?.pages ?? 0} />
        </>
    );
};

export default HomePage;
