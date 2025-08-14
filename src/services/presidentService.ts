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
import { President } from "../types";

const collectionName = 'presidents';

export interface PresidentService {
    getAllPresidents: () => Promise<President[]>;
    getPresidentById: (id: string) => Promise<President | null>;
    createPresident: (president: Omit<President, 'id'> & { id?: string }) => Promise<void>;
    updatePresident: (id: string, data: Partial<President>) => Promise<void>;
    deletePresident: (id: string) => Promise<void>;
    importPresidentsFromJson: (presidents: President[]) => Promise<void>;
}

export const presidentService: PresidentService = {
    getAllPresidents: async (): Promise<President[]> => {
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.docs.map((doc) => doc.data() as President);
    },

    getPresidentById: async (id: string): Promise<President | null> => {
        const ref = doc(db, collectionName, id);
        const snapshot = await getDoc(ref);
        return snapshot.exists() ? (snapshot.data() as President) : null;
    },

    createPresident: async (president: Omit<President, 'id'> & { id?: string }): Promise<void> => {
        const id = president.id ?? crypto.randomUUID();
        await setDoc(doc(db, collectionName, id), { ...president, id });
    },

    updatePresident: async (id: string, data: Partial<President>): Promise<void> => {
        const ref = doc(db, collectionName, id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
            throw new Error(`Aucun président avec l'id ${id}`);
        }
        await updateDoc(ref, data);
    },

    deletePresident: async (id: string): Promise<void> => {
        await deleteDoc(doc(db, collectionName, id));
    },

    importPresidentsFromJson: async (presidents: President[]): Promise<void> => {
        for (const president of presidents) {
            const id = president.id?.toString() ?? crypto.randomUUID();
            await setDoc(doc(db, collectionName, id), { ...president, id });
        }
    }
};
