import { mapApiResponseToEmployee, type EmployeeApiResponse, type Employee } from '~/types/employee';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  const body = await readBody(event);

  console.log('🔥 POST /employees - Received body:', body);
  console.log('🔥 POST /employees - body.name:', body.name);
  console.log('🔥 POST /employees - body.imageBytes length:', body.imageBytes?.length || 0);
  console.log('🔥 POST /employees - typeof body.name:', typeof body.name);
  console.log('🔥 POST /employees - typeof body.imageBytes:', typeof body.imageBytes);
  console.log('🔥 POST /employees - body keys:', Object.keys(body));

  // Get the token from the request headers
  const authHeader = getHeader(event, 'authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required',
    });
  }

  // Validate required fields - let's be more specific about what we're checking
  console.log('🔥 POST /employees - Validating name...');
  console.log('🔥 POST /employees - !body.name:', !body.name);
  console.log('🔥 POST /employees - body.name === "":', body.name === '');
  console.log('🔥 POST /employees - body.name === undefined:', body.name === undefined);
  console.log('🔥 POST /employees - body.name === null:', body.name === null);
  
  if (!body.name || body.name.trim() === '') {
    console.log('POST /employees - Validation failed: Name is required');
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required',
    });
  }
  
  console.log('POST /employees - Validation passed');

  try {
    const employeeData = {
      name: body.name,
      imageBytes: body.imageBytes || ""
    };

    console.log('🔥 Creating employee with data:', {
      name: employeeData.name,
      imageBytes: employeeData.imageBytes ? `${employeeData.imageBytes.substring(0, 50)}...` : 'NO IMAGE',
      imageBytesLength: employeeData.imageBytes?.length || 0
    });

    const response = await $fetch(`${apiBaseUrl}/Employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: employeeData,
    });

    console.log('🔥 POST Response:', response);
    console.log('🔥 POST Response type:', typeof response);
    console.log('🔥 POST Response keys:', response ? Object.keys(response) : 'NO RESPONSE');

    // Handle different response formats more flexibly
    let mappedEmployee: Employee;
    
    if (response && typeof response === 'object' && (response as any).id_employee !== undefined) {
      // Standard response format with id_employee
      console.log('🔥 Using standard response format with id_employee');
      mappedEmployee = mapApiResponseToEmployee(response as EmployeeApiResponse);
      console.log('🔥 Mapped employee (standard):', mappedEmployee);
    } else if (response && typeof response === 'object' && (response as any).id !== undefined) {
      // Alternative format where id is used instead of id_employee
      console.log('🔥 Using alternative response format with id');
      mappedEmployee = {
        id: (response as any).id,
        name: (response as any).name || body.name,
        imageBytes: (response as any).imageBytes || body.imageBytes || ''
      };
      console.log('🔥 Mapped employee (alternative):', mappedEmployee);
    } else {
      // Fallback: create a temporary employee (this happens when API returns empty response or just success)
      console.log('🔥 Using fallback response format - POST typically returns created object');
      // For POST, we should try to get all employees to find the newly created one
      // or return with a temporary ID
      mappedEmployee = {
        id: Date.now(), // temporary ID until we refresh the list
        name: body.name,
        imageBytes: body.imageBytes || ''
      };
      console.log('🔥 Mapped employee (fallback):', mappedEmployee);
    }

    return mappedEmployee;
  } catch (error: any) {
    console.error('Error creating employee:', error);
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data
    });
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create employee',
    });
  }
});
