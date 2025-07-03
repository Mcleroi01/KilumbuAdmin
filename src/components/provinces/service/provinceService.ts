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
    return snapshot.docs.map((doc) => doc.data() as Province);
};

export const getProvinceById = async (id: string): Promise<Province | null> => {
    const ref = doc(db, collectionName, id);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? (snapshot.data() as Province) : null;
};

export const createProvince = async (province: Province): Promise<void> => {
    const id = province.id ?? crypto.randomUUID();
    await setDoc(doc(db, collectionName, id), { ...province, id });
};

export const updateProvince = async (id: string, data: Partial<Province>): Promise<void> => {
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, data);
};

export const deleteProvince = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, collectionName, id));
};

export const importProvincesFromJson = async (provinces: Province[]): Promise<void> => {
    for (const province of provinces) {
        const id = province.id?.toString() ?? crypto.randomUUID();
        await setDoc(doc(db, collectionName, id), { ...province, id });
    }
};
