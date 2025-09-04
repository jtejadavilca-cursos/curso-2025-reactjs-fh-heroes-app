import { useQuery } from "@tanstack/react-query";
import { getHeroeByIdOsSlugAction } from "../actions/get-hero.action";

export const useHeroDetail = (idSlug: string) => {
    const { data: superheroData } = useQuery({
        queryKey: ["heroes", "idSlug", idSlug],
        queryFn: () => getHeroeByIdOsSlugAction(idSlug),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    const totalPower = superheroData
        ? superheroData.strength + superheroData.intelligence + superheroData.speed + superheroData.durability
        : 0;
    const averagePower = Math.round((totalPower / 4) * 10);

    return {
        superheroData,
        totalPower,
        averagePower,
    };
};
