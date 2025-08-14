import { BaseService } from './baseService';
import { Feriado } from '../types/modules';

export class FeriadoService extends BaseService<Feriado> {
  constructor() {
    super('feriados');
  }

  async getByYear(year: number): Promise<Feriado[]> {
    const allHolidays = await this.getAll();
    return allHolidays.filter(holiday => {
      const holidayYear = new Date(holiday.data).getFullYear();
      return holidayYear === year;
    });
  }

  async getUpcoming(limit: number = 5): Promise<Feriado[]> {
    const allHolidays = await this.getAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allHolidays
      .filter(holiday => {
        const holidayDate = new Date(holiday.data);
        holidayDate.setFullYear(today.getFullYear()); // Normalize to current year for comparison
        return holidayDate >= today;
      })
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, limit);
  }

  async getNationalHolidays(): Promise<Feriado[]> {
    return this.query([
      { field: 'feriadoNacional', op: '==', value: true }
    ], 'data');
  }

  async getReligiousHolidays(): Promise<Feriado[]> {
    return this.query([
      { field: 'feriadoReligioso', op: '==', value: true }
    ], 'data');
  }

  async getByMonth(month: number): Promise<Feriado[]> {
    const allHolidays = await this.getAll();
    return allHolidays.filter(holiday => {
      const holidayMonth = new Date(holiday.data).getMonth() + 1; // getMonth() is 0-indexed
      return holidayMonth === month;
    });
  }

  async searchByNameOrDescription(term: string): Promise<Feriado[]> {
    const termLower = term.toLowerCase();
    const allHolidays = await this.getAll();
    
    return allHolidays.filter(holiday => 
      holiday.nome.toLowerCase().includes(termLower) ||
      holiday.descricao.toLowerCase().includes(termLower) ||
      holiday.origem.toLowerCase().includes(termLower)
    );
  }
}

export const feriadoService = new FeriadoService();
