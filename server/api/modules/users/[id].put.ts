import { mapApiResponseToUser, type UserApiResponse, type User } from '~/types/user';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  const body = await readBody(event);
  const userId = getRouterParam(event, 'id');

  console.log('🔥 PUT /users/[id] - User ID:', userId);
  console.log('🔥 PUT /users/[id] - Received body:', body);

  // Get the token from the request headers
  const authHeader = getHeader(event, 'authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required',
    });
  }

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required',
    });
  }

  // Validate required fields
  if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required and must be a non-empty string',
    });
  }

  if (!body.password || typeof body.password !== 'string' || body.password.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password is required and must be a non-empty string',
    });
  }

  if (!body.id_employee || (typeof body.id_employee !== 'number' && typeof body.id_employee !== 'string')) {
    console.log('🔥 PUT /users/[id] - id_employee validation failed');
    console.log('🔥 PUT /users/[id] - body.id_employee value:', body.id_employee);
    console.log('🔥 PUT /users/[id] - body.id_employee type:', typeof body.id_employee);
    throw createError({
      statusCode: 400,
      statusMessage: 'Employee ID is required and must be a number or string',
    });
  }

  // Convert id_employee to number if it's a string
  const employeeId = typeof body.id_employee === 'string' ? parseInt(body.id_employee, 10) : body.id_employee;
  
  if (isNaN(employeeId) || employeeId <= 0) {
    console.log('🔥 PUT /users/[id] - Invalid employee ID after conversion:', employeeId);
    throw createError({
      statusCode: 400,
      statusMessage: 'Employee ID must be a valid positive number',
    });
  }

  try {
    const userData = {
      name: body.name,
      password: body.password,
      role: 'user', // Add default role
      id_employee: employeeId // Use the converted number
    };

    console.log('🔥 Updating user with data:', {
      name: userData.name,
      password: '[HIDDEN]',
      role: userData.role,
      id_employee: userData.id_employee
    });

    const response = await $fetch(`${apiBaseUrl}/Users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: userData,
    });

    console.log('🔥 PUT Response:', response);

    // Handle different response formats
    let mappedUser: User;
    
    if (response && typeof response === 'object' && (response as any).id_user !== undefined) {
      mappedUser = mapApiResponseToUser(response as UserApiResponse);
    } else if (response && typeof response === 'object' && (response as any).id !== undefined) {
      mappedUser = {
        id: (response as any).id,
        name: (response as any).name || body.name,
        password: (response as any).password || body.password,
        status: (response as any).status || true,
        role: (response as any).role || 'user',
        id_employee: (response as any).id_employee || employeeId
      };
    } else {
      // Fallback
      mappedUser = {
        id: parseInt(userId),
        name: body.name,
        password: body.password,
        status: true,
        role: 'user',
        id_employee: employeeId
      };
    }

    return mappedUser;
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to update user',
    });
  }
});
