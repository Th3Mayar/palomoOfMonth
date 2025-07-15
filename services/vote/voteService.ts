import type { CreateVoteRequest, VoteResponse } from '~/types/votes'

export class VoteService {
  getUserVote(id: any, current: Date): any {
    throw new Error('Method not implemented.');
  }
  private static instance: VoteService;

  private constructor() {}

  public static getInstance(): VoteService {
    if (!VoteService.instance) {
      VoteService.instance = new VoteService();
    }
    return VoteService.instance;
  }

  async createVote(userData: CreateVoteRequest): Promise<VoteResponse> {
      try {
        const token = useCookie('auth-token');

        const response = await $fetch<VoteResponse>('/api/modules/votes', {
          method: 'POST',
          body: userData,
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Vote created successfully:', response);
        
        return response;
      } catch (error) {
        throw new Error('Error saving your vote');
      }
    }
}
