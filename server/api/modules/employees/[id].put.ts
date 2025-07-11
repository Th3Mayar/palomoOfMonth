import { mapApiResponseToEmployee, type EmployeeApiResponse, type Employee } from '~/types/employee';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  console.log('PUT /employees/:id - Received body:', body);
  console.log('PUT /employees/:id - Employee ID:', id);

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

  // Validate required fields
  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required',
    });
  }

  try {
    const employeeData = {
      name: body.name,
      image: body.image || "",
      imageBytes: body.imageBytes || body.image || ""
    };

    console.log('PUT - Employee ID:', id);
    console.log('PUT - Received body:', body);
    console.log('PUT - Sending to external API:', employeeData);

    // Update the employee
    const updateResponse = await $fetch(`${apiBaseUrl}/Employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: employeeData,
    });

    console.log('PUT - External API Response:', updateResponse);

    // Let's test if the update actually worked by checking the GET list
    console.log('PUT - Fetching all employees to verify update...');
    
    try {
      const allEmployees = await $fetch(`${apiBaseUrl}/Employees`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }) as EmployeeApiResponse[];
      
      console.log('PUT - All employees after update:', allEmployees);
      
      // Find the updated employee in the list
      const updatedEmployee = allEmployees.find((emp: EmployeeApiResponse) => 
        emp.id_employee == parseInt(id) || (emp as any).id == parseInt(id)
      );
      
      console.log('PUT - Found updated employee:', updatedEmployee);
      
      if (updatedEmployee) {
        // Return the actual updated data from the list
        const mappedEmployee: Employee = {
          id: updatedEmployee.id_employee || (updatedEmployee as any).id,
          name: updatedEmployee.name,
          imageBytes: updatedEmployee.imageBytes || ''
        };
        
        console.log('PUT - Returning mapped employee:', mappedEmployee);
        return mappedEmployee;
      }
    } catch (listError) {
      console.log('PUT - Failed to fetch employee list:', listError);
    }

    // Fallback: return the data we sent
    const mappedEmployee: Employee = {
      id: parseInt(id),
      name: body.name,
      imageBytes: body.imageBytes || ''
    };

    console.log('PUT - Using fallback, returning:', mappedEmployee);
    return mappedEmployee;
  } catch (error: any) {
    console.error('Error updating employee:', error);
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data
    });
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to update employee',
    });
  }
});
