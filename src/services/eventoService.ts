import { BaseService } from './baseService';
import { Evento } from '../types/modules';
import { Timestamp } from 'firebase/firestore';

export class EventoService extends BaseService<Evento> {
  constructor() {
    super('eventos');
  }

  async getUpcomingEvents(limit: number = 10): Promise<Evento[]> {
    const now = Timestamp.now();
    const allEvents = await this.getAll();
    
    return allEvents
      .filter(event => {
        const eventDate = event.dataInicio;
        return eventDate >= now;
      })
      .sort((a, b) => a.dataInicio.toMillis() - b.dataInicio.toMillis())
      .slice(0, limit);
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<Evento[]> {
    const start = Timestamp.fromDate(startDate);
    const end = Timestamp.fromDate(endDate);
    
    const allEvents = await this.getAll();
    return allEvents.filter(event => 
      event.dataInicio >= start && 
      event.dataInicio <= end
    ).sort((a, b) => a.dataInicio.toMillis() - b.dataInicio.toMillis());
  }

  async getEventsByType(tipo: Evento['tipo']): Promise<Evento[]> {
    return this.query([
      { field: 'tipo', op: '==', value: tipo }
    ], 'dataInicio');
  }

  async getEventsByLocation(location: string): Promise<Evento[]> {
    const allEvents = await this.getAll();
    const locationLower = location.toLowerCase();
    
    return allEvents.filter(event => 
      event.local.toLowerCase().includes(locationLower) ||
      event.enderecoCompleto.toLowerCase().includes(locationLower)
    ).sort((a, b) => a.dataInicio.toMillis() - b.dataInicio.toMillis());
  }

  async getFeaturedEvents(limit: number = 5): Promise<Evento[]> {
    const now = Timestamp.now();
    const allEvents = await this.getAll();
    
    return allEvents
      .filter(event => event.destaque && event.dataInicio >= now)
      .sort((a, b) => a.dataInicio.toMillis() - b.dataInicio.toMillis())
      .slice(0, limit);
  }

  async searchEvents(term: string): Promise<Evento[]> {
    const termLower = term.toLowerCase();
    const allEvents = await this.getAll();
    
    return allEvents.filter(event => 
      event.titulo.toLowerCase().includes(termLower) ||
      event.descricao.toLowerCase().includes(termLower) ||
      event.organizador.toLowerCase().includes(termLower) ||
      event.tags.some(tag => tag.toLowerCase().includes(termLower))
    ).sort((a, b) => a.dataInicio.toMillis() - b.dataInicio.toMillis());
  }

  async getEventsByOrganizer(organizer: string): Promise<Evento[]> {
    const organizerLower = organizer.toLowerCase();
    return this.query([
      { field: 'organizador', op: '>=', value: organizerLower },
      { field: 'organizador', op: '<=', value: organizerLower + '\uf8ff' }
    ], 'dataInicio');
  }

  async getFreeEvents(): Promise<Evento[]> {
    return this.query([
      { field: 'categoria', op: '==', value: 'gratuito' }
    ], 'dataInicio');
  }
}

export const eventoService = new EventoService();
