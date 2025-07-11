import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest,
  UserApiResponse,
  mapApiResponseToUser,
  mapApiResponseArrayToUsers
} from '~/types/user';

export class UserService {
  private static instance: UserService;
  private config = useRuntimeConfig();

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getAllUsers(): Promise<User[]> {
    try {
      console.log('🔍 UserService: Starting to fetch users...');
      const token = useCookie('auth-token');
      console.log('🔑 Token value:', token.value ? 'Token exists' : 'No token');
      
      const response = await $fetch<User[]>('/api/modules/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });
      
      console.log('✅ UserService: Raw response from API:', response);
      console.log('📊 UserService: Response type:', typeof response, 'Is array:', Array.isArray(response));
      console.log('📏 UserService: Response length:', response?.length);
      
      return response;
    } catch (error) {
      console.error('❌ UserService: Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      console.log('🔧 UserService - createUser called with data:', userData);
      console.log('🔧 UserService - userData keys:', Object.keys(userData));
      console.log('🔧 UserService - userData.name:', userData.name);
      console.log('🔧 UserService - userData.id_employee:', userData.id_employee);
      console.log('🔧 UserService - typeof userData.name:', typeof userData.name);
      
      const token = useCookie('auth-token');
      console.log('🔧 UserService - Sending POST request with body:', userData);
      
      const response = await $fetch<User>('/api/modules/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
        body: userData,
      });
      
      console.log('🔧 UserService - Received response:', response);
      return response;
    } catch (error) {
      console.error('🔧 UserService - Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    try {
      const token = useCookie('auth-token');
      const response = await $fetch<User>(`/api/modules/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
        body: userData,
      });
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const token = useCookie('auth-token');
      await $fetch(`/api/modules/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
}
