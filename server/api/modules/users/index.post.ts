import { mapApiResponseToUser, type UserApiResponse, type User } from '~/types/user';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  const body = await readBody(event);

  // Get the token from the request headers
  const authHeader = getHeader(event, 'authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required',
    });
  }
  
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
    throw createError({
      statusCode: 400,
      statusMessage: 'Employee ID is required and must be a number or string',
    });
  }

  // Convert id_employee to number if it's a string
  const employeeId = typeof body.id_employee === 'string' ? parseInt(body.id_employee, 10) : body.id_employee;
  
  if (isNaN(employeeId) || employeeId <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Employee ID must be a valid positive number',
    });
  }
  
  try {
    const userData = {
      name: body.name,
      password: body.password,
      id_employee: employeeId // Use the converted number
    };

    const response = await $fetch(`${apiBaseUrl}/Users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: userData,
    });

    // Handle different response formats more flexibly
    let mappedUser: User;
    
    if (response && typeof response === 'object' && (response as any).id_user !== undefined) {
      // Standard response format with id_user
      mappedUser = mapApiResponseToUser(response as UserApiResponse);
    } else if (response && typeof response === 'object' && (response as any).id !== undefined) {
      // Alternative format where id is used instead of id_user
      mappedUser = {
        id: (response as any).id,
        name: (response as any).name || body.name,
        password: (response as any).password || body.password,
        status: (response as any).status || true,
        role: (response as any).role || 'user',
        id_employee: (response as any).id_employee || employeeId
      };
    } else {
      // Fallback: create a temporary user
      mappedUser = {
        id: Date.now(), // temporary ID until we refresh the list
        name: body.name,
        password: body.password,
        status: true,
        role: 'user',
        id_employee: employeeId
      };
    }

    return mappedUser;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create user',
    });
  }
});
