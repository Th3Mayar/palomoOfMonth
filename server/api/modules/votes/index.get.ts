// server/api/modules/votes.ts
import { defineEventHandler, getHeader, createError, getQuery } from 'h3'
import { mapApiResponseArrayToVotes, type UserVoteHistory } from '~/types/votes'

export default defineEventHandler(async (event) => {
  const config     = useRuntimeConfig()
  const apiBaseUrl = config.apiBaseUrl

  // 1) Auth
  const authHeader = getHeader(event, 'authorization')
  const token      = authHeader?.replace('Bearer ', '')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Authorization token required' })
  }

  // 2) Params
  const { month, year } = getQuery(event)
  if (!month || !year) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query parameters "month" and "year" are required'
    })
  }

  try {
    // 3) Fetch externo con month & year
    const apiResponse = await $fetch<UserVoteHistory[]>(
      `${apiBaseUrl}/UsersVotes/VotesByMonth`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        query: { month, year }
      }
    )

    // 4) Mapea y retorna
    return mapApiResponseArrayToVotes(apiResponse)
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message     || 'Failed to fetch votes'
    })
  }
})