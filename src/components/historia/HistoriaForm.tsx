import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Historia } from '../../types/modules';
import { FormField } from '../forms/FormField';
import { TextAreaField } from '../forms/TextAreaField';
import { ArrayInputField } from '../forms/ArrayInputField';
import { FileUploadField } from '../forms/FileUploadField';
import { SelectField } from '../forms/SelectField';
import { Timestamp } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Schéma de validation avec Zod
const historiaSchema = z.object({
  titulo: z.string().min(1, 'Le titre est requis'),
  subtitulo: z.string().optional(),
  conteudo: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères'),
  periodoHistorico: z.string().min(1, 'La période historique est requise'),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  localizacao: z.string().optional(),
  tags: z.array(z.string().min(1, 'Le tag ne peut pas être vide')).optional(),
  tempoLeitura: z.number().min(1, 'Le temps de lecture doit être d\'au moins 1 minute').optional(),
  autor: z.string().optional(),
  fonte: z.string().optional(),
  fontes: z.array(
    z.object({
      titulo: z.string().min(1, 'Le titre de la source est requis'),
      url: z.string().url('URL invalide'),
      tipo: z.string().optional(),
    })
  ).optional(),
  destaque: z.boolean().default(false),
  ativo: z.boolean().default(true),
});

type HistoriaFormData = z.infer<typeof historiaSchema>;

interface HistoriaFormProps {
  initialData?: Historia;
  onSubmit: (data: Historia) => void;
  isSubmitting: boolean;
}

const periodosHistoricos = [
  { value: 'pre-colonial', label: 'Période Pré-Coloniale' },
  { value: 'colonisation', label: 'Période Coloniale' },
  { value: 'lutte-independance', label: 'Lutte pour l\'Indépendance' },
  { value: 'independance', label: 'Période Post-Indépendance' },
  { value: 'guerre-civil', label: 'Guerre Civile' },
  { value: 'post-guerre', label: 'Période Post-Guerre' },
  { value: 'contemporaine', label: 'Période Contemporaine' },
];

export const HistoriaForm = ({ initialData, onSubmit, isSubmitting }: HistoriaFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm<HistoriaFormData>({
    resolver: zodResolver(historiaSchema),
    defaultValues: {
      titulo: '',
      subtitulo: '',
      conteudo: '',
      periodoHistorico: '',
      tags: [],
      fontes: [],
      destaque: false,
      ativo: true,
    },
  });

  // Initialiser le formulaire avec les données existantes si en mode édition
  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, imageUrl, galeria, ...formData } = initialData;

      // Convertir les chaînes de date en objets Date
      const formattedData = {
        ...formData,
        dataInicio: formData.dataInicio ? new Date(formData.dataInicio) : undefined,
        dataFim: formData.dataFim ? new Date(formData.dataFim) : undefined,
      };

      if (imageUrl) setImagePreview(imageUrl);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: HistoriaFormData) => {
    // Ici, vous devrez gérer le téléchargement des fichiers vers Firebase Storage
    // et obtenir les URLs avant de soumettre
    const historiaData: Historia = {
      ...data,
      id: initialData?.id,
      tempoLeitura: initialData?.tempoLeitura || 0,
      dataInicio: initialData?.dataInicio || '',
      dataFim: initialData?.dataFim || '',
      localizacao: initialData?.localizacao || '',
      tags: initialData?.tags || [],
      fontes: initialData?.fontes || [],
      imageUrl: initialData?.imageUrl || '', // À remplacer par l'URL après upload
      galeria: initialData?.galeria || [], // À mettre à jour avec les nouvelles URLs
      createdAt: initialData?.createdAt || Timestamp.now(),
      updatedAt: initialData?.updatedAt || Timestamp.now(),
      personagensImportantes: [],
      referencias: [],
      relevanciaAtual: ''
    }

    onSubmit(historiaData);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleGalleryChange = (files: File[]) => {
    setGalleryFiles(files);
  };

  const addSource = () => {
    const currentSources = watch('fontes') || [];
    setValue('fontes', [...currentSources, { titulo: '', url: '', tipo: 'web' }], { shouldValidate: true });
  };

  const removeSource = (index: number) => {
    const currentSources = watch('fontes') || [];
    const newSources = [...currentSources];
    newSources.splice(index, 1);
    setValue('fontes', newSources, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Informations de base</h2>

          <FormField
            label="Título do artigo"
            error={errors.titulo?.message}
            isRequired
            {...register('titulo')}
          />

          <FormField
            label="Sous-titre (optionnel)"
            error={errors.subtitulo?.message}
            {...register('subtitulo')}
          />

          <TextAreaField
            label="Contenu de l'article"
            rows={8}
            error={errors.conteudo?.message}
            isRequired
            {...register('conteudo')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Période historique"
              options={periodosHistoricos}
              error={errors.periodoHistorico?.message}
              isRequired
              value={watch('periodoHistorico')}
              onChange={(e) => setValue('periodoHistorico', e.target.value, { shouldValidate: true })} name={''}            />

            <FormField
              label="Lieu (optionnel)"
              error={errors.localizacao?.message}
              {...register('localizacao')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début (optionnel)
              </label>
              <DatePicker
                selected={watch('dataInicio')}
                onChange={(date: any) => setValue('dataInicio', date || undefined, { shouldValidate: true })}
                className="w-full"
                placeholderText="Sélectionner une date"
              />
              {errors.dataInicio && (
                <p className="mt-1 text-sm text-red-600">{errors.dataInicio.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin (optionnel)
              </label>
              <DatePicker
                selected={watch('dataFim')}
                onChange={(date: any) => setValue('dataFim', date || undefined, { shouldValidate: true })}
                className="w-full"
                placeholderText="Sélectionner une date"
                minDate={watch('dataInicio')}
              />
              {errors.dataFim && (
                <p className="mt-1 text-sm text-red-600">{errors.dataFim.message}</p>
              )}
            </div>

            <FormField
              label="Temps de lecture (minutes, optionnel)"
              type="number"
              min={1}
              error={errors.tempoLeitura?.message}
              {...register('tempoLeitura', { valueAsNumber: true })}
            />
          </div>

          <div>
            <ArrayInputField
              label="Tags (optionnel)"
              values={watch('tags') || []}
              onChange={(values) => setValue('tags', values, { shouldValidate: true })}
              placeholder="Ajouter un tag"
              addButtonText="Ajouter le tag" name={''}            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Sources (optionnel)</h3>
              <button
                type="button"
                onClick={addSource}
                className="text-sm text-orange-600 hover:text-orange-800"
              >
                + Ajouter une source
              </button>
            </div>

            {watch('fontes')?.map((fonte, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-md space-y-2">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium">Source {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeSource(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Supprimer
                  </button>
                </div>

                <FormField
                  label="Titre de la source"
                  error={errors.fontes?.[index]?.titulo?.message}
                  {...register(`fontes.${index}.titulo` as const)}
                />

                <FormField
                  label="URL"
                  type="url"
                  placeholder="https://exemple.com"
                  error={errors.fontes?.[index]?.url?.message}
                  {...register(`fontes.${index}.url` as const)}
                />

                <FormField
                  label="Type (optionnel)"
                  placeholder="web, livre, article, etc."
                  {...register(`fontes.${index}.tipo` as const)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Médias</h2>

          <FileUploadField
            label="Image principale"
            accept="image/*"
            onFileChange={handleImageChange}
            previewUrl={imagePreview || undefined}
            error={undefined} name={''}          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Galerie d'images (optionnel)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setGalleryFiles(files);
              }}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-50 file:text-orange-700
                hover:file:bg-orange-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              Sélectionnez une ou plusieurs images pour la galerie
            </p>
          </div>

          <div className="pt-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Options</h3>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="destaque"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                {...register('destaque')}
              />
              <label htmlFor="destaque" className="ml-2 block text-sm text-gray-700">
                Mettre en avant
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="ativo"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                defaultChecked
                {...register('ativo')}
              />
              <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
                Article actif (visible sur le site)
              </label>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Aperçu</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm text-gray-600">
              <p className="font-medium mb-1">Titre:</p>
              <p className="mb-3">{watch('titulo') || 'Aucun titre'}</p>

              <p className="font-medium mb-1">Période:</p>
              <p className="mb-3">
                {watch('periodoHistorico')
                  ? periodosHistoricos.find(p => p.value === watch('periodoHistorico'))?.label
                  : 'Non spécifiée'}
              </p>

              <p className="font-medium mb-1">Statut:</p>
              <p className="text-sm">
                {watch('ativo') ? (
                  <span className="text-green-600">● Actif</span>
                ) : (
                  <span className="text-red-600">● Inactif</span>
                )}
                {watch('destaque') && (
                  <span className="ml-2 text-orange-600">● Mis en avant</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5 border-t border-gray-200">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => {
              reset();
              setImageFile(null);
              setGalleryFiles([]);
              setImagePreview(null);
            }}
            disabled={isSubmitting}
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  );
};
