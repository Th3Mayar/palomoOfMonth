import { mapApiResponseArrayToUsers, type UserApiResponse } from '~/types/user';

export default defineEventHandler(async (event) => {
  console.log('🔥 API: Received request to /api/modules/users');
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;
  console.log('🌐 API: Base URL:', apiBaseUrl);
  
  // Get the token from the request headers
  const authHeader = getHeader(event, 'authorization');
  const token = authHeader?.replace('Bearer ', '');
  console.log('🔑 API: Token received:', token ? 'Yes' : 'No');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required',
    });
  }
  
  try {
    console.log('📡 API: Making request to external API...');
    const response = await $fetch(`${apiBaseUrl}/Users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }) as UserApiResponse[];

    console.log('✅ API: Response from external API:', response);
    console.log('📊 API: Response type:', typeof response, 'Is array:', Array.isArray(response));

    // Map the API response to our internal format
    const mappedUsers = mapApiResponseArrayToUsers(response);
    console.log('🔄 API: Mapped users:', mappedUsers);

    return mappedUsers;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch users',
    });
  }
});
