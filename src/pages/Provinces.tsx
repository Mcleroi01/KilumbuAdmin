import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  getDocs,
  orderBy,
  query 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Province } from '../types';
import ProvinceList from '../components/provinces/ProvinceList';
import ProvinceForm from '../components/provinces/ProvinceForm';

const Provinces = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [currentProvince, setCurrentProvince] = useState<Province | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'provinces'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      const provincesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Province[];
      setProvinces(provincesData);
    } catch (error) {
      console.error('Erro ao carregar províncias:', error);
      alert('Erro ao carregar províncias. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (provinceData: Province) => {
    try {
      setFormLoading(true);

      if (currentProvince?.id) {
        // Update existing province
        const docRef = doc(db, 'provinces', currentProvince.id);
        await updateDoc(docRef, {
          ...provinceData,
          updatedAt: new Date()
        });
      } else {
        // Add new province
        await addDoc(collection(db, 'provinces'), {
          ...provinceData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await loadProvinces();
      setShowForm(false);
      setCurrentProvince(null);
    } catch (error) {
      console.error('Erro ao salvar província:', error);
      alert('Erro ao salvar província. Tente novamente.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (province: Province) => {
    setCurrentProvince(province);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'provinces', id));
      await loadProvinces();
    } catch (error) {
      console.error('Erro ao excluir província:', error);
      alert('Erro ao excluir província. Tente novamente.');
    }
  };

  const handleAdd = () => {
    setCurrentProvince(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentProvince(null);
  };

  if (showForm) {
    return (
      <ProvinceForm
        province={currentProvince || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={formLoading}
      />
    );
  }

  return (
    <ProvinceList
      provinces={provinces}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      loading={loading}
    />
  );
};

export default Provinces;