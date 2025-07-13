import { mapApiResponseArrayToUsers, type UserApiResponse } from '~/types/user';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  
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
    const response = await $fetch(`${apiBaseUrl}/Users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }) as UserApiResponse[];

    // Map the API response to our internal format
    const mappedUsers = mapApiResponseArrayToUsers(response);

    return mappedUsers;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch users',
    });
  }
});
