// Types for Nominees
export interface Nominee {
  id: number
  id_employee: number
  nomination_date: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  employee_name?: string
  employee_position?: string
  nominator_name?: string
}

export interface NomineesFilters {
  startDate?: string
  endDate?: string
  idEmployee?: number
}

export interface NomineesResponse {
  success: boolean
  data: Nominee[]
  total: number
  filters: NomineesFilters
}

export interface GenerateNomineesRequest {
  month: number
  max_quantity: number
}

export interface GenerateNomineesResponse {
  success: boolean
  message: string
  data: {
    month: number
    year: number
    max_quantity: number
    generated_count: number
    nominees: Nominee[]
  }
}