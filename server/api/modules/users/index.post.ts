import { mapApiResponseToUser, type UserApiResponse, type User } from '~/types/user';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  const body = await readBody(event);

  console.log('🔥 POST /users - Received body:', body);
  console.log('🔥 POST /users - body.name:', body.name);
  console.log('🔥 POST /users - body.password:', body.password ? '[HIDDEN]' : 'NO PASSWORD');
  console.log('🔥 POST /users - body.id_employee:', body.id_employee);
  console.log('🔥 POST /users - typeof body.name:', typeof body.name);
  console.log('🔥 POST /users - body keys:', Object.keys(body));

  // Get the token from the request headers
  const authHeader = getHeader(event, 'authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required',
    });
  }

  // Validate required fields
  console.log('🔥 POST /users - Validating fields...');
  console.log('🔥 POST /users - !body.name:', !body.name);
  console.log('🔥 POST /users - !body.password:', !body.password);
  console.log('🔥 POST /users - !body.id_employee:', !body.id_employee);
  
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
    console.log('🔥 POST /users - id_employee validation failed');
    console.log('🔥 POST /users - body.id_employee value:', body.id_employee);
    console.log('🔥 POST /users - body.id_employee type:', typeof body.id_employee);
    throw createError({
      statusCode: 400,
      statusMessage: 'Employee ID is required and must be a number or string',
    });
  }

  // Convert id_employee to number if it's a string
  const employeeId = typeof body.id_employee === 'string' ? parseInt(body.id_employee, 10) : body.id_employee;
  
  if (isNaN(employeeId) || employeeId <= 0) {
    console.log('🔥 POST /users - Invalid employee ID after conversion:', employeeId);
    throw createError({
      statusCode: 400,
      statusMessage: 'Employee ID must be a valid positive number',
    });
  }
  
  console.log('🔥 POST /users - Validation passed');

  try {
    const userData = {
      name: body.name,
      password: body.password,
      status: true, // Add default status
      role: 'user', // Add default role
      id_employee: employeeId // Use the converted number
    };

    console.log('🔥 Creating user with data:', {
      name: userData.name,
      password: '[HIDDEN]',
      role: userData.role,
      id_employee: userData.id_employee
    });

    const response = await $fetch(`${apiBaseUrl}/Users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: userData,
    });

    console.log('🔥 POST Response:', response);
    console.log('🔥 POST Response type:', typeof response);
    console.log('🔥 POST Response keys:', response ? Object.keys(response) : 'NO RESPONSE');

    // Handle different response formats more flexibly
    let mappedUser: User;
    
    if (response && typeof response === 'object' && (response as any).id_user !== undefined) {
      // Standard response format with id_user
      console.log('🔥 Using standard response format with id_user');
      mappedUser = mapApiResponseToUser(response as UserApiResponse);
      console.log('🔥 Mapped user (standard):', mappedUser);
    } else if (response && typeof response === 'object' && (response as any).id !== undefined) {
      // Alternative format where id is used instead of id_user
      console.log('🔥 Using alternative response format with id');
      mappedUser = {
        id: (response as any).id,
        name: (response as any).name || body.name,
        password: (response as any).password || body.password,
        status: (response as any).status || true,
        role: (response as any).role || 'user',
        id_employee: (response as any).id_employee || employeeId
      };
      console.log('🔥 Mapped user (alternative):', mappedUser);
    } else {
      // Fallback: create a temporary user
      console.log('🔥 Using fallback response format');
      mappedUser = {
        id: Date.now(), // temporary ID until we refresh the list
        name: body.name,
        password: body.password,
        status: true,
        role: 'user',
        id_employee: employeeId
      };
      console.log('🔥 Mapped user (fallback):', mappedUser);
    }

    return mappedUser;
  } catch (error: any) {
    console.error('Error creating user:', error);
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data
    });
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create user',
    });
  }
});
