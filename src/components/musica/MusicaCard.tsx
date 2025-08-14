import { Musica } from '../../types/modules';
import { Play, Pause, Edit, Trash2, Music, User, Calendar, MapPin } from 'lucide-react';
import { useState } from 'react';

interface MusicaCardProps {
  musica: Musica;
  onEdit: (musica: Musica) => void;
  onDelete: (id: string) => void;
  isPlaying: boolean;
  onPlayToggle: (musica: Musica) => void;
}

export const MusicaCard = ({
  musica,
  onEdit,
  onDelete,
  isPlaying,
  onPlayToggle,
}: MusicaCardProps) => {
  const [showFullLyrics, setShowFullLyrics] = useState(false);
  
  const toggleLyrics = () => {
    setShowFullLyrics(!showFullLyrics);
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).getFullYear();
  };
  
  const truncatedLyrics = musica.letra.length > 100 
    ? `${musica.letra.substring(0, 100)}...`
    : musica.letra;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        {musica.imageUrl ? (
          <img 
            src={musica.imageUrl} 
            alt={musica.titulo} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center">
            <Music className="text-4xl text-orange-400" />
          </div>
        )}
        
        <div className="absolute top-2 right-2
         bg-black bg-opacity-50 text-white rounded-full p-2
         hover:bg-opacity-70 transition-all duration-200 cursor-pointer"
         onClick={() => onPlayToggle(musica)}>
          {isPlaying ? <Pause /> : <Play />}
        </div>
        
        <div className="absolute bottom-2 left-2">
          <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {musica.duracao || '03:30'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {musica.titulo}
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(musica)}
              className="text-gray-500 hover:text-orange-500 p-1"
              title="Modifier"
            >
              <Edit />
            </button>
            <button
              onClick={() => musica.id && onDelete(musica.id)}
              className="text-gray-500 hover:text-red-500 p-1"
              title="Supprimer"
            >
              <Trash2 />
            </button>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <User className="mr-1" />
          <span>{musica.artista}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {musica.genero}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {musica.estilo}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {musica.regiao}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Calendar className="mr-1" />
            <span>{formatDate(musica.createdAt?.toDate() || new Date())}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-1" />
            <span>{musica.regiao}</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-700 mb-3">
          <p className="font-medium mb-1">Paroles :</p>
          <p className="whitespace-pre-line">
            {showFullLyrics ? musica.letra : truncatedLyrics}
            {musica.letra.length > 100 && (
              <button 
                onClick={toggleLyrics}
                className="text-orange-600 hover:text-orange-800 text-sm ml-1"
              >
                {showFullLyrics ? 'Voir moins' : 'Voir plus'}
              </button>
            )}
          </p>
        </div>
        
        {musica.instrumentos && musica.instrumentos.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Instruments :</p>
            <div className="flex flex-wrap gap-1">
              {musica.instrumentos.slice(0, 3).map((instrumento, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {instrumento}
                </span>
              ))}
              {musica.instrumentos.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  +{musica.instrumentos.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full" 
              style={{ width: `${musica.popularidade || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Popularité</span>
            <span>{musica.popularidade || 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
