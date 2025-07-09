import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { President } from "../../types"; // à adapter selon ton chemin

const presidentSchema = z.object({
  nom: z.string().min(1, "Nome é obrigatório"),
  imagePath: z.string().url("URL da imagem principal inválida"),
  dateNais: z.string().min(1, "Data de nascimento obrigatória"),
  dateMandat: z.string().min(1, "Data do mandato obrigatória"),
  profissao: z.string().min(1, "Profissão é obrigatória"),
  partido: z.string().min(1, "Partido é obrigatório"),
  religiao: z.string().min(1, "Religião é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  photos: z.string().min(1, "Liste ao menos uma URL de foto"),
});

type PresidentFormData = z.infer<typeof presidentSchema>;

interface PresidentFormProps {
  president?: President;
  onSubmit: (data: President) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const PresidentForm = ({
  president,
  onSubmit,
  onCancel,
  loading,
}: PresidentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PresidentFormData>({
    resolver: zodResolver(presidentSchema),
    defaultValues: {
      nom: president?.nom || "",
      imagePath: president?.imagePath || "",
      dateNais: president?.dateNais || "",
      dateMandat: president?.dateMandat || "",
      profissao: president?.profissao || "",
      partido: president?.partido || "",
      religiao: president?.religiao || "",
      description: president?.description || "",
      photos: president?.photos?.join("\n") || "",
    },
  });

  const onFormSubmit = async (data: PresidentFormData) => {
    const presidentData: President = {
      id: president?.id ?? "",
      ...data,
      photos: data.photos
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };
    await onSubmit(presidentData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            {president ? "Editar Presidente" : "Novo Presidente"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <input {...register("nom")} className="input" />
              {errors.nom && <p className="error">{errors.nom.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                URL da Imagem Principal *
              </label>
              <input {...register("imagePath")} className="input" />
              {errors.imagePath && (
                <p className="error">{errors.imagePath.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Data de Nascimento *
              </label>
              <input {...register("dateNais")} className="input" />
              {errors.dateNais && (
                <p className="error">{errors.dateNais.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Período de Mandato *
              </label>
              <input {...register("dateMandat")} className="input" />
              {errors.dateMandat && (
                <p className="error">{errors.dateMandat.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Profissão *
              </label>
              <input {...register("profissao")} className="input" />
              {errors.profissao && (
                <p className="error">{errors.profissao.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Partido *
              </label>
              <input {...register("partido")} className="input" />
              {errors.partido && (
                <p className="error">{errors.partido.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Religião *
              </label>
              <input {...register("religiao")} className="input" />
              {errors.religiao && (
                <p className="error">{errors.religiao.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descrição *
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="textarea"
            />
            {errors.description && (
              <p className="error">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              URLs de Fotos (uma por linha) *
            </label>
            <textarea {...register("photos")} rows={3} className="textarea" />
            {errors.photos && <p className="error">{errors.photos.message}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? "Salvando..." : "Salvar Presidente"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresidentForm;
