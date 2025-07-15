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