import { mapApiResponseToEmployee, type EmployeeApiResponse, type Employee } from '~/types/employee';

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
  
  if (!body.name || body.name.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required',
    });
  }
  
  try {
    const employeeData = {
      name: body.name,
      imageBytes: body.imageBytes || ""
    };

    const response = await $fetch(`${apiBaseUrl}/Employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: employeeData,
    });

    // Handle different response formats more flexibly
    let mappedEmployee: Employee;
    
    if (response && typeof response === 'object' && (response as any).id_employee !== undefined) {
      // Standard response format with id_employee
      mappedEmployee = mapApiResponseToEmployee(response as EmployeeApiResponse);
    } else if (response && typeof response === 'object' && (response as any).id !== undefined) {
      // Alternative format where id is used instead of id_employee
      mappedEmployee = {
        id: (response as any).id,
        name: (response as any).name || body.name,
        image: (response as any).image || '',
        imageBytes: (response as any).imageBytes || body.imageBytes || ''
      };
    } else {
      // For POST, we should try to get all employees to find the newly created one
      // or return with a temporary ID
      mappedEmployee = {
        id: Date.now(), // temporary ID until we refresh the list
        name: body.name,
        image: body.image || '',
        imageBytes: body.imageBytes || ''
      };
    }

    return mappedEmployee;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create employee',
    });
  }
});
