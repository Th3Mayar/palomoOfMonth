import type { 
  Nominee, 
  NomineesFilters, 
  NomineesResponse, 
  GenerateNomineesRequest, 
  GenerateNomineesResponse 
} from '~/types/nominees'

export class NomineesService {
  private static instance: NomineesService

  static getInstance(): NomineesService {
    if (!NomineesService.instance) {
      NomineesService.instance = new NomineesService()
    }
    return NomineesService.instance
  }

  /**
   * Get nominees with optional filters
   */
  async getNominees(filters?: NomineesFilters): Promise<NomineesResponse> {
    try {
      const query = new URLSearchParams()
      
      if (filters?.startDate) {
        query.append('startDate', filters.startDate)
      }
      
      if (filters?.endDate) {
        query.append('endDate', filters.endDate)
      }
      
      if (filters?.idEmployee) {
        query.append('idEmployee', filters.idEmployee.toString())
      }

      const queryString = query.toString()
      const url = queryString ? `/api/modules/nominees?${queryString}` : '/api/modules/nominees'

      // Get auth token from cookies
      const token = useCookie('token').value

      const response = await $fetch<NomineesResponse>(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      return response
    } catch (error: any) {
      console.error('Error fetching nominees:', error)
      throw new Error(error?.data?.message || 'Failed to fetch nominees')
    }
  }

  /**
   * Generate nominees for a specific month
   */
  async generateNominees(request: GenerateNomineesRequest): Promise<GenerateNomineesResponse> {
    try {
      // Get auth token from cookies
      const token = useCookie('token').value

      const response = await $fetch<GenerateNomineesResponse>('/api/modules/nominees/GenerateNominees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: request
      })

      return response
    } catch (error: any) {
      console.error('Error generating nominees:', error)
      throw new Error(error?.data?.message || 'Failed to generate nominees')
    }
  }

  /**
   * Get nominees for current month
   */
  async getCurrentMonthNominees(): Promise<Nominee[]> {
    try {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      const filters: NomineesFilters = {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0]
      }

      const response = await this.getNominees(filters)
      return response.data
    } catch (error) {
      console.error('Error fetching current month nominees:', error)
      throw error
    }
  }

  /**
   * Get nominees by employee ID
   */
  async getNomineesByEmployee(idEmployee: number): Promise<Nominee[]> {
    try {
      const response = await this.getNominees({ idEmployee })
      return response.data
    } catch (error) {
      console.error('Error fetching nominees by employee:', error)
      throw error
    }
  }
}