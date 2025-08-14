import { Timestamp } from 'firebase/firestore';

export interface Musica {
  id?: string;
  titulo: string;
  artista: string;
  genero: string;
  estilo: string;
  anoLancamento: number;
  duracao: string;
  letra: string;
  traducao?: string;
  contextoHistorico: string;
  instrumentos: string[];
  imageUrl: string;
  audioUrl: string;
  videoUrl?: string;
  regiao: string;
  influencias: string[];
  premiacoes?: string[];
  popularidade: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Historia {
  tempoLeitura: any;
  id?: string;
  titulo: string;
  subtitulo?: string;
  conteudo: string;
  periodoHistorico: string;
  dataInicio: string;
  dataFim?: string;
  localizacao: string;
  personagensImportantes: string[];
  fontes: string[];
  imageUrl: string;
  galeria: string[];
  referencias: string[];
  relevanciaAtual: string;
  tags: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface PratoCulinario {
  id?: string;
  nome: string;
  nomeAlternativo?: string;
  descricao: string;
  ingredientes: Array<{
    nome: string;
    quantidade: string;
    opcional: boolean;
  }>;
  modoPreparo: string[];
  tempoPreparo: number; // em minutos
  dificuldade: 'fácil' | 'médio' | 'difícil';
  porcoes: number;
  regiao: string;
  origemHistorica?: string;
  curiosidades: string[];
  imageUrl: string;
  galeria: string[];
  videoReceita?: string;
  epocaEspecial?: string;
  tags: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Feriado {
  id?: string;
  nome: string;
  data: string; // Formato: YYYY-MM-DD
  dataMovel: boolean;
  descricao: string;
  origem: string;
  comoSeComemora: string[];
  feriadoNacional: boolean;
  regioesEspecificas?: string[];
  imageUrl: string;
  importanciaCultural: number; // 1-5
  feriadoReligioso: boolean;
  eventosEspeciais: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface LocalTuristico {
  id?: string;
  nome: string;
  tipo: 'histórico' | 'natural' | 'cultural' | 'religioso' | 'gastronômico' | 'outro';
  descricao: string;
  endereco: {
    rua: string;
    cidade: string;
    provincia: string;
    coordenadas: {
      latitude: number;
      longitude: number;
    };
  };
  horarioFuncionamento: string;
  precoIngresso?: number;
  melhoresEpocas: string[];
  comoChegar: string;
  contato: {
    telefone?: string;
    email?: string;
    website?: string;
  };
  imageUrl: string;
  galeria: string[];
  dicasVisita: string[];
  acessibilidade: boolean;
  tags: string[];
  avaliacaoMedia: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Evento {
  id?: string;
  titulo: string;
  descricao: string;
  dataInicio: Timestamp;
  dataFim: Timestamp;
  local: string;
  enderecoCompleto: string;
  tipo: 'cultural' | 'musical' | 'gastronomico' | 'religioso' | 'esportivo' | 'outro';
  categoria: 'gratuito' | 'pago' | 'doacao';
  preco?: number;
  urlIngressos?: string;
  organizador: string;
  contato: {
    telefone?: string;
    email?: string;
    website?: string;
  };
  imageUrl: string;
  galeria: string[];
  programacao: Array<{
    horario: string;
    atividade: string;
    responsavel?: string;
  }>;
  comoChegar: string;
  estacionamento: boolean;
  acessibilidade: boolean;
  restricaoIdade?: number;
  tags: string[];
  destaque: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
