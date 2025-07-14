import { mapApiResponseToUser, type UserApiResponse, type User } from '~/types/user';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  const body = await readBody(event);
  
  // Try multiple ways to get the user ID
  let userId = getRouterParam(event, 'id');
  
  // Alternative method using event.context.params
  if (!userId && event.context?.params?.id) {
    userId = event.context.params.id;
  }
  
  // If still no userId, try extracting from URL
  if (!userId) {
    const url = event.node?.req?.url || '';
    const match = url.match(/\/users\/([^\/\?]+)/);
    userId = match ? match[1] : undefined;
  }

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

    const response = await $fetch(`${apiBaseUrl}/Users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: userData,
    });

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
        role: body.role || 'user',
        id_employee: employeeId
      };
    }

    return mappedUser;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to update user',
    });
  }
});
