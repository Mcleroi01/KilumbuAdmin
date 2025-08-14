import { Historia } from '../../types/modules';
import { Edit, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface HistoriaCardProps {
  historia: Historia;
  onEdit: (historia: Historia) => void;
  onDelete: (id: string) => void;
}

export const HistoriaCard = ({
  historia,
  onEdit,
  onDelete,
}: HistoriaCardProps) => {
  const [showFullContent, setShowFullContent] = useState(false);
  
  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };
  
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: ptBR });
  };
  
  const truncatedContent = historia.conteudo.length > 200 
    ? `${historia.conteudo.substring(0, 200)}...`
    : historia.conteudo;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {historia.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={historia.imageUrl} 
            alt={historia.titulo} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {historia.titulo}
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(historia)}
              className="text-gray-500 hover:text-orange-500 p-1"
              title="Modifier"
            >
              <Edit />
            </button>
            <button
              onClick={() => historia.id && onDelete(historia.id)}
              className="text-gray-500 hover:text-red-500 p-1"
              title="Supprimer"
            >
              <Trash2 />
            </button>
          </div>
        </div>
        
        {historia.subtitulo && (
          <p className="text-gray-700 font-medium mb-3">
            {historia.subtitulo}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {historia.periodoHistorico}
          </span>
          
          {historia.localizacao && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <MapPin className="mr-1" />
              {historia.localizacao}
            </span>
          )}
          
          {historia.tags && historia.tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
          {historia.dataInicio && (
            <div className="flex items-center">
              <Calendar className="mr-1" />
              <span>
                {formatDate(new Date(historia.dataInicio))}
                {historia.dataFim && ` - ${formatDate(new Date(historia.dataFim))}`}
              </span>
            </div>
          )}
          
          {historia.tempoLeitura && (
            <div className="flex items-center">
              <Clock className="mr-1" />
              <span>{historia.tempoLeitura} min de leitura</span>
            </div>
          )}
        </div>
        
        <div className="text-gray-700 mb-4">
          <p className="whitespace-pre-line">
            {showFullContent ? historia.conteudo : truncatedContent}
            {historia.conteudo.length > 200 && (
              <button 
                onClick={toggleContent}
                className="text-orange-600 hover:text-orange-800 text-sm ml-1"
              >
                {showFullContent ? 'Ver menos' : 'Ver mais'}
              </button>
            )}
          </p>
        </div>
        
        {historia.fontes && historia.fontes.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Fontes:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {historia.fontes.map((fonte, index) => (
                <li key={index} className="flex">
                  <span className="mr-2">•</span>
                  <a 
                    href={fonte} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {fonte}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {historia.galeria && historia.galeria.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Galerie d'images:</h4>
            <div className="grid grid-cols-3 gap-2">
              {historia.galeria.slice(0, 3).map((imagem, index) => (
                <div key={index} className="h-20 bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={imagem} 
                    alt={`${historia.titulo} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {historia.galeria.length > 3 && (
                <div className="h-20 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
                  +{historia.galeria.length - 3} autres
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
