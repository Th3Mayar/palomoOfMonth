
import { getCookie } from 'h3'
import { createError, defineEventHandler, useRuntimeConfig } from '#imports'

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

  // Get query params
  const query = getQuery(event)
  const idEmployee = query.idEmployee
  const month = Number(query.month)
  const year = Number(query.year)

  // Validate params
  if (!idEmployee || typeof idEmployee !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid idEmployee. Expected a string.'
    })
  }
  if (isNaN(month) || month < 1 || month > 12) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid month. Expected number between 1 and 12.'
    })
  }
  if (isNaN(year) || year < 2000 || year > new Date().getFullYear()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid year. Expected a valid year.'
    })
  }

  try {
    const response = await $fetch(`${apiBaseUrl}/Winners`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
      params: {
        idEmployee,
        month,
        year
      }
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch winner'
    })
  }
})