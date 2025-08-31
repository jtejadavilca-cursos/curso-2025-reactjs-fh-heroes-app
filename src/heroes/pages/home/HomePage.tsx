import { Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { useState } from "react";
import { CustomPagination } from "@/components/custom/CustomPagination";

type TabsType = "all" | "favorites" | "heroes" | "villians";
export const HomePage = () => {
    const [activeTab, setActiveTab] = useState<TabsType>("favorites");
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
            <Tabs value={activeTab} className="mb-8">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger onClick={() => setActiveTab("all")} value="all">
                        All Characters (16)
                    </TabsTrigger>
                    <TabsTrigger
                        onClick={() => setActiveTab("favorites")}
                        value="favorites"
                        className="flex items-center gap-2"
                    >
                        <Heart className="h-4 w-4" />
                        Favorites (3)
                    </TabsTrigger>
                    <TabsTrigger onClick={() => setActiveTab("heroes")} value="heroes">
                        Heroes (12)
                    </TabsTrigger>
                    <TabsTrigger onClick={() => setActiveTab("villians")} value="villains">
                        Villains (2)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <h1>Todos los personales</h1>
                </TabsContent>
                <TabsContent value="favorites">
                    <h1>Favoritos</h1>
                </TabsContent>
                <TabsContent value="heroes">
                    <h1>Héroes!</h1>
                </TabsContent>
                <TabsContent value="villians">
                    <h1>Villanos</h1>
                </TabsContent>
            </Tabs>

            {/* Results info */}
            {/* <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <p className="text-gray-600">Showing 6 of 16 characters</p>
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Filter className="h-3 w-3" />
                            Filtered
                        </Badge>
                    </div>
                </div> */}

            {/* Character Grid */}
            <HeroGrid />

            {/* Pagination */}
            <CustomPagination totalPages={8} />
        </>
    );
};

export default HomePage;
