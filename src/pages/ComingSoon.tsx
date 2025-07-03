import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Construction className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-orange-800 text-sm">
            Esta funcionalidade estará disponível em breve. Continue usando as outras seções do sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;