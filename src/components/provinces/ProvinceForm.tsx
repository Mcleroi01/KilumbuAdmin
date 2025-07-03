import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft } from 'lucide-react';
import { Province } from '../../types';

import { useState } from 'react';

const provinceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  capital: z.string().min(1, 'Capital é obrigatória'),
  area: z.number().min(1, 'Área deve ser maior que 0'),
  population: z.number().min(1, 'População deve ser maior que 0'),
  climate: z.string().min(1, 'Clima é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

type ProvinceFormData = z.infer<typeof provinceSchema>;

interface ProvinceFormProps {
  province?: Province;
  onSubmit: (data: Province) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const ProvinceForm = ({ province, onSubmit, onCancel, loading }: ProvinceFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProvinceFormData>({
    resolver: zodResolver(provinceSchema),
    defaultValues: {
      name: province?.nom || '',
      capital: province?.capitale || '',
      area: province?.superficie || 0,
      population: province?.population || 0,
      climate: province?.climat || '',
      description: province?.description || '',
    },
  });

  const [mainImage, setMainImage] = useState(province?.imagePath || '');
  const [mapImage, setMapImage] = useState(province?.mapPath || '');
  const [gallery, setGallery] = useState(province?.photos || []);

  const onFormSubmit = async (data: ProvinceFormData) => {
    const provinceData: Province = {
      ...data,
      mainImage,
      mapImage,
      gallery,
      id: province?.id,
    };

    await onSubmit(provinceData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {province ? "Editar Província" : "Nova Província"}
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Província *
              </label>
              <input
                {...register("name")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Luanda"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Capital */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capital *
              </label>
              <input
                {...register("capital")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Luanda"
              />
              {errors.capital && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.capital.message}
                </p>
              )}
            </div>

            {/* Área */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Superfície (km²) *
              </label>
              <input
                type="number"
                {...register("area", { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: 18827"
              />
              {errors.area && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.area.message}
                </p>
              )}
            </div>

            {/* População */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                População *
              </label>
              <input
                type="number"
                {...register("population", { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: 2825311"
              />
              {errors.population && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.population.message}
                </p>
              )}
            </div>
          </div>

          {/* Clima */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clima *
            </label>
            <input
              {...register("climate")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Tropical seco"
            />
            {errors.climate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.climate.message}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Descreva a província..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* URL do Mapa da Província */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL do Mapa da Província *
            </label>
            <input
              type="url"
              value={mapImage}
              onChange={(e) => setMapImage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="https://exemplo.com/mapa_luanda.png"
            />
          </div>

          {/* Image principale par URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Imagem Principal *
            </label>
            <input
              type="url"
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URLs da Galeria (uma por linha)
            </label>
            <textarea
              rows={5}
              value={gallery.join("\n")}
              onChange={(e) => setGallery(e.target.value.split("\n"))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder={`https://exemplo.com/1.jpg\nhttps://exemplo.com/2.jpg`}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? "Salvando..." : "Salvar Província"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProvinceForm;