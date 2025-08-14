import { BaseService } from './baseService';
import { Musica } from '../types/modules';

export class MusicaService extends BaseService<Musica> {
  constructor() {
    super('musicas');
  }

  async searchByTitleOrArtist(term: string): Promise<Musica[]> {
    const termLower = term.toLowerCase();
    const allSongs = await this.getAll();
    
    return allSongs.filter(song => 
      song.titulo.toLowerCase().includes(termLower) || 
      song.artista.toLowerCase().includes(termLower) ||
      song.letra.toLowerCase().includes(termLower)
    );
  }

  async getByGenre(genero: string): Promise<Musica[]> {
    return this.query([
      { field: 'genero', op: '==', value: genero }
    ], 'titulo');
  }

  async getByRegion(regiao: string): Promise<Musica[]> {
    return this.query([
      { field: 'regiao', op: '==', value: regiao }
    ], 'titulo');
  }

  async getPopular(limit: number = 10): Promise<Musica[]> {
    const allSongs = await this.getAll();
    return allSongs
      .sort((a, b) => (b.popularidade || 0) - (a.popularidade || 0))
      .slice(0, limit);
  }

  async getByYear(year: number): Promise<Musica[]> {
    return this.query([
      { field: 'anoLancamento', op: '==', value: year }
    ], 'titulo');
  }
}

export const musicaService = new MusicaService();
