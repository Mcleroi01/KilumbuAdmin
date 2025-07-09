import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { ParcNaturel } from "../../types";

const parcSchema = z.object({
  nom: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  localisation: z.string().min(1, "Localização é obrigatória"),
  superficie: z.string().min(1, "Superfície é obrigatória"),
  dateCreation: z.string().min(1, "Data de criação é obrigatória"),
  images: z.string().min(1, "Pelo menos uma imagem é obrigatória"), // CSV ou 1 par linha
  especesProtegees: z.string().min(1, "Informe ao menos uma espécie"),
  patrimoineUnesco: z.boolean(),
  climat: z.string().min(1, "Clima é obrigatório"),
  typeVegetation: z.string().min(1, "Tipo de vegetação é obrigatório"),
  activitesDisponibles: z.string().min(1, "Atividades são obrigatórias"),
  acces: z.string().min(1, "Acesso é obrigatório"),
  conseilsVisite: z.string().min(1, "Conselhos de visita são obrigatórios"),
  siteWeb: z.string().url("URL do site inválida").optional(),
  imagePrincipale: z.string().url("URL da imagem principal inválida"),
});

type ParcFormData = z.infer<typeof parcSchema>;

interface ParcFormProps {
  parc?: ParcNaturel;
  onSubmit: (data: ParcNaturel) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const ParcForm = ({ parc, onSubmit, onCancel, loading }: ParcFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParcFormData>({
    resolver: zodResolver(parcSchema),
    defaultValues: {
      nom: parc?.nom || "",
      description: parc?.description || "",
      localisation: parc?.localisation || "",
      superficie: parc?.superficie || "",
      dateCreation: parc?.dateCreation || "",
      images: parc?.images?.join("\n") || "",
      especesProtegees: parc?.especesProtegees?.join("\n") || "",
      patrimoineUnesco: parc?.patrimoineUnesco || false,
      climat: parc?.climat || "",
      typeVegetation: parc?.typeVegetation || "",
      activitesDisponibles: parc?.activitesDisponibles || "",
      acces: parc?.acces || "",
      conseilsVisite: parc?.conseilsVisite || "",
      siteWeb: parc?.siteWeb || "",
      imagePrincipale: parc?.imagePrincipale || "",
    },
  });

  const onFormSubmit = async (data: ParcFormData) => {
    const parcData: ParcNaturel = {
      id: parc?.id ?? "",
      ...data,
      images: data.images.split("\n"),
      especesProtegees: data.especesProtegees.split("\n"),
    };

    await onSubmit(parcData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            {parc ? "Editar Parque Natural" : "Novo Parque Natural"}
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
                Localização *
              </label>
              <input {...register("localisation")} className="input" />
              {errors.localisation && (
                <p className="error">{errors.localisation.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Superfície *
              </label>
              <input {...register("superficie")} className="input" />
              {errors.superficie && (
                <p className="error">{errors.superficie.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Data de Criação *
              </label>
              <input {...register("dateCreation")} className="input" />
              {errors.dateCreation && (
                <p className="error">{errors.dateCreation.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Clima *</label>
              <input {...register("climat")} className="input" />
              {errors.climat && (
                <p className="error">{errors.climat.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo de Vegetação *
              </label>
              <input {...register("typeVegetation")} className="input" />
              {errors.typeVegetation && (
                <p className="error">{errors.typeVegetation.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Patrimônio da UNESCO
              </label>
              <input type="checkbox" {...register("patrimoineUnesco")} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Acesso ao Parque *
              </label>
              <input {...register("acces")} className="input" />
              {errors.acces && <p className="error">{errors.acces.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descrição *
            </label>
            <textarea
              rows={4}
              {...register("description")}
              className="textarea"
            />
            {errors.description && (
              <p className="error">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Atividades Disponíveis *
            </label>
            <input {...register("activitesDisponibles")} className="input" />
            {errors.activitesDisponibles && (
              <p className="error">{errors.activitesDisponibles.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Conselhos para Visita *
            </label>
            <textarea
              rows={3}
              {...register("conseilsVisite")}
              className="textarea"
            />
            {errors.conseilsVisite && (
              <p className="error">{errors.conseilsVisite.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Imagens (uma por linha) *
            </label>
            <textarea rows={3} {...register("images")} className="textarea" />
            {errors.images && <p className="error">{errors.images.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Espécies Protegidas (uma por linha) *
            </label>
            <textarea
              rows={3}
              {...register("especesProtegees")}
              className="textarea"
            />
            {errors.especesProtegees && (
              <p className="error">{errors.especesProtegees.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              URL da Imagem Principal *
            </label>
            <input {...register("imagePrincipale")} className="input" />
            {errors.imagePrincipale && (
              <p className="error">{errors.imagePrincipale.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Site oficial (opcional)
            </label>
            <input {...register("siteWeb")} className="input" />
            {errors.siteWeb && (
              <p className="error">{errors.siteWeb.message}</p>
            )}
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
              <span>{loading ? "Salvando..." : "Salvar Parque"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParcForm;
