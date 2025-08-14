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
import { ParcNaturel } from "../types";

const collectionName = 'parcs';

export interface ParcService {
    getAllParcs: () => Promise<ParcNaturel[]>;
    getParcById: (id: string) => Promise<ParcNaturel | null>;
    createParc: (parc: Omit<ParcNaturel, 'id'> & { id?: string }) => Promise<void>;
    updateParc: (id: string, data: Partial<ParcNaturel>) => Promise<void>;
    deleteParc: (id: string) => Promise<void>;
    importParcsFromJson: (parcs: ParcNaturel[]) => Promise<void>;
}

export const parcService: ParcService = {
    getAllParcs: async (): Promise<ParcNaturel[]> => {
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.docs.map((doc) => doc.data() as ParcNaturel);
    },

    getParcById: async (id: string): Promise<ParcNaturel | null> => {
        const ref = doc(db, collectionName, id);
        const snapshot = await getDoc(ref);
        return snapshot.exists() ? (snapshot.data() as ParcNaturel) : null;
    },

    createParc: async (parc: Omit<ParcNaturel, 'id'> & { id?: string }): Promise<void> => {
        const id = parc.id ?? crypto.randomUUID();
        await setDoc(doc(db, collectionName, id), { ...parc, id });
    },

    updateParc: async (id: string, data: Partial<ParcNaturel>): Promise<void> => {
        const ref = doc(db, collectionName, id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
            throw new Error(`Aucun parc avec l'id ${id}`);
        }
        await updateDoc(ref, data);
    },

    deleteParc: async (id: string): Promise<void> => {
        await deleteDoc(doc(db, collectionName, id));
    },

    importParcsFromJson: async (parcs: ParcNaturel[]): Promise<void> => {
        for (const parc of parcs) {
            const id = parc.id?.toString() ?? crypto.randomUUID();
            await setDoc(doc(db, collectionName, id), { ...parc, id });
        }
    }
};
