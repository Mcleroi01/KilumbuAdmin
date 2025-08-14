import { useState, useEffect } from 'react';
import { Historia } from '../../types/modules';
import { HistoriaCard } from '../../components/historia/HistoriaCard';
import { HistoriaForm } from '../../components/historia/HistoriaForm';
import { historiaService } from '../../services/historiaService';
import { toast } from 'react-toastify';

const HistoriaPage = () => {
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [currentHistoria, setCurrentHistoria] = useState<Historia | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  // Charger les histoires
  const loadHistorias = async () => {
    try {
      setIsLoading(true);
      const data = await historiaService.getAll();
      setHistorias(data);
    } catch (error) {
      console.error('Erreur lors du chargement des histoires:', error);
      toast.error('Erreur lors du chargement des histoires');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistorias();
  }, []);

  // Gérer la soumission du formulaire (création et mise à jour)
  const handleSubmit = async (historiaData: Historia) => {
    try {
      setIsSubmitting(true);
      
      if (currentHistoria?.id) {
        // Mise à jour d'une histoire existante
        await historiaService.update(currentHistoria.id, historiaData);
        toast.success('Histoire mise à jour avec succès');
      } else {
        // Création d'une nouvelle histoire
        await historiaService.create(historiaData);
        toast.success('Histoire ajoutée avec succès');
      }
      
      setShowForm(false);
      setCurrentHistoria(null);
      loadHistorias(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'histoire:', error);
      toast.error('Erreur lors de la sauvegarde de l\'histoire');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la suppression d'une histoire
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette histoire ?')) {
      try {
        await historiaService.delete(id);
        toast.success('Histoire supprimée avec succès');
        loadHistorias(); // Recharger la liste
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'histoire:', error);
        toast.error('Erreur lors de la suppression de l\'histoire');
      }
    }
  };

  // Filtrer les histoires en fonction des critères de recherche
  const filteredHistorias = historias.filter((historia) => {
    const matchesSearch = 
      historia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (historia.subtitulo?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      historia.conteudo.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesPeriod = selectedPeriod ? historia.periodoHistorico === selectedPeriod : true;
    const matchesLocation = selectedLocation ? 
      (historia.localizacao?.toLowerCase().includes(selectedLocation.toLowerCase()) || false) : true;
    
    return matchesSearch && matchesPeriod && matchesLocation;
  });

  // Extraire les périodes uniques pour le filtre
  const periodos = Array.from(new Set(historias.map((h) => h.periodoHistorico)));
  
  // Extraire les localisations uniques pour le filtre
  const localizacoes = Array.from(
    new Set(
      historias
        .map((h) => h.localizacao)
        .filter((l): l is string => !!l)
    )
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Histoires</h1>
        <button
          onClick={() => {
            setCurrentHistoria(null);
            setShowForm(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition duration-200"
        >
          Ajouter une histoire
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              placeholder="Rechercher par titre, sous-titre ou contenu..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">
              Période historique
            </label>
            <select
              id="periodo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="">Toutes les périodes</option>
              {periodos.map((periodo) => (
                <option key={periodo} value={periodo}>
                  {periodo}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700 mb-1">
              Localisation
            </label>
            <select
              id="localizacao"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Tous les lieux</option>
              {localizacoes.map((local) => (
                <option key={local} value={local}>
                  {local}
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
            {currentHistoria ? 'Modifier l\'histoire' : 'Ajouter une nouvelle histoire'}
          </h2>
          <HistoriaForm 
            initialData={currentHistoria || undefined}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
          <div className="mt-4">
            <button
              onClick={() => {
                setShowForm(false);
                setCurrentHistoria(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des histoires */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredHistorias.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHistorias.map((historia) => (
            <HistoriaCard
              key={historia.id}
              historia={historia}
              onEdit={(h) => {
                setCurrentHistoria(h);
                setShowForm(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={handleDelete}
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Aucune histoire trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedPeriod || selectedLocation
              ? 'Aucune histoire ne correspond à vos critères de recherche.'
              : 'Commencez par ajouter votre première histoire.'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedPeriod('');
                setSelectedLocation('');
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
              Ajouter une histoire
            </button>
          </div>
        </div>
      )}
      
      {/* Pagination (à implémenter si nécessaire) */}
      {filteredHistorias.length > 0 && (
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

export default HistoriaPage;
