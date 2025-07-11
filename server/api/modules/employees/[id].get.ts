import { mapApiResponseToEmployee, type EmployeeApiResponse, type Employee } from '~/types/employee';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  const id = getRouterParam(event, 'id');

  // Get the token from the request headers
  const authHeader = getHeader(event, 'authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required',
    });
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Employee ID is required',
    });
  }

  try {

    const response = await $fetch(`${apiBaseUrl}/Employees/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }) as EmployeeApiResponse;

    // Handle different response formats
    let mappedEmployee: Employee;
    
    if (response && typeof response === 'object' && response.id_employee !== undefined) {
      // Standard response format with id_employee
      mappedEmployee = mapApiResponseToEmployee(response);
    } else if (response && typeof response === 'object' && (response as any).id !== undefined) {
      // Alternative format where id is used instead of id_employee
      mappedEmployee = {
        id: (response as any).id,
        name: (response as any).name,
        image: (response as any).image || '',
        imageBytes: (response as any).imageBytes || ''
      };
    } else {
      throw new Error('Invalid response format from API');
    }

    return mappedEmployee;
  } catch (error: any) {
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch employee',
    });
  }
});
