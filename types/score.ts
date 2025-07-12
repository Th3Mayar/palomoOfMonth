// API Response type (from external API)
export interface ScoreApiResponse {
  id_score: number;
  id_employee: number;
  date: string; // ISO string
  score: number;
  reason: string;
  employee?: {
    id_employee: number;
    name: string;
    image: string | null;
  };
}

// Internal Score type (used in frontend)
export interface Score {
  id: number;
  employeeId: number;
  employeeName?: string;
  date: Date;
  score: number;
  reason: string;
}

export interface CreateScoreRequest {
  id_employee: number;
  date: string; // ISO string
  score: number;
  reason: string;
}

export interface UpdateScoreRequest {
  id_employee: number;
  date: string; // ISO string  
  score: number;
  reason: string;
}

export interface DeleteScoreRequest {
  id: number;
}

// Helper function to map API response to internal type
export const mapApiResponseToScore = (apiResponse: ScoreApiResponse): Score => {
  return {
    id: apiResponse.id_score,
    employeeId: apiResponse.id_employee,
    employeeName: apiResponse.employee?.name || '',
    date: new Date(apiResponse.date),
    score: apiResponse.score,
    reason: apiResponse.reason,
  };
};

// Helper function to map array of API responses
export const mapApiResponseArrayToScores = (apiResponses: ScoreApiResponse[]): Score[] => {
  return apiResponses.map(mapApiResponseToScore);
};

// Helper function to format date for API
export const formatDateForApi = (date: Date): string => {
  return date.toISOString();
};
