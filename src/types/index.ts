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