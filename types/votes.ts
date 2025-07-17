export interface Vote {
  id?: number
  id_user: number
  id_nominess: number
  date: string
  created_at?: string
  updated_at?: string
}

export interface CreateVoteRequest {
  id_user: number
  id_nominess: number
  date: string
}

export interface VoteResponse {
  id_vote?: number
  id_user: number
  id_nominess: number
  date: string
  created_at?: string
  updated_at?: string
}

export interface VoteStats {
  totalVotes: number
  nominees: {
    id: number
    name: string
    votes: number
  }[]
}

export interface UserVoteStatus {
  hasVoted: boolean
  vote?: Vote
}

export interface UserVoteHistory {
  id_user_vote: number
  id_user: number
  id_nominess: number
  date: string
}

// Helper function to map API response to internal type
export const mapApiResponseToVote = (apiResponse: any): Vote => {
  return {
    id: apiResponse.id_vote,
    id_user: apiResponse.id_user,
    id_nominess: apiResponse.id_nominess,
    date: apiResponse.date,
    created_at: apiResponse.created_at,
    updated_at: apiResponse.updated_at
  };
};

// Helper function to map array of API responses
export const mapApiResponseArrayToVotes = (apiResponses: any[]): Vote[] => {
  return apiResponses.map(mapApiResponseToVote);
};