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
import { ParcNaturel } from "../types";
import ParcList from "../components/parcs/ParcsList";
import ParcForm from "../components/parcs/ParcForm";

const Parcs = () => {
  const [parcs, setParcs] = useState<ParcNaturel[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [currentParc, setCurrentParc] = useState<ParcNaturel | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadParcs();
  }, []);

  const loadParcs = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "parcs"), orderBy("nom", "asc"));
      const querySnapshot = await getDocs(q);
      const parcsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ParcNaturel[];
      setParcs(parcsData);
    } catch (error) {
      console.error("Erro ao carregar parques:", error);
      alert("Erro ao carregar parques.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (parcData: ParcNaturel) => {
    try {
      setFormLoading(true);

      if (currentParc?.id) {
        const docRef = doc(db, "parcs", currentParc.id);
        await updateDoc(docRef, {
          ...parcData,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, "parcs"), {
          ...parcData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await loadParcs();
      setShowForm(false);
      setCurrentParc(null);
    } catch (error) {
      console.error("Erro ao salvar parque:", error);
      alert("Erro ao salvar parque.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "parcs", id));
      await loadParcs();
    } catch (error) {
      console.error("Erro ao excluir parque:", error);
      alert("Erro ao excluir parque.");
    }
  };

  const handleEdit = (parc: ParcNaturel) => {
    setCurrentParc(parc);
    setShowForm(true);
  };

  const handleAdd = () => {
    setCurrentParc(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentParc(null);
  };

  if (showForm) {
    return (
      <ParcForm
        parc={currentParc || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={formLoading}
      />
    );
  }

  return (
    <ParcList
      parcs={parcs}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      loading={loading}
    />
  );
};

export default Parcs;
