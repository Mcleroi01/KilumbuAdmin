import { BaseService } from './baseService';
import { Historia } from '../types/modules';

export class HistoriaService extends BaseService<Historia> {
  constructor() {
    super('historias');
  }

  async searchByTitleOrContent(term: string): Promise<Historia[]> {
    const termLower = term.toLowerCase();
    const allStories = await this.getAll();
    
    return allStories.filter(story => 
      story.titulo.toLowerCase().includes(termLower) || 
      (story.subtitulo?.toLowerCase().includes(termLower) || false) ||
      story.conteudo.toLowerCase().includes(termLower) ||
      story.tags.some(tag => tag.toLowerCase().includes(termLower))
    );
  }

  async getByPeriod(periodo: string): Promise<Historia[]> {
    return this.query([
      { field: 'periodoHistorico', op: '==', value: periodo }
    ], 'dataInicio', 'desc');
  }

  async getByLocation(localizacao: string): Promise<Historia[]> {
    return this.query([
      { field: 'localizacao', op: '==', value: localizacao }
    ], 'titulo');
  }

  async getByTag(tag: string): Promise<Historia[]> {
    const allStories = await this.getAll();
    return allStories.filter(story => 
      story.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  async getRecent(limit: number = 5): Promise<Historia[]> {
    const allStories = await this.getAll();
    return allStories
      .sort((a, b) => {
        const dateA = a.updatedAt?.toDate() || new Date(0);
        const dateB = b.updatedAt?.toDate() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  }
}

export const historiaService = new HistoriaService();
