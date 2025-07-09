import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { President } from "../types";
import PresidentList from "../components/presidents/PresidentList";
import PresidentForm from "../components/presidents/PresidentForm";

const Presidents = () => {
  const [presidents, setPresidents] = useState<President[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [currentPresident, setCurrentPresident] = useState<President | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadPresidents();
  }, []);

  const loadPresidents = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "presidents"), orderBy("nom", "asc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as President[];
      setPresidents(data);
    } catch (error) {
      console.error("Erro ao carregar presidentes:", error);
      alert("Erro ao carregar presidentes.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (presidentData: President) => {
    try {
      setFormLoading(true);

      if (currentPresident?.id) {
        const docRef = doc(db, "presidents", currentPresident.id);
        await updateDoc(docRef, {
          ...presidentData,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, "presidents"), {
          ...presidentData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await loadPresidents();
      setShowForm(false);
      setCurrentPresident(null);
    } catch (error) {
      console.error("Erro ao salvar presidente:", error);
      alert("Erro ao salvar presidente.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "presidents", id));
      await loadPresidents();
    } catch (error) {
      console.error("Erro ao excluir presidente:", error);
      alert("Erro ao excluir presidente.");
    }
  };

  const handleEdit = (president: President) => {
    setCurrentPresident(president);
    setShowForm(true);
  };

  const handleAdd = () => {
    setCurrentPresident(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentPresident(null);
  };

  if (showForm) {
    return (
      <PresidentForm
        president={currentPresident || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={formLoading}
      />
    );
  }

  return (
    <PresidentList
      presidents={presidents}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      loading={loading}
    />
  );
};

export default Presidents;
