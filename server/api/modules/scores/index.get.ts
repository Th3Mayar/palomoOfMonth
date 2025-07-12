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

    const config = useRuntimeConfig();
    const apiBaseUrl = config.apiBaseUrl;

    // GET all scores
    const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }

    try {
      const response = await $fetch(`${apiBaseUrl}/Score`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response;
    } catch (error: any) {
      console.error('Error fetching scores:', error);
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || 'Failed to fetch scores'
      });
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    });
  }
});
