import type { CreateVoteRequest } from '~/types/votes'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  
  const body = await readBody(event) as CreateVoteRequest
  
  // Validate required fields
  if (!body.id_user || !body.id_nominess || !body.date) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: id_user, id_nominess, date'
    })
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

  try {
    const response = await $fetch(`${apiBaseUrl}/UsersVotes/Vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body,
    });

    console.log('Vote response:', {
      response,
      body
    });

    return { success: true, message: 'Your vote has been successfully saved!!' };
  } catch (error: any) {
    // Extract specific error details
    const statusCode = error.statusCode || error.response?.status || 500;
    const message = error.data?.message || error.message || 'Internal Server Error';
    
    throw createError({
      statusCode,
      statusMessage: message
    })
  }
});
