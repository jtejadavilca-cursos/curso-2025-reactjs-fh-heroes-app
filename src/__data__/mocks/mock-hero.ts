import type { Hero } from "@/heroes/types/hero.interface";
export const mockHero = {
    id: 123,
    name: "My Test hero",
} as unknown as Hero;

export const mockHeros = [
    {
        id: 123,
        name: "My Test hero 123",
    },
    {
        id: 234,
        name: "My Test hero 234",
    },
    {
        id: 456,
        name: "My Test hero 456",
    },
    {
        id: 678,
        name: "My Test hero 678",
    },
    {
        id: 891,
        name: "My Test hero 891",
    },
] as unknown as Hero[];
