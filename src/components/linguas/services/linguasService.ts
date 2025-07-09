import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { LinguaNacional } from '../../../types';

const collectionName = 'linguasNacionais';

export const getAllLinguas = async (): Promise<LinguaNacional[]> => {
    const q = query(collection(db, collectionName), orderBy('nome'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as LinguaNacional[];
};

export const createLingua = async (data: LinguaNacional) => {
    return await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
};

export const updateLingua = async (id: string, data: Partial<LinguaNacional>) => {
    return await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: new Date(),
    });
};

export const deleteLingua = async (id: string) => {
    return await deleteDoc(doc(db, collectionName, id));
};

// ✅ Nouveau : importer plusieurs langues depuis un JSON
export const importLinguasFromJson = async (linguas: LinguaNacional[]) => {
    const batchPromises = linguas.map((lingua) =>
        addDoc(collection(db, collectionName), {
            ...lingua,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    );

    await Promise.all(batchPromises);
};
  