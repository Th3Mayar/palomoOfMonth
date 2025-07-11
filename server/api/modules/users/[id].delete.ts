export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  const userId = getRouterParam(event, 'id');

  console.log('🔥 DELETE /users/[id] - User ID:', userId);

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

  try {
    console.log('🔥 Deleting user with ID:', userId);

    const response = await $fetch(`${apiBaseUrl}/Users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('🔥 DELETE Response:', response);

    return { success: true, message: 'User deleted successfully' };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to delete user',
    });
  }
});
