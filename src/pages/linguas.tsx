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
import { LinguaNacional } from "../types";
import LinguaList from "../components/linguas/LinguaList";
import LinguaForm from "../components/linguas/LinguaForm";

const Linguas = () => {
  const [linguas, setLinguas] = useState<LinguaNacional[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [currentLingua, setCurrentLingua] = useState<LinguaNacional | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadLinguas();
  }, []);

  const loadLinguas = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "linguas"), orderBy("nome", "asc"));
      const querySnapshot = await getDocs(q);
      const linguasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LinguaNacional[];
      setLinguas(linguasData);
    } catch (error) {
      console.error("Erro ao carregar línguas:", error);
      alert("Erro ao carregar línguas.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (linguaData: LinguaNacional) => {
    try {
      setFormLoading(true);

      if (currentLingua?.id) {
        const docRef = doc(db, "linguas", currentLingua.id);
        await updateDoc(docRef, {
          ...linguaData,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, "linguas"), {
          ...linguaData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await loadLinguas();
      setShowForm(false);
      setCurrentLingua(null);
    } catch (error) {
      console.error("Erro ao salvar língua:", error);
      alert("Erro ao salvar língua.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "linguas", id));
      await loadLinguas();
    } catch (error) {
      console.error("Erro ao excluir língua:", error);
      alert("Erro ao excluir língua.");
    }
  };

  const handleEdit = (lingua: LinguaNacional) => {
    setCurrentLingua(lingua);
    setShowForm(true);
  };

  const handleAdd = () => {
    setCurrentLingua(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentLingua(null);
  };

  if (showForm) {
    return (
      <LinguaForm
        lingua={currentLingua || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={formLoading}
      />
    );
  }

  return (
    <LinguaList
      linguas={linguas}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      loading={loading}
    />
  );
};

export default Linguas;
