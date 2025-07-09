import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { LinguaNacional } from "../../types";

const linguaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  imageUrl: z.string().url("URL da imagem inválida"),
  region: z.string().min(1, "Região é obrigatória"),
  locutores: z.number().min(1, "Número de locutores inválido"),
  familiaLinguistica: z.string().min(1, "Família linguística é obrigatória"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  reconhecidaOficialmente: z.boolean(),
  dialectos: z.string().min(1, "Informe pelo menos um dialeto"),
  usosCulturais: z.string().min(1, "Informe ao menos um uso cultural"),
  iniciativasPreservacao: z.string().min(1, "Informe ao menos uma iniciativa"),
  exemplosFrases: z.string().min(1, "Informe pelo menos uma frase"),
  urlAula: z.string().url("URL inválida para aula"),
});

type LinguaFormData = z.infer<typeof linguaSchema>;

interface LinguaFormProps {
  lingua?: LinguaNacional;
  onSubmit: (data: LinguaNacional) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const LinguaForm = ({
  lingua,
  onSubmit,
  onCancel,
  loading,
}: LinguaFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LinguaFormData>({
    resolver: zodResolver(linguaSchema),
    defaultValues: {
      nome: lingua?.nome || "",
      imageUrl: lingua?.imageUrl || "",
      region: lingua?.region || "",
      locutores: lingua?.locutores || 0,
      familiaLinguistica: lingua?.familiaLinguistica || "",
      descricao: lingua?.descricao || "",
      reconhecidaOficialmente: lingua?.reconhecidaOficialmente || false,
      dialectos: lingua?.dialectos?.join("\n") || "",
      usosCulturais: lingua?.usosCulturais?.join("\n") || "",
      iniciativasPreservacao: lingua?.iniciativasPreservacao?.join("\n") || "",
      exemplosFrases: lingua?.exemplosFrases?.join("\n") || "",
      urlAula: lingua?.urlAula || "",
    },
  });

  const onFormSubmit = async (data: LinguaFormData) => {
    const linguaData: LinguaNacional = {
      id: lingua?.id ?? "",
      ...data,
      dialectos: data.dialectos.split("\n"),
      usosCulturais: data.usosCulturais.split("\n"),
      iniciativasPreservacao: data.iniciativasPreservacao.split("\n"),
      exemplosFrases: data.exemplosFrases.split("\n"),
    };

    await onSubmit(linguaData);
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
            {lingua ? "Editar Língua Nacional" : "Nova Língua Nacional"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <input {...register("nome")} className="input" />
              {errors.nome && <p className="error">{errors.nome.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Imagem (URL) *
              </label>
              <input {...register("imageUrl")} className="input" />
              {errors.imageUrl && (
                <p className="error">{errors.imageUrl.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Região *</label>
              <input {...register("region")} className="input" />
              {errors.region && (
                <p className="error">{errors.region.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nº de Locutores *
              </label>
              <input
                type="number"
                {...register("locutores", { valueAsNumber: true })}
                className="input"
              />
              {errors.locutores && (
                <p className="error">{errors.locutores.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Família Linguística *
              </label>
              <input {...register("familiaLinguistica")} className="input" />
              {errors.familiaLinguistica && (
                <p className="error">{errors.familiaLinguistica.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Reconhecida Oficialmente
              </label>
              <input type="checkbox" {...register("reconhecidaOficialmente")} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descrição *
            </label>
            <textarea
              rows={4}
              {...register("descricao")}
              className="textarea"
            />
            {errors.descricao && (
              <p className="error">{errors.descricao.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Dialetos (um por linha) *
            </label>
            <textarea
              rows={3}
              {...register("dialectos")}
              className="textarea"
            />
            {errors.dialectos && (
              <p className="error">{errors.dialectos.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Usos Culturais (um por linha) *
            </label>
            <textarea
              rows={3}
              {...register("usosCulturais")}
              className="textarea"
            />
            {errors.usosCulturais && (
              <p className="error">{errors.usosCulturais.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Iniciativas de Preservação *
            </label>
            <textarea
              rows={3}
              {...register("iniciativasPreservacao")}
              className="textarea"
            />
            {errors.iniciativasPreservacao && (
              <p className="error">{errors.iniciativasPreservacao.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Exemplos de Frases *
            </label>
            <textarea
              rows={3}
              {...register("exemplosFrases")}
              className="textarea"
            />
            {errors.exemplosFrases && (
              <p className="error">{errors.exemplosFrases.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              URL da Aula *
            </label>
            <input {...register("urlAula")} className="input" />
            {errors.urlAula && (
              <p className="error">{errors.urlAula.message}</p>
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
              <span>{loading ? "Salvando..." : "Salvar Língua"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinguaForm;
