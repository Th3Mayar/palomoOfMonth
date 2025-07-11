import type { 
  Employee, 
  CreateEmployeeRequest, 
  UpdateEmployeeRequest,
  EmployeeApiResponse,
  mapApiResponseToEmployee,
  mapApiResponseArrayToEmployees
} from '~/types/employee';

export class EmployeeService {
  private static instance: EmployeeService;
  private config = useRuntimeConfig();
  private apiClient = useApiClient();

  private constructor() {}

  public static getInstance(): EmployeeService {
    if (!EmployeeService.instance) {
      EmployeeService.instance = new EmployeeService();
    }
    return EmployeeService.instance;
  }

  private getApiUrl(endpoint: string): string {
    return `${this.config.public.apiBaseUrl}${endpoint}`;
  }

  async getAllEmployees(): Promise<Employee[]> {
    try {
      console.log('🔍 EmployeeService: Starting to fetch employees...');
      const token = useCookie('auth-token');
      console.log('🔑 Token value:', token.value ? 'Token exists' : 'No token');
      
      const response = await $fetch<Employee[]>('/api/modules/employees', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });
      
      console.log('✅ EmployeeService: Raw response from API:', response);
      console.log('📊 EmployeeService: Response type:', typeof response, 'Is array:', Array.isArray(response));
      console.log('📏 EmployeeService: Response length:', response?.length);
      
      return response;
    } catch (error) {
      console.error('❌ EmployeeService: Error fetching employees:', error);
      throw new Error('Failed to fetch employees');
    }
  }

  async createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    try {
      console.log('🔧 EmployeeService - createEmployee called with data:', employeeData);
      console.log('🔧 EmployeeService - employeeData keys:', Object.keys(employeeData));
      console.log('🔧 EmployeeService - employeeData.name:', employeeData.name);
      console.log('🔧 EmployeeService - employeeData.imageBytes length:', employeeData.imageBytes?.length || 0);
      console.log('🔧 EmployeeService - typeof employeeData.name:', typeof employeeData.name);
      console.log('🔧 EmployeeService - typeof employeeData.imageBytes:', typeof employeeData.imageBytes);
      
      const token = useCookie('auth-token');
      console.log('🔧 EmployeeService - Sending POST request with body:', {
        name: employeeData.name,
        imageBytes: employeeData.imageBytes ? `${employeeData.imageBytes.substring(0, 50)}...` : 'NO IMAGE'
      });
      
      const response = await $fetch<Employee>('/api/modules/employees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
        body: employeeData,
      });
      
      console.log('🔧 EmployeeService - Received response:', response);
      console.log('🔧 EmployeeService - Response imageBytes length:', response.imageBytes?.length || 0);
      return response;
    } catch (error) {
      console.error('🔧 EmployeeService - Error creating employee:', error);
      throw new Error('Failed to create employee');
    }
  }

  async updateEmployee(id: number, employeeData: UpdateEmployeeRequest): Promise<Employee> {
    try {
      const token = useCookie('auth-token');
      const response = await $fetch<Employee>(`/api/modules/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
        body: employeeData,
      });
      return response;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error('Failed to update employee');
    }
  }

  async deleteEmployee(id: number): Promise<void> {
    try {
      const token = useCookie('auth-token');
      await $fetch(`/api/modules/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error('Failed to delete employee');
    }
  }

  convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64String = reader.result.toString().split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  }
}
