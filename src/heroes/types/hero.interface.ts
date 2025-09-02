// export type HeroStatus = "activo" | "inactivo" | "retirado";
// export type HeroCategory = "héroe" | "villano" | "antihéroe";

export interface Hero {
    id: string;
    name: string;
    slug: string;
    alias: string;
    powers: string[];
    description: string;
    strength: number;
    intelligence: number;
    speed: number;
    durability: number;
    team: string;
    image: string;
    firstAppearance: string;
    status: string; //HeroStatus;
    category: string; //HeroCategory;
    universe: string;
}
