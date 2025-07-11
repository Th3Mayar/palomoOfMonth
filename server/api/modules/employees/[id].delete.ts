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
    console.log('Deleting employee with ID:', id);

    const response = await $fetch(`${apiBaseUrl}/Employees/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Delete response:', response);

    // DELETE typically returns empty response or success message
    return { success: true, message: 'Employee deleted successfully' };
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data
    });
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to delete employee',
    });
  }
});
