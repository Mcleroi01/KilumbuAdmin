import { db } from "../config/firebase";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    getDoc
} from 'firebase/firestore';
import { HeroiNacional } from "../types";

const collectionName = 'heroes';

export interface HeroService {
    getAllHeroes: () => Promise<HeroiNacional[]>;
    getHeroById: (id: string) => Promise<HeroiNacional | null>;
    createHero: (hero: Omit<HeroiNacional, 'id'> & { id?: string }) => Promise<void>;
    updateHero: (id: string, data: Partial<HeroiNacional>) => Promise<void>;
    deleteHero: (id: string) => Promise<void>;
    importHeroesFromJson: (heroes: HeroiNacional[]) => Promise<void>;
}

export const heroService: HeroService = {
    getAllHeroes: async (): Promise<HeroiNacional[]> => {
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.docs.map((doc) => doc.data() as HeroiNacional);
    },

    getHeroById: async (id: string): Promise<HeroiNacional | null> => {
        const ref = doc(db, collectionName, id);
        const snapshot = await getDoc(ref);
        return snapshot.exists() ? (snapshot.data() as HeroiNacional) : null;
    },

    createHero: async (hero: Omit<HeroiNacional, 'id'> & { id?: string }): Promise<void> => {
        const id = hero.id ?? crypto.randomUUID();
        await setDoc(doc(db, collectionName, id), { ...hero, id });
    },

    updateHero: async (id: string, data: Partial<HeroiNacional>): Promise<void> => {
        const ref = doc(db, collectionName, id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
            throw new Error(`Aucun héros national avec l'id ${id}`);
        }
        await updateDoc(ref, data);
    },

    deleteHero: async (id: string): Promise<void> => {
        await deleteDoc(doc(db, collectionName, id));
    },

    importHeroesFromJson: async (heroes: HeroiNacional[]): Promise<void> => {
        for (const hero of heroes) {
            const id = hero.id?.toString() ?? crypto.randomUUID();
            await setDoc(doc(db, collectionName, id), { ...hero, id });
        }
    }
};
