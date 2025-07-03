import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, MapPin, Users } from "lucide-react";
import { Province } from "../../types";
import {
  importProvincesFromJson,
  getAllProvinces,
  deleteProvince as deleteProvinceService,
} from "./service/provinceService";

interface ProvinceListProps {
  onEdit: (province: Province) => void;
  onAdd: () => void;
}

const ProvinceList = ({ onEdit, onAdd }: ProvinceListProps) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProvinces();
      setProvinces(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta província?")) {
      setDeleteId(id);
      await deleteProvinceService(id);
      setProvinces((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
    }
  };

  const handleJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        if (!Array.isArray(data)) {
          alert("O ficheiro deve conter uma lista de províncias.");
          return;
        }

        await importProvincesFromJson(data);
        const refreshed = await getAllProvinces();
        setProvinces(refreshed);
        alert("Provincias importadas com sucesso!");
      } catch (error) {
        console.error("Erro ao importar JSON:", error);
        alert("Erro ao importar o ficheiro JSON.");
      }
    };

    reader.readAsText(file);
  };

  const formatNumber = (num: any) => {
    const value = Number(num);
    return isNaN(value) ? "N/A" : value.toLocaleString("pt-BR");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Províncias de Angola
          </h1>
          <p className="text-gray-600 mt-1">
            Gerir dados das províncias angolanas
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Import JSON */}
          <input
            type="file"
            accept=".json"
            onChange={handleJsonImport}
            className="hidden"
            id="json-upload"
          />
          <label
            htmlFor="json-upload"
            className="bg-white text-orange-600 border border-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all cursor-pointer"
          >
            Importar JSON
          </label>

          {/* Add Button */}
          <button
            onClick={onAdd}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Província</span>
          </button>
        </div>
      </div>

      {/* Province Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {provinces.map((province) => (
          <div
            key={province.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-48 bg-gray-200 relative">
              {province.imagePath ? (
                <img
                  src={province.imagePath}
                  alt={province.nom}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
              )}

              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => onEdit(province)}
                  className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(province.id!)}
                  disabled={deleteId === province.id}
                  className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {province.nom}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Capital: {province.capitale}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>População: {formatNumber(province.population)}</span>
                </div>
                <div>
                  <span>
                    Superfície: {formatNumber(province.superficie)} km²
                  </span>
                </div>
                <div>
                  <span>Clima: {province.climat}</span>
                </div>
              </div>

              <p className="text-gray-700 text-sm line-clamp-3">
                {province.description}
              </p>

              {province.photos?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    {province.photos.length} foto
                    {province.photos.length !== 1 ? "s" : ""} na galeria
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {provinces.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma província cadastrada
          </h3>
          <p className="text-gray-600 mb-6">
            Comece adicionando a primeira província de Angola.
          </p>
          <button
            onClick={onAdd}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all"
          >
            Adicionar Primeira Província
          </button>
        </div>
      )}
    </div>
  );
};

export default ProvinceList;
