export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, email and password are required'
      })
    }

    // Here you would typically make a request to your external API
    // For now, we'll simulate a registration process
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate successful registration
    const response = {
      success: true,
      message: 'User registered successfully',
      user: {
        id: Date.now(),
        name: body.name,
        email: body.email
      }
    }

    return {
      success: true,
      data: response
    }
  } catch (error: any) {
    
    // Handle validation errors
    if (error.statusCode) {
      throw error
    }
    
    // Handle other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Registration failed'
    })
  }
})
