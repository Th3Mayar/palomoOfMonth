export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  
  // Try multiple ways to get the user ID
  let userId = getRouterParam(event, 'id');
  
  // Alternative method using event.context.params
  if (!userId && event.context?.params?.id) {
    userId = event.context.params.id;
  }
  
  // If still no userId, try extracting from URL
  if (!userId) {
    const url = event.node?.req?.url || '';
    const match = url.match(/\/users\/([^\/\?]+)/);
    userId = match ? match[1] : undefined;
  }

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
    const response = await $fetch(`${apiBaseUrl}/Users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return { success: true, message: 'User deleted successfully' };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to delete user',
    });
  }
});
