import { useState, useEffect } from 'react';
import { Musica } from '../../types/modules';
import { MusicaCard } from '../../components/musica/MusicaCard';
import { MusicaForm } from '../../components/musica/MusicaForm';
import { musicaService } from '../../services/musicaService';
import { toast } from 'react-toastify';

const MusicaPage = () => {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [currentMusica, setCurrentMusica] = useState<Musica | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Charger les musiques
  const loadMusicas = async () => {
    try {
      setIsLoading(true);
      const data = await musicaService.getAll();
      setMusicas(data);
    } catch (error) {
      console.error('Erreur lors du chargement des musiques:', error);
      toast.error('Erreur lors du chargement des musiques');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMusicas();
  }, []);

  // Gérer la soumission du formulaire (création et mise à jour)
  const handleSubmit = async (musicaData: Musica) => {
    try {
      setIsSubmitting(true);
      
      if (currentMusica?.id) {
        // Mise à jour d'une musique existante
        await musicaService.update(currentMusica.id, musicaData);
        toast.success('Musique mise à jour avec succès');
      } else {
        // Création d'une nouvelle musique
        await musicaService.create(musicaData);
        toast.success('Musique ajoutée avec succès');
      }
      
      setShowForm(false);
      setCurrentMusica(null);
      loadMusicas(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la musique:', error);
      toast.error('Erreur lors de la sauvegarde de la musique');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la suppression d'une musique
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette musique ?')) {
      try {
        await musicaService.delete(id);
        toast.success('Musique supprimée avec succès');
        loadMusicas(); // Recharger la liste
      } catch (error) {
        console.error('Erreur lors de la suppression de la musique:', error);
        toast.error('Erreur lors de la suppression de la musique');
      }
    }
  };

  // Gérer la lecture/arrêt de la musique
  const handlePlayToggle = (musica: Musica) => {
    if (currentlyPlaying === musica.id) {
      setCurrentlyPlaying(null);
      // Arrêter la lecture audio ici si nécessaire
    } else {
      setCurrentlyPlaying(musica.id || null);
      // Démarrer la lecture audio ici si nécessaire
    }
  };

  // Filtrer les musiques en fonction des critères de recherche
  const filteredMusicas = musicas.filter((musica) => {
    const matchesSearch = 
      musica.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      musica.artista.toLowerCase().includes(searchTerm.toLowerCase()) ||
      musica.letra.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesGenre = selectedGenre ? musica.genero === selectedGenre : true;
    const matchesRegion = selectedRegion ? musica.regiao === selectedRegion : true;
    
    return matchesSearch && matchesGenre && matchesRegion;
  });

  // Extraire les genres uniques pour le filtre
  const genres = Array.from(new Set(musicas.map((m) => m.genero)));
  
  // Extraire les régions uniques pour le filtre
  const regioes = Array.from(new Set(musicas.map((m) => m.regiao)));

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Musiques</h1>
        <button
          onClick={() => {
            setCurrentMusica(null);
            setShowForm(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition duration-200"
        >
          Ajouter une musique
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              placeholder="Rechercher par titre, artiste ou paroles..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              id="genre"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">Tous les genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Région
            </label>
            <select
              id="region"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">Toutes les régions</option>
              {regioes.map((regiao) => (
                <option key={regiao} value={regiao}>
                  {regiao}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Formulaire de création/édition */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentMusica ? 'Modifier la musique' : 'Ajouter une nouvelle musique'}
          </h2>
          <MusicaForm 
            initialData={currentMusica || undefined}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
          <div className="mt-4">
            <button
              onClick={() => {
                setShowForm(false);
                setCurrentMusica(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des musiques */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredMusicas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMusicas.map((musica) => (
            <MusicaCard
              key={musica.id}
              musica={musica}
              onEdit={(m) => {
                setCurrentMusica(m);
                setShowForm(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={handleDelete}
              isPlaying={currentlyPlaying === musica.id}
              onPlayToggle={handlePlayToggle}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Aucune musique trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedGenre || selectedRegion
              ? 'Aucune musique ne correspond à vos critères de recherche.'
              : 'Commencez par ajouter votre première musique.'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('');
                setSelectedRegion('');
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Ajouter une musique
            </button>
          </div>
        </div>
      )}
      
      {/* Pagination (à implémenter si nécessaire) */}
      {filteredMusicas.length > 0 && (
        <div className="mt-6 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              disabled
            >
              <span className="sr-only">Précédent</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              aria-current="page"
              className="z-10 bg-orange-50 border-orange-500 text-orange-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              1
            </button>
            <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
              2
            </button>
            <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
              3
            </button>
            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">Suivant</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MusicaPage;
