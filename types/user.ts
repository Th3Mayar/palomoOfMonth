// API Response type (from external API)
export interface UserApiResponse {
  id_user: number;
  name: string;
  password: string;
  status: boolean;
  role: string;
  id_employee: number;
}

// Internal User type (used in frontend)
export interface User {
  id: number;
  name: string;
  password: string;
  status: boolean;
  role: string;
  id_employee: number;
}

export interface CreateUserRequest {
  name: string;
  password: string;
  id_employee: number;
}

export interface UpdateUserRequest {
  name: string;
  password: string;
  id_employee: number;
}

export interface DeleteUserRequest {
  id: number;
}

// Helper function to map API response to internal type
export const mapApiResponseToUser = (apiResponse: UserApiResponse): User => {
  return {
    id: apiResponse.id_user,
    name: apiResponse.name,
    password: apiResponse.password,
    status: apiResponse.status,
    role: apiResponse.role,
    id_employee: apiResponse.id_employee,
  };
};

// Helper function to map array of API responses
export const mapApiResponseArrayToUsers = (apiResponses: UserApiResponse[]): User[] => {
  return apiResponses.map(mapApiResponseToUser);
};
