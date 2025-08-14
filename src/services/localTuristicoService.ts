import { BaseService } from './baseService';
import { LocalTuristico } from '../types/modules';

export class LocalTuristicoService extends BaseService<LocalTuristico> {
  constructor() {
    super('locais_turisticos');
  }

  async searchByNameOrDescription(term: string): Promise<LocalTuristico[]> {
    const termLower = term.toLowerCase();
    const allLocations = await this.getAll();
    
    return allLocations.filter(location => 
      location.nome.toLowerCase().includes(termLower) ||
      location.descricao.toLowerCase().includes(termLower) ||
      location.tags.some(tag => tag.toLowerCase().includes(termLower))
    );
  }

  async getByType(tipo: LocalTuristico['tipo']): Promise<LocalTuristico[]> {
    return this.query([
      { field: 'tipo', op: '==', value: tipo }
    ], 'nome');
  }

  async getByProvince(provincia: string): Promise<LocalTuristico[]> {
    return this.query([
      { field: 'endereco.provincia', op: '==', value: provincia }
    ], 'nome');
  }

  async getByCity(cidade: string): Promise<LocalTuristico[]> {
    return this.query([
      { field: 'endereco.cidade', op: '==', value: cidade }
    ], 'nome');
  }

  async getTopRated(limit: number = 10): Promise<LocalTuristico[]> {
    const allLocations = await this.getAll();
    return allLocations
      .filter(location => location.avaliacaoMedia > 0)
      .sort((a, b) => (b.avaliacaoMedia || 0) - (a.avaliacaoMedia || 0))
      .slice(0, limit);
  }

  async getAccessibleLocations(): Promise<LocalTuristico[]> {
    return this.query([
      { field: 'acessibilidade', op: '==', value: true }
    ], 'nome');
  }

  async getFreeEntryLocations(): Promise<LocalTuristico[]> {
    const allLocations = await this.getAll();
    return allLocations.filter(location => 
      location.precoIngresso === undefined || 
      location.precoIngresso === 0
    );
  }

  async searchNearby(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 10
  ): Promise<LocalTuristico[]> {
    const allLocations = await this.getAll();
    
    const toRad = (value: number) => value * Math.PI / 180;
    const R = 6371; // Earth's radius in km
    
    return allLocations.filter(location => {
      if (!location.endereco.coordenadas) return false;
      
      const lat1 = location.endereco.coordenadas.latitude;
      const lon1 = location.endereco.coordenadas.longitude;
      const lat2 = latitude;
      const lon2 = longitude;
      
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      return distance <= radiusKm;
    });
  }
}

export const localTuristicoService = new LocalTuristicoService();
