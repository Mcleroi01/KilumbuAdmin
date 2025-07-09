export interface Province {
  id?: string;
  nom: string;
  capitale: string;
  superficie: number;
  population: number;
  climat: string;
  description: string;
  imagePath?: string;
  mapPath?: string;
  photos?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HeroiNacional {
  id?: string;
  nome: string;
  biografia: string;
  imageUrl: string;
  localNascimento: string;
  dataNascimento: string;
  dataFalecimento?: string;
  contexteHistorico: string;
  contribuicoes: string[];
  citations: string[];
  reconhecidoOficialmente: boolean;
  dataReconhecimento?: string;
  hommages: string[];
}

export interface LinguaNacional {
  id?: string; // auto-généré par Firebase
  nome: string;
  imageUrl: string;
  region: string;
  locutores: number;
  familiaLinguistica: string;
  descricao: string;
  reconhecidaOficialmente: boolean;
  dialectos: string[];
  usosCulturais: string[];
  iniciativasPreservacao: string[];
  exemplosFrases: string[];
  urlAula: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ParcNaturel {
  id?: string; // pour Firebase
  nom: string;
  description: string;
  localisation: string;
  superficie: string;
  dateCreation: string;
  images: string[]; // URLs des images secondaires
  especesProtegees: string[]; // Espèces importantes
  patrimoineUnesco: boolean;
  climat: string;
  typeVegetation: string;
  activitesDisponibles: string;
  acces: string;
  conseilsVisite: string;
  siteWeb: string;
  imagePrincipale: string;
}

export interface President {
  id?: string; // Firebase ID
  nom: string;
  dateNais: string;
  dateMandat: string;
  description: string;
  imagePath: string;
  photos: string[];
  profissao: string;
  partido: string;
  religiao: string;
}




export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}