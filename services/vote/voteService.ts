import type { CreateVoteRequest, VoteResponse } from '~/types/votes'

export class VoteService {
  getUserVote(id: any, current: Date): any {
    throw new Error('Method not implemented.');
  }
  private static instance: VoteService;

  private constructor() { }

  public static getInstance(): VoteService {
    if (!VoteService.instance) {
      VoteService.instance = new VoteService();
    }
    return VoteService.instance;
  }

  async createVote(userData: CreateVoteRequest): Promise<VoteResponse> {
    try {
      const token = useCookie('auth-token').value

      return await $fetch<VoteResponse>('/api/modules/votes', {
        method: 'POST',
        body: userData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.statusMessage ||
        err?.message ||
        'Error saving your vote'

      throw new Error(msg)
    }
  }
}
