import type { Nominee, NomineesResponse } from '~/types/nominees'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.apiBaseUrl
  const query = getQuery(event)
  const { startDate, endDate, idEmployee } = query

  // Get the token from the request headers
  const authHeader = getHeader(event, 'authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required',
    });
  }

  // Validate query parameters
  if (startDate && !isValidDate(startDate as string)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid startDate format. Expected ISO date string.'
    })
  }

  if (endDate && !isValidDate(endDate as string)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid endDate format. Expected ISO date string.'
    })
  }

  if (idEmployee && isNaN(Number(idEmployee))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid idEmployee. Expected integer.'
    })
  }

  try {
    // Build query parameters for the external API
    const queryParams = new URLSearchParams()
    
    if (startDate) {
      queryParams.append('startDate', startDate as string)
    }
    
    if (endDate) {
      queryParams.append('endDate', endDate as string)
    }
    
    if (idEmployee) {
      queryParams.append('idEmployee', idEmployee as string)
    }

    const queryString = queryParams.toString()
    const url = queryString ? `${apiBaseUrl}/Nominees?${queryString}` : `${apiBaseUrl}/Nominees`

    const response = await $fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    // Return the response in the expected format
    return {
      success: true,
      data: response || [],
      total: Array.isArray(response) ? response.length : 0,
      filters: {
        startDate: startDate || null,
        endDate: endDate || null,
        idEmployee: idEmployee ? Number(idEmployee) : null
      }
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch nominees'
    })
  }
})

// Helper function to parse cookies
function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  if (cookieString) {
    cookieString.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=')
      if (name && value) {
        cookies[name] = decodeURIComponent(value)
      }
    })
  }
  return cookies
}

// Helper function to validate date format
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}