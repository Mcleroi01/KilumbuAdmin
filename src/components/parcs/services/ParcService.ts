import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ParcNaturel } from "../../../types";

const collectionName = "parcs";

export const getAllParcs = async (): Promise<ParcNaturel[]> => {
    const q = query(collection(db, collectionName), orderBy("nom"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as ParcNaturel[];
};

export const createParc = async (data: ParcNaturel) => {
    return await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
};

export const updateParc = async (id: string, data: Partial<ParcNaturel>) => {
    return await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: new Date(),
    });
};

export const deleteParc = async (id: string) => {
    return await deleteDoc(doc(db, collectionName, id));
};

export const importParcsFromJson = async (parcs: ParcNaturel[]) => {
    const batch = parcs.map((parc) =>
        addDoc(collection(db, collectionName), {
            ...parc,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    );
    await Promise.all(batch);
};