import type { 
  Score, 
  ScoreApiResponse, 
  CreateScoreRequest, 
  UpdateScoreRequest,
  mapApiResponseToScore,
  mapApiResponseArrayToScores 
} from '~/types/score'

export class ScoreService {
  private static instance: ScoreService
  private baseUrl = '/api/modules/scores'

  private constructor() {}

  public static getInstance(): ScoreService {
    if (!ScoreService.instance) {
      ScoreService.instance = new ScoreService()
    }
    return ScoreService.instance
  }

  async getAllScores(): Promise<Score[]> {
    try {
      const token = useCookie('auth-token');
      
      const response = await $fetch<ScoreApiResponse[]>(this.baseUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })
      
      const { mapApiResponseArrayToScores } = await import('~/types/score')
      return mapApiResponseArrayToScores(response);
    } catch (error: any) {
      throw new Error(error?.data?.message || 'Failed to fetch scores')
    }
  }

  async getScoreById(id: number): Promise<Score> {
    try {
      const token = useCookie('auth-token');
      
      const response = await $fetch<ScoreApiResponse>(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })
      
      const { mapApiResponseToScore } = await import('~/types/score')
      return mapApiResponseToScore(response)
    } catch (error: any) {
      throw new Error(error?.data?.message || 'Failed to fetch score')
    }
  }

  async createScore(scoreData: CreateScoreRequest): Promise<Score> {
    try {
      const token = useCookie('auth-token');
      
      const response = await $fetch<ScoreApiResponse>(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
        body: scoreData
      })
      
      const { mapApiResponseToScore } = await import('~/types/score')
      return mapApiResponseToScore(response)
    } catch (error: any) {
      throw new Error(error?.data?.message || 'Failed to create score')
    }
  }

  async updateScore(id: number, scoreData: UpdateScoreRequest): Promise<Score> {
    try {
      const token = useCookie('auth-token');
      
      const response = await $fetch<ScoreApiResponse>(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
        body: scoreData
      })
      
      const { mapApiResponseToScore } = await import('~/types/score')
      return mapApiResponseToScore(response)
    } catch (error: any) {
      throw new Error(error?.data?.message || 'Failed to update score')
    }
  }

  async deleteScore(id: number): Promise<void> {
    try {
      const token = useCookie('auth-token');
      
      await $fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })
    } catch (error: any) {
      throw new Error(error?.data?.message || 'Failed to delete score')
    }
  }
}
