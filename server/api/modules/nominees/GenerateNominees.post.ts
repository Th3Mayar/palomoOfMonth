import type { GenerateNomineesRequest, GenerateNomineesResponse } from '~/types/nominees'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.apiBaseUrl

  // Get the token from the request headers or cookies
  let token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  // If no header token, try to get from cookies
  if (!token) {
    const cookies = parseCookies(getHeader(event, 'cookie') || '')
    token = cookies.token
  }
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required'
    })
  }

  // Ensure this is a POST request
  assertMethod(event, 'POST')

  const body = await readBody(event)
  const { month, max_quantity } = body

  // Validate request body
  if (typeof month !== 'number' || month < 1 || month > 12) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid month. Expected number between 1 and 12.'
    })
  }

  if (typeof max_quantity !== 'number' || max_quantity < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid max_quantity. Expected positive number.'
    })
  }

  try {
    const response = await $fetch(`${apiBaseUrl}/Nominees/GenerateNominees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: {
        month,
        max_quantity
      }
    })

    return response

  } catch (error: any) {
    console.error('Error generating nominees:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to generate nominees'
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