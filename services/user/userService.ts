import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest,
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
      const token = useCookie('auth-token');
      
      const response = await $fetch<User[]>('/api/modules/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });
      
      return response;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const token = useCookie('auth-token');
      const response = await $fetch<User>(`/api/modules/users/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });
      return response[0]; // Assuming the API returns an array with one user
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const token = useCookie('auth-token');
      
      const response = await $fetch<User>('/api/modules/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
        body: userData,
      });
      
      return response;
    } catch (error) {
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
      throw new Error('Failed to delete user');
    }
  }
}
