import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "./ui/SearchControls";

export const SearchPage = () => {
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
        </>
    );
};

export default SearchPage;
