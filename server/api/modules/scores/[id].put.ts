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

    const config = useRuntimeConfig();
    const apiBaseUrl = config.apiBaseUrl;

    try {
      const scoreData = {
        id_employee: body.id_employee,
        date: body.date,
        score: body.score,
        reason: body.reason,
      };

      try {
        await $fetch(`${apiBaseUrl}/Score/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: scoreData,
        });
      } catch (fetchError: any) {
        // If it's a 204 No Content, that's actually success
        if (fetchError.status === 204 || fetchError.statusCode === 204) {
          // 204 is success, continue
        } else {
          throw fetchError;
        }
      }

      // Return the updated score data in the expected API format
      return {
        id_score: Number(id),
        id_employee: body.id_employee,
        date: body.date,
        score: body.score,
        reason: body.reason,
      };
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || 'Failed to update score'
      });
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    });
  }
});
