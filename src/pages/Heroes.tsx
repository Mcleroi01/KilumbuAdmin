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
import { HeroiNacional } from "../types";
import HeroList from "../components/heroes/HeroesList";
import HeroForm from "../components/heroes/HeroesForm";

const Heroes = () => {
  const [heroes, setHeroes] = useState<HeroiNacional[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [currentHero, setCurrentHero] = useState<HeroiNacional | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "heroes"), orderBy("nome", "asc"));
      const querySnapshot = await getDocs(q);
      const heroesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HeroiNacional[];
      setHeroes(heroesData);
    } catch (error) {
      console.error("Erro ao carregar heróis:", error);
      alert("Erro ao carregar heróis.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (heroData: HeroiNacional) => {
    try {
      setFormLoading(true);

      if (currentHero?.id) {
        const docRef = doc(db, "heroes", currentHero.id);
        await updateDoc(docRef, {
          ...heroData,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, "heroes"), {
          ...heroData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await loadHeroes();
      setShowForm(false);
      setCurrentHero(null);
    } catch (error) {
      console.error("Erro ao salvar herói:", error);
      alert("Erro ao salvar herói.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "heroes", id));
      await loadHeroes();
    } catch (error) {
      console.error("Erro ao excluir herói:", error);
      alert("Erro ao excluir herói.");
    }
  };

  const handleEdit = (hero: HeroiNacional) => {
    setCurrentHero(hero);
    setShowForm(true);
  };

  const handleAdd = () => {
    setCurrentHero(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentHero(null);
  };

  if (showForm) {
    return (
      <HeroForm
        hero={currentHero || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={formLoading}
      />
    );
  }

  return (
    <HeroList
      heroes={heroes}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      loading={loading}
    />
  );
};

export default Heroes;
