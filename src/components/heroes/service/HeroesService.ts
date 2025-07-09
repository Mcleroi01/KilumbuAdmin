import { db } from "../../../config/firebase";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import { HeroiNacional } from "../../../types";

const HERO_COLLECTION = "heroes";

export const getAllHeroes = async (): Promise<HeroiNacional[]> => {
    const snapshot = await getDocs(collection(db, HERO_COLLECTION));
    return snapshot.docs.map((doc) => doc.data() as HeroiNacional);
};

export const createHero = async (hero: HeroiNacional) => {
    const id = hero.id || crypto.randomUUID();
    await setDoc(doc(db, HERO_COLLECTION, id), { ...hero, id });
};

export const deleteHero = async (id: string) => {
    await deleteDoc(doc(db, HERO_COLLECTION, id));
};

export const importHeroesFromJson = async (data: HeroiNacional[]) => {
    for (const hero of data) {
        const id = hero.id || crypto.randomUUID();
        await setDoc(doc(db, HERO_COLLECTION, id), { ...hero, id });
    }
};
