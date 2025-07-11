export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.name || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and password are required'
      })
    }

    // Make request to external API
    const response = await $fetch(`${config.apiBaseUrl}${config.authLoginEndpoint}`, {
      method: 'POST',
      body: {
        name: body.name,
        password: body.password
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Return consistent response format
    return {
      success: true,
      data: response
    }
  } catch (error: any) {
    
    // Handle fetch errors
    if (error.response) {
      throw createError({
        statusCode: error.response.status || 500,
        statusMessage: error.response._data?.message || 'Authentication failed'
      })
    }
    
    // Handle validation errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
