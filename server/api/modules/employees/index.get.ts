import { mapApiResponseArrayToEmployees, type EmployeeApiResponse } from '~/types/employee';

export default defineEventHandler(async (event) => {
  console.log('🔥 API: Received request to /api/modules/employees');
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  console.log('🌐 API: Base URL:', apiBaseUrl);
  
  // Get the token from the request headers
  const authHeader = getHeader(event, 'authorization');
  const token = authHeader?.replace('Bearer ', '');
  console.log('🔑 API: Token received:', token ? 'Yes' : 'No');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required',
    });
  }
  
  try {
    console.log('📡 API: Making request to external API...');
    const response = await $fetch(`${apiBaseUrl}/Employees`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }) as EmployeeApiResponse[];

    console.log('✅ API: Response from external API:', response);
    console.log('📊 API: Response type:', typeof response, 'Is array:', Array.isArray(response));

    // Map the API response to our internal format
    const mappedEmployees = mapApiResponseArrayToEmployees(response);
    console.log('🔄 API: Mapped employees:', mappedEmployees);

    return mappedEmployees;
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch employees',
    });
  }
});
