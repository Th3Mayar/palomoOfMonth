export default defineEventHandler(async (event) => {
  try {
    // Set CORS headers
    setHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });

    // Handle preflight requests
    if (getMethod(event) === 'OPTIONS') {
      return '';
    }

    const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }

    const id = getRouterParam(event, 'id');
    
    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid score ID'
      });
    }

    const config = useRuntimeConfig();
    const apiBaseUrl = config.apiBaseUrl;

    try {
      const score = await $fetch(`${apiBaseUrl}/Score/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return score;
    } catch (error: any) {
      console.error('Error fetching score:', error);
      if (error.statusCode === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Score not found'
        });
      }
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || 'Failed to fetch score'
      });
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    });
  }
});
