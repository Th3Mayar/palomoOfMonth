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

    const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }

    const body = await readBody(event);
    
    // Validate required fields
    if (!body.id_employee || body.score === undefined || !body.date || !body.reason) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: id_employee, score, date, reason'
      });
    }

    // Validate score range
    if (body.score < 0 || body.score > 10) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Score must be between 0 and 10'
      });
    }

    // Validate reason length
    if (body.reason.length < 10 || body.reason.length > 500) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Reason must be between 10 and 500 characters'
      });
    }

    // Validate date format
    const dateObj = new Date(body.date);
    if (isNaN(dateObj.getTime())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid date format'
      });
    }

    try {
      const scoreData = {
        id_employee: body.id_employee,
        date: body.date,
        score: body.score,
        reason: body.reason,
      };

      const response = await $fetch(`${apiBaseUrl}/Score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: scoreData,
      });

      setResponseStatus(event, 201);
      return response;
    } catch (error: any) {
      console.error('Error creating score:', error);
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || 'Failed to create score'
      });
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    });
  }
});
