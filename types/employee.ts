// API Response type (from external API)
export interface EmployeeApiResponse {
  id_employee: number;
  name: string;
  image: string | null;
  imageBytes?: string | null;
}

// Internal Employee type (used in frontend) - only fields supported by backend
export interface Employee {
  id: number;
  name: string;
  image: string; // URL or path to the image
  imageBytes: string;
}

export interface CreateEmployeeRequest {
  name: string;
  imageBytes?: string;
}

export interface UpdateEmployeeRequest {
  name: string;
  imageBytes?: string;
}

export interface DeleteEmployeeRequest {
  id: number;
}

// Helper function to map API response to internal type
export const mapApiResponseToEmployee = (apiResponse: EmployeeApiResponse): Employee => {
  return {
    id: apiResponse.id_employee,
    name: apiResponse.name,
    image: apiResponse.image ? apiResponse.image : '',
    imageBytes: apiResponse.imageBytes || '',
  };
};

// Helper function to map array of API responses
export const mapApiResponseArrayToEmployees = (apiResponses: EmployeeApiResponse[]): Employee[] => {
  return apiResponses.map(mapApiResponseToEmployee);
};
