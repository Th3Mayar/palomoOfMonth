import type { GenerateNomineesRequest, GenerateNomineesResponse } from '~/types/nominees'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.apiBaseUrl

  // Get JWT from cookies using the correct cookie name
  const jwt = getCookie(event, 'auth-token')
  
  if (!jwt) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
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
        'Authorization': `Bearer ${jwt}`
      },
      body: {
        month,
        max_quantity
      }
    })
    
    return response

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to generate nominees'
    })
  }
})