import { useState, useEffect } from "react";
import { HeroiNacional } from "../types";
import HeroList from "../components/heroes/HeroesList";
import HeroForm from "../components/heroes/HeroesForm";
import { heroService } from "../services";

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
      const heroesData = await heroService.getAllHeroes();
      // Trier par nom après avoir récupéré les données
      const sortedHeroes = [...heroesData].sort((a, b) => 
        a.nome.localeCompare(b.nome)
      );
      setHeroes(sortedHeroes);
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
        // Mise à jour d'un héros existant
        await heroService.updateHero(currentHero.id, {
          ...heroData,
          updatedAt: new Date(),
        });
      } else {
        // Création d'un nouveau héros
        await heroService.createHero({
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
    if (!window.confirm("Tem certeza que deseja excluir este herói?")) {
      return;
    }

    try {
      await heroService.deleteHero(id);
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
