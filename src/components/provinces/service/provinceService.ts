// services/provinceService.ts
import { db } from "../../../config/firebase";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    getDoc
} from 'firebase/firestore';
import { Province } from "../../../types";

const collectionName = 'provincias';

export const getAllProvinces = async (): Promise<Province[]> => {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id  // S'assurer que l'ID du document est inclus
    }) as Province);
};

export const getProvinceById = async (id: string): Promise<Province | null> => {
    const ref = doc(db, collectionName, id);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? (snapshot.data() as Province) : null;
};

export const createProvince = async (province: Omit<Province, 'id'>): Promise<string> => {
    const docRef = doc(collection(db, collectionName));
    await setDoc(docRef, { ...province, id: docRef.id });
    return docRef.id;
};

export const updateProvince = async (id: string, data: Partial<Province>): Promise<void> => {
    const ref = doc(db, collectionName, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        throw new Error(`Aucune province avec l'id ${id}`);
    }
    // Ne pas mettre à jour l'ID
    const { id: _, ...updateData } = data;
    await updateDoc(ref, updateData);
};


export const deleteProvince = async (id: string): Promise<void> => {
    if (!id) {
        throw new Error('ID de province invalide');
    }
    await deleteDoc(doc(db, collectionName, id));
};

export const importProvincesFromJson = async (provinces: Province[]): Promise<void> => {
    for (const province of provinces) {
        const id = province.id?.toString() ?? crypto.randomUUID();
        await setDoc(doc(db, collectionName, id), { ...province, id });
    }
};
