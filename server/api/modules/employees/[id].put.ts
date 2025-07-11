import { mapApiResponseToEmployee, type EmployeeApiResponse, type Employee } from '~/types/employee';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  const id = getRouterParam(event, 'id');
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

    // Update the employee
    const updateResponse = await $fetch(`${apiBaseUrl}/Employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: employeeData,
    });

    try {
      const allEmployees = await $fetch(`${apiBaseUrl}/Employees`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }) as EmployeeApiResponse[];
      
      // Find the updated employee in the list
      const updatedEmployee = allEmployees.find((emp: EmployeeApiResponse) => 
        emp.id_employee == parseInt(id) || (emp as any).id == parseInt(id)
      );
      
      if (updatedEmployee) {
        // Return the actual updated data from the list
        const mappedEmployee: Employee = {
          id: updatedEmployee.id_employee || (updatedEmployee as any).id,
          name: updatedEmployee.name,
          imageBytes: updatedEmployee.imageBytes || '',
          image: ''
        };
        
        return mappedEmployee;
      }
    } catch (listError) {
      console.log('PUT - Failed to fetch employee list:', listError);
    }

    // Fallback: return the data we sent
    const mappedEmployee: Employee = {
      id: parseInt(id),
      name: body.name,
      imageBytes: body.imageBytes || '',
      image: ''
    };

    return mappedEmployee;
  } catch (error: any) {
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to update employee',
    });
  }
});
