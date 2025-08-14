import { db } from "../config/firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp
} from 'firebase/firestore';

interface BaseModel {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export class BaseService<T extends BaseModel> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async getAll(): Promise<T[]> {
    const snapshot = await getDocs(collection(db, this.collectionName));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return { id: docSnap.id, ...docSnap.data() } as T;
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = doc(collection(db, this.collectionName));
    const now = Timestamp.now();
    
    await setDoc(docRef, {
      ...data,
      createdAt: now,
      updatedAt: now
    });
    
    return docRef.id;
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  async query(conditions: { field: string; op: any; value: any }[], orderByField?: string, orderDirection: 'asc' | 'desc' = 'asc') {
    let q = query(collection(db, this.collectionName));
    
    // Apply where conditions
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.op, condition.value));
    });
    
    // Apply orderBy if specified
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }
}
