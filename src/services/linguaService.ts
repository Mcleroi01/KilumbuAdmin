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
import { LinguaNacional } from "../types";

const collectionName = 'linguasNacionais';

export interface LinguaService {
    getAllLinguas: () => Promise<LinguaNacional[]>;
    getLinguaById: (id: string) => Promise<LinguaNacional | null>;
    createLingua: (lingua: Omit<LinguaNacional, 'id'> & { id?: string }) => Promise<void>;
    updateLingua: (id: string, data: Partial<LinguaNacional>) => Promise<void>;
    deleteLingua: (id: string) => Promise<void>;
    importLinguasFromJson: (linguas: LinguaNacional[]) => Promise<void>;
}

export const linguaService: LinguaService = {
    getAllLinguas: async (): Promise<LinguaNacional[]> => {
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.docs.map((doc) => doc.data() as LinguaNacional);
    },

    getLinguaById: async (id: string): Promise<LinguaNacional | null> => {
        const ref = doc(db, collectionName, id);
        const snapshot = await getDoc(ref);
        return snapshot.exists() ? (snapshot.data() as LinguaNacional) : null;
    },

    createLingua: async (lingua: Omit<LinguaNacional, 'id'> & { id?: string }): Promise<void> => {
        const id = lingua.id ?? crypto.randomUUID();
        await setDoc(doc(db, collectionName, id), { ...lingua, id });
    },

    updateLingua: async (id: string, data: Partial<LinguaNacional>): Promise<void> => {
        const ref = doc(db, collectionName, id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
            throw new Error(`Aucune langue nationale avec l'id ${id}`);
        }
        await updateDoc(ref, data);
    },

    deleteLingua: async (id: string): Promise<void> => {
        await deleteDoc(doc(db, collectionName, id));
    },

    importLinguasFromJson: async (linguas: LinguaNacional[]): Promise<void> => {
        for (const lingua of linguas) {
            const id = lingua.id?.toString() ?? crypto.randomUUID();
            await setDoc(doc(db, collectionName, id), { ...lingua, id });
        }
    }
};
