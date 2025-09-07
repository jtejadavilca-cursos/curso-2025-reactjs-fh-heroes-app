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
    const { favoritesCount, favoritesPaginated, totalFavoritePages } = use(FavoriteHeroContext);

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
                    <TabsTrigger
                        onClick={() => handleClickTab("all")}
                        value="all"
                        data-testid="tab-trigger-summary-all-heroes"
                    >
                        All Characters ({summary?.totalHeroes})
                    </TabsTrigger>
                    <TabsTrigger
                        onClick={() => handleClickTab("favorites")}
                        value="favorites"
                        className="flex items-center gap-2"
                        data-testid="tab-trigger-summary-favorites-heroes"
                    >
                        <Heart className="h-4 w-4" />
                        Favorites ({favoritesCount})
                    </TabsTrigger>
                    <TabsTrigger
                        onClick={() => handleClickTab("hero")}
                        value="hero"
                        data-testid="tab-trigger-summary-only-heroes"
                    >
                        Heroes ({summary?.heroCount})
                    </TabsTrigger>
                    <TabsTrigger
                        onClick={() => handleClickTab("villain")}
                        value="villain"
                        data-testid="tab-trigger-summary-only-villain"
                    >
                        Villains ({summary?.villainCount})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" data-testid="tab-content-summary-all-heroes">
                    <h1>Todos los personales</h1>
                </TabsContent>
                <TabsContent value="favorites" data-testid="tab-content-summary-favorites-heroes">
                    <h1>Favoritos</h1>
                </TabsContent>
                <TabsContent value="hero" data-testid="tab-content-summary-only-heroes">
                    <h1>Héroes!</h1>
                </TabsContent>
                <TabsContent value="villain" data-testid="tab-content-summary-only-villain">
                    <h1>Villanos</h1>
                </TabsContent>
            </Tabs>

            {/* Character Grid */}
            {category === "favorites" ? (
                <HeroGrid heroes={favoritesPaginated} />
            ) : (
                <HeroGrid heroes={heroesResponse?.heroes ?? []} />
            )}

            {/* Pagination */}
            {category === "favorites" ? (
                <CustomPagination totalPages={totalFavoritePages} />
            ) : (
                <CustomPagination totalPages={heroesResponse?.pages ?? 0} />
            )}
        </>
    );
};

export default HomePage;
