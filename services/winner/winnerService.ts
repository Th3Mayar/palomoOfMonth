import type { Employee, mapApiResponseToEmployee } from '~/types/employee'

export class WinnerService {
  static instance: WinnerService | null = null;

  static getInstance() {
    if (!WinnerService.instance) {
      WinnerService.instance = new WinnerService();
    }
    return WinnerService.instance;
  }

  // Get all winners
  async getAllWinners() {
    try {
      const response = await $fetch('/api/modules/winners', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get winner for current month
  async getCurrentMonthWinner(idEmployee: string) {
    const now = new Date();
    const month = now.getMonth() + 1; 
    const year = now.getFullYear();
    try {
      const response = await $fetch('/api/modules/winners', {
        method: 'GET',
        params: {
          idEmployee,
          month,
          year,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Generate winner for current month
  async generateCurrentMonthWinner() {
    const now = new Date();
    const month = now.getMonth() + 1; 
    const year = now.getFullYear();

    try {
      const response = await $fetch('/api/modules/winners/generate', {
        method: 'POST',
        body: {
          month,
          year,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}