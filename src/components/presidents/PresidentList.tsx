import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, UserCircle2 } from "lucide-react";
import { President } from "../../types";
import {
  getAllPresidents,
  deletePresident,
  importPresidentsFromJson,
} from "./services/presidentsService";

interface PresidentListProps {
  onEdit: (president: President) => void;
  onAdd: () => void;
}

const PresidentList = ({ onEdit, onAdd }: PresidentListProps) => {
  const [presidents, setPresidents] = useState<President[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresidents = async () => {
      const data = await getAllPresidents();
      setPresidents(data);
      setLoading(false);
    };
    fetchPresidents();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este presidente?")) {
      setDeleteId(id);
      await deletePresident(id);
      setPresidents((prev) => prev.filter((p) => p.id !== id));
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
          alert("O ficheiro deve conter uma lista de presidentes.");
          return;
        }

        await importPresidentsFromJson(data);
        const refreshed = await getAllPresidents();
        setPresidents(refreshed);
        alert("Presidentes importados com sucesso!");
      } catch (error) {
        console.error("Erro ao importar JSON:", error);
        alert("Erro ao importar o ficheiro JSON.");
      }
    };

    reader.readAsText(file);
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
            Presidentes de Angola
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão dos presidentes que governaram Angola
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="file"
            accept=".json"
            onChange={handleJsonImport}
            className="hidden"
            id="json-upload"
          />
          <label
            htmlFor="json-upload"
            className="bg-white text-orange-600 border border-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 cursor-pointer"
          >
            Importar JSON
          </label>
          <button
            onClick={onAdd}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Presidente</span>
          </button>
        </div>
      </div>

      {/* Liste des présidents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presidents.map((president) => (
          <div
            key={president.id}
            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-48 bg-gray-200 relative">
              {president.imagePath ? (
                <img
                  src={president.imagePath}
                  alt={president.nom}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <UserCircle2 className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => onEdit(president)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-50"
                >
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(president.id!)}
                  disabled={deleteId === president.id}
                  className="p-2 bg-white rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {president.nom}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {president.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {presidents.length === 0 && (
        <div className="text-center py-12">
          <UserCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum presidente cadastrado
          </h3>
          <p className="text-gray-600 mb-6">
            Comece adicionando os presidentes que lideraram Angola.
          </p>
          <button
            onClick={onAdd}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-700"
          >
            Adicionar Presidente
          </button>
        </div>
      )}
    </div>
  );
};

export default PresidentList;
