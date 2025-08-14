import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Musica } from '../../types/modules';
import { musicaService } from '../../services/musicaService';
import { FormField } from '../forms/FormField';
import { TextAreaField } from '../forms/TextAreaField';
import { ArrayInputField } from '../forms/ArrayInputField';
import { FileUploadField } from '../forms/FileUploadField';
import { SelectField } from '../forms/SelectField';
import { Timestamp } from 'firebase/firestore';

// Schéma de validation avec Zod
const musicaSchema = z.object({
  titulo: z.string().min(1, 'Le titre est requis'),
  artista: z.string().min(1, "Le nom de l'artiste est requis"),
  genero: z.string().min(1, 'Le genre est requis'),
  estilo: z.string().min(1, "Le style est requis"),
  anoLancamento: z.number().min(1900, "L'année doit être supérieure à 1900").max(new Date().getFullYear() + 1, "L'année ne peut pas être dans le futur"),
  duracao: z.string().regex(/^\d{1,2}:\d{2}$/, 'Format invalide (utilisez MM:SS)'),
  letra: z.string().min(10, 'La parole doit contenir au moins 10 caractères'),
  traducao: z.string().optional(),
  contextoHistorico: z.string().min(10, 'Le contexte historique est requis'),
  instrumentos: z.array(z.string().min(1, 'Le nom de l\'instrument ne peut pas être vide')).min(1, 'Au moins un instrument est requis'),
  regiao: z.string().min(1, 'La région est requise'),
  influencias: z.array(z.string().min(1, "L'influence ne peut pas être vide")).optional(),
  premiacoes: z.array(z.string().min(1, 'Le nom de la récompense ne peut pas être vide')).optional(),
  popularidade: z.number().min(0).max(100).default(0),
});

type MusicaFormData = z.infer<typeof musicaSchema>;

interface MusicaFormProps {
  initialData?: Musica;
  onSubmit: (data: Musica) => void;
  isSubmitting: boolean;
}

const generosMusicais = [
  { value: 'semba', label: 'Semba' },
  { value: 'kizomba', label: 'Kizomba' },
  { value: 'kuduro', label: 'Kuduro' },
  { value: 'rebita', label: 'Rebita' },
  { value: 'kazukuta', label: 'Kazukuta' },
  { value: 'zouk', label: 'Zouk' },
  { value: 'outro', label: 'Autre' },
];

const regioesAngola = [
  { value: 'luanda', label: 'Luanda' },
  { value: 'huambo', label: 'Huambo' },
  { value: 'benguela', label: 'Benguela' },
  { value: 'huila', label: 'Huíla' },
  { value: 'cabinda', label: 'Cabinda' },
  { value: 'cunene', label: 'Cunene' },
  { value: 'outra', label: 'Autre région' },
];

export const MusicaForm = ({ initialData, onSubmit, isSubmitting }: MusicaFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<MusicaFormData>({
    resolver: zodResolver(musicaSchema),
    defaultValues: {
      titulo: '',
      artista: '',
      genero: '',
      estilo: '',
      anoLancamento: new Date().getFullYear(),
      duracao: '03:30',
      letra: '',
      contextoHistorico: '',
      instrumentos: [],
      regiao: '',
      influencias: [],
      premiacoes: [],
      popularidade: 0,
    },
  });

  // Initialiser le formulaire avec les données existantes si en mode édition
  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, imageUrl, audioUrl, videoUrl, ...formData } = initialData;
      reset({
        ...formData,
        // Convertir les champs numériques si nécessaire
        anoLancamento: formData.anoLancamento,
        popularidade: formData.popularidade || 0,
      });

      if (imageUrl) setImagePreview(imageUrl);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: MusicaFormData) => {
    const musicaData: Musica = {
      ...data,
      id: initialData?.id,
      imageUrl: initialData?.imageUrl || '',
      audioUrl: initialData?.audioUrl || '',
      videoUrl: initialData?.videoUrl,
      influencias: data.influencias || [], // Ensure this is always an array
      createdAt: initialData?.createdAt || Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    onSubmit(musicaData);
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Informations de base</h2>

          <FormField
            label="Titre de la musique"
            error={errors.titulo?.message}
            isRequired
            {...register('titulo')}
          />

          <FormField
            label="Artiste ou groupe"
            error={errors.artista?.message}
            isRequired
            {...register('artista')}
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Genre musical"
              options={generosMusicais}
              error={errors.genero?.message}
              isRequired
              value={watch('genero')}
              onChange={(e) => setValue('genero', e.target.value, { shouldValidate: true })} name={''} />

            <FormField
              label="Style"
              error={errors.estilo?.message}
              isRequired
              {...register('estilo')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Année de sortie"
              type="number"
              min={1900}
              max={new Date().getFullYear() + 1}
              error={errors.anoLancamento?.message}
              isRequired
              {...register('anoLancamento', { valueAsNumber: true })}
            />

            <FormField
              label="Durée (MM:SS)"
              placeholder="03:30"
              error={errors.duracao?.message}
              isRequired
              {...register('duracao')}
            />
          </div>

          <SelectField
            label="Région d'origine"
            options={regioesAngola}
            error={errors.regiao?.message}
            isRequired
            value={watch('regiao')}
            onChange={(e) => setValue('regiao', e.target.value, { shouldValidate: true })} name={''} />

          <FormField
            label="Popularité (0-100)"
            type="number"
            min={0}
            max={100}
            error={errors.popularidade?.message}
            {...register('popularidade', { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Médias</h2>

          <FileUploadField
            label="Image de couverture"
            name="image"
            accept="image/*"
            onFileChange={handleImageChange}
            previewUrl={imagePreview || undefined}
            error={undefined}
          />

          <FileUploadField
            label="Fichier audio (MP3)"
            name="audio"
            accept="audio/mp3,audio/*"
            onFileChange={setAudioFile}
            previewUrl={initialData?.audioUrl}
            error={undefined}
          />

          <FileUploadField
            label="Vidéo (optionnel)"
            name="video"
            accept="video/*"
            onFileChange={setVideoFile}
            previewUrl={initialData?.videoUrl}
            error={undefined}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Contenu</h2>

        <TextAreaField
          label="Paroles"
          rows={6}
          error={errors.letra?.message}
          isRequired
          {...register('letra')}
        />

        <TextAreaField
          label="Traduction (optionnel)"
          rows={4}
          error={errors.traducao?.message}
          {...register('traducao')}
        />

        <TextAreaField
          label="Contexte historique et culturel"
          rows={4}
          error={errors.contextoHistorico?.message}
          isRequired
          {...register('contextoHistorico')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Instruments utilisés</h2>
          <ArrayInputField
            label="Instruments"
            values={watch('instrumentos') || []}
            onChange={(values) => setValue('instrumentos', values, { shouldValidate: true })}
            placeholder="Ajouter un instrument"
            addButtonText="Ajouter l'instrument" name={''} />
          {errors.instrumentos?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.instrumentos.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Influences (optionnel)</h2>
          <ArrayInputField
            label="Influences"
            values={watch('influencias') || []}
            onChange={(values) => setValue('influencias', values)}
            placeholder="Ajouter une influence"
            addButtonText="Ajouter l'influence" name={''} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Récompenses (optionnel)</h2>
        <ArrayInputField
          label="Récompenses"
          values={watch('premiacoes') || []}
          onChange={(values) => setValue('premiacoes', values)}
          placeholder="Ajouter une récompense"
          addButtonText="Ajouter la récompense" name={''} />
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};
