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
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // DELETE typically returns empty response or success message
    return { success: true, message: 'Employee deleted successfully' };
  } catch (error: any) {
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to delete employee',
    });
  }
});
