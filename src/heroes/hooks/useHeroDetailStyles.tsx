// const mapStatusColors = new Map<HeroStatus, string>();
const mapStatusColors = new Map<string, string>();
mapStatusColors.set("activo", "bg-green-500");
mapStatusColors.set("inactivo", "bg-gray-500");
mapStatusColors.set("retirado", "bg-blue-500");

// const mapCategoryColors = new Map<HeroCategory, string>();
const mapCategoryColors = new Map<string, string>();
mapCategoryColors.set("héroe", "bg-blue-500");
mapCategoryColors.set("villano", "bg-red-500");
mapCategoryColors.set("antihéroe", "bg-purple-500");

const getStatusColor = (status: string) => mapStatusColors.get(status.toLowerCase()) ?? "bg-gray-500";
const getCategoryColor = (category: string) => mapCategoryColors.get(category.toLowerCase()) ?? "bg-gray-500";

export const useHeroDetailStyles = () => {
    return {
        getStatusColor,
        getCategoryColor,
    };
};
