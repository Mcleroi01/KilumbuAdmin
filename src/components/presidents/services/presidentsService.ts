import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { President } from '../../../types';

const collectionName = 'presidents';

export const getAllPresidents = async (): Promise<President[]> => {
    const q = query(collection(db, collectionName), orderBy('nom'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as President[];
};

export const createPresident = async (data: President) => {
    return await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
};

export const updatePresident = async (id: string, data: Partial<President>) => {
    return await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: new Date(),
    });
};

export const deletePresident = async (id: string) => {
    return await deleteDoc(doc(db, collectionName, id));
};

export const importPresidentsFromJson = async (data: President[]) => {
    const batch = data.map(async (president) => {
        await addDoc(collection(db, collectionName), {
            ...president,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    });

    await Promise.all(batch);
};
  