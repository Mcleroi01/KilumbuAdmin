import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { HeroiNacional } from "../../types";


const heroSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  biografia: z.string().min(1, "Biografia é obrigatória"),
  imageUrl: z.string().url("URL inválido"),
  localNascimento: z.string().min(1, "Local de nascimento é obrigatório"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  dataFalecimento: z.string().optional(),
  contexteHistorico: z.string().min(1, "Contexto histórico obrigatório"),
  contribuicoes: z.string().min(1, "Contribuições obrigatórias"),
  citations: z.string().min(1, "Citações obrigatórias"),
  reconhecidoOficialmente: z.boolean(),
  dataReconhecimento: z.string().optional(),
  hommages: z.string().min(1, "Homenagens obrigatórias"),
});

type HeroFormData = z.infer<typeof heroSchema>;

interface HeroFormProps {
  hero?: HeroiNacional;
  onSubmit: (data: HeroiNacional) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const HeroForm = ({ hero, onSubmit, onCancel, loading }: HeroFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      nome: hero?.nome || "",
      biografia: hero?.biografia || "",
      imageUrl: hero?.imageUrl || "",
      localNascimento: hero?.localNascimento || "",
      dataNascimento: hero?.dataNascimento || "",
      dataFalecimento: hero?.dataFalecimento || "",
      contexteHistorico: hero?.contexteHistorico || "",
      contribuicoes: hero?.contribuicoes?.join("\n") || "",
      citations: hero?.citations?.join("\n") || "",
      reconhecidoOficialmente: hero?.reconhecidoOficialmente || false,
      dataReconhecimento: hero?.dataReconhecimento || "",
      hommages: hero?.hommages?.join("\n") || "",
    },
  });

  const onFormSubmit = async (data: HeroFormData) => {
    const heroData: HeroiNacional = {
      ...data,
      contribuicoes: data.contribuicoes.split("\n"),
      citations: data.citations.split("\n"),
      hommages: data.hommages.split("\n"),
      id: hero?.id,
    };
    await onSubmit(heroData);
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
            {hero ? "Editar Herói Nacional" : "Novo Herói Nacional"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <input
                {...register("nome")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {errors.nome && (
                <p className="text-red-600 text-sm">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Local de Nascimento *
              </label>
              <input
                {...register("localNascimento")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {errors.localNascimento && (
                <p className="text-red-600 text-sm">
                  {errors.localNascimento.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Data de Nascimento *
              </label>
              <input
                type="date"
                {...register("dataNascimento")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {errors.dataNascimento && (
                <p className="text-red-600 text-sm">
                  {errors.dataNascimento.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Data de Falecimento (opcional)
              </label>
              <input
                type="date"
                {...register("dataFalecimento")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Reconhecido Oficialmente
              </label>
              <input type="checkbox" {...register("reconhecidoOficialmente")} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Data de Reconhecimento
              </label>
              <input
                type="date"
                {...register("dataReconhecimento")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Imagem (URL) *
            </label>
            <input
              {...register("imageUrl")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {errors.imageUrl && (
              <p className="text-red-600 text-sm">{errors.imageUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Biografia *
            </label>
            <textarea
              rows={4}
              {...register("biografia")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
            />
            {errors.biografia && (
              <p className="text-red-600 text-sm">{errors.biografia.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contexto Histórico *
            </label>
            <textarea
              rows={3}
              {...register("contexteHistorico")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
            />
            {errors.contexteHistorico && (
              <p className="text-red-600 text-sm">
                {errors.contexteHistorico.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contribuições (uma por linha) *
            </label>
            <textarea
              rows={3}
              {...register("contribuicoes")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
            />
            {errors.contribuicoes && (
              <p className="text-red-600 text-sm">
                {errors.contribuicoes.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Citações (uma por linha) *
            </label>
            <textarea
              rows={3}
              {...register("citations")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
            />
            {errors.citations && (
              <p className="text-red-600 text-sm">{errors.citations.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Homenagens (uma por linha) *
            </label>
            <textarea
              rows={3}
              {...register("hommages")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
            />
            {errors.hommages && (
              <p className="text-red-600 text-sm">{errors.hommages.message}</p>
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
              <span>{loading ? "Salvando..." : "Salvar Herói"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroForm;
