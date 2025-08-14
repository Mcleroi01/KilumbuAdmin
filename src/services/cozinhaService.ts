import { BaseService } from './baseService';
import { PratoCulinario } from '../types/modules';

export class CozinhaService extends BaseService<PratoCulinario> {
  constructor() {
    super('pratos_culinarios');
  }

  async searchByNameOrIngredient(term: string): Promise<PratoCulinario[]> {
    const termLower = term.toLowerCase();
    const allDishes = await this.getAll();
    
    return allDishes.filter(dish => 
      dish.nome.toLowerCase().includes(termLower) ||
      (dish.nomeAlternativo?.toLowerCase().includes(termLower) || false) ||
      dish.ingredientes.some(ing => ing.nome.toLowerCase().includes(termLower)) ||
      dish.tags.some(tag => tag.toLowerCase().includes(termLower))
    );
  }

  async getByRegion(regiao: string): Promise<PratoCulinario[]> {
    return this.query([
      { field: 'regiao', op: '==', value: regiao }
    ], 'nome');
  }

  async getByDifficulty(dificuldade: 'fácil' | 'médio' | 'difícil'): Promise<PratoCulinario[]> {
    return this.query([
      { field: 'dificuldade', op: '==', value: dificuldade }
    ], 'nome');
  }

  async getByIngredient(ingrediente: string): Promise<PratoCulinario[]> {
    const allDishes = await this.getAll();
    const ingredienteLower = ingrediente.toLowerCase();
    
    return allDishes.filter(dish => 
      dish.ingredientes.some(ing => 
        ing.nome.toLowerCase().includes(ingredienteLower)
      )
    );
  }

  async getSeasonal(season: string): Promise<PratoCulinario[]> {
    const allDishes = await this.getAll();
    return allDishes.filter(dish => 
      !dish.epocaEspecial || dish.epocaEspecial.toLowerCase().includes(season.toLowerCase())
    );
  }

  async getQuickMeals(maxTime: number): Promise<PratoCulinario[]> {
    return this.query([
      { field: 'tempoPreparo', op: '<=', value: maxTime }
    ], 'tempoPreparo');
  }
}

export const cozinhaService = new CozinhaService();
