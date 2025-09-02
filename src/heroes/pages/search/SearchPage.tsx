import { useSearchParams } from "react-router";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { useHeroSearch } from "@/heroes/hooks/useHeroSearch";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { SearchControls } from "./ui/SearchControls";

export const SearchPage = () => {
    const [searchParams] = useSearchParams();

    const { data: searchResult } = useHeroSearch({
        name: searchParams.get("name") ?? undefined,
        strength: searchParams.get("strength") ? Number(searchParams.get("strength")) : undefined,
    });

    return (
        <>
            {/* Header */}
            <CustomJumbotron
                title="Búsqueda de Superheroes!"
                description="Descubre, explora, y administra tus superhéroes y villanos favoritos!"
            />

            {/* Stats Dashboard */}
            <HeroStats />
            {/* Controls */}
            <SearchControls />

            {/* Search Result */}
            <HeroGrid heroes={searchResult ?? []} />
        </>
    );
};

export default SearchPage;
