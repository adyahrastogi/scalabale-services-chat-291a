import type { ChatService } from '@/types';
import type {
  Conversation,
  CreateConversationRequest,
  UpdateConversationRequest,
  Message,
  SendMessageRequest,
  ExpertProfile,
  ExpertQueue,
  ExpertAssignment,
  UpdateExpertProfileRequest,
} from '@/types';
import TokenManager from '@/services/TokenManager';

interface ApiChatServiceConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

/**
 * API implementation of ChatService for production use
 * Uses fetch for HTTP requests
 */
export class ApiChatService implements ChatService {
  private baseUrl: string;
  private tokenManager: TokenManager;

  constructor(config: ApiChatServiceConfig) {
    this.baseUrl = config.baseUrl;
    this.tokenManager = TokenManager.getInstance();
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // TODO: Implement the makeRequest helper method
    // This should:
    // 1. Construct the full URL using this.baseUrl and endpoint
    const fullUrl = `${this.baseUrl}${endpoint}`;
    // 2. Get the token using this.tokenManager.getToken()
    const token = this.tokenManager.getToken();
    // 3. Set up default headers including 'Content-Type': 'application/json'
    const headers = new Headers(options.headers ?? {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    // 4. Add Authorization header with Bearer token if token exists
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    // 5. Make the fetch request with the provided options
    // 6. Handle non-ok responses by throwing an error with status and message
    // 7. Return the parsed JSON response
    try {
      const response = await fetch(fullUrl, { ...options, headers, credentials: 'include', });
      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(errorText || 'Request failed');
        (error as any).status = response.status;
        throw error;
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`Request to ${endpoint} failed:`, error);
      throw error;
    }

  }

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    // TODO: Implement getConversations method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = `/conversations`;
    // 2. Return the array of conversations
    return this.makeRequest<Conversation[]>(endpoint, { method: 'GET' });
    //
    // See API_SPECIFICATION.md for endpoint details
  }

  async getConversation(_id: string): Promise<Conversation> {
    // TODO: Implement getConversation method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = `/conversations/${_id}`;
    // 2. Return the conversation object
    return this.makeRequest<Conversation>(endpoint, { method: 'GET' });
    //
    // See API_SPECIFICATION.md for endpoint details

  }

  async createConversation(
    request: CreateConversationRequest
  ): Promise<Conversation> {
    // TODO: Implement createConversation method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = `/conversations`;

    // 2. Return the created conversation object
    return this.makeRequest<Conversation>(endpoint, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    //
    // See API_SPECIFICATION.md for endpoint details

  }

  async updateConversation(
    id: string,
    request: UpdateConversationRequest
  ): Promise<Conversation> {
    // SKIP, not currently used by application

    throw new Error('updateConversation method not implemented');
  }

  async deleteConversation(id: string): Promise<void> {
    // SKIP, not currently used by application

    throw new Error('deleteConversation method not implemented');
  }

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    // TODO: Implement getMessages method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = `/conversations/${conversationId}/messages`;
    // 2. Return the array of messages
    return this.makeRequest<Message[]>(endpoint, { method: 'GET' });
    //
    // See API_SPECIFICATION.md for endpoint details

  }

  async sendMessage(request: SendMessageRequest): Promise<Message> {
    // TODO: Implement sendMessage method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = `/messages`;
    // 2. Return the created message object
    return this.makeRequest<Message>(endpoint, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    //
    // See API_SPECIFICATION.md for endpoint details
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    // SKIP, not currently used by application

    throw new Error('markMessageAsRead method not implemented');
  }

  // Expert-specific operations
  async getExpertQueue(): Promise<ExpertQueue> {
    // TODO: Implement getExpertQueue method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = `/expert/queue`;
    // 2. Return the expert queue object with waitingConversations and assignedConversations
    return this.makeRequest<ExpertQueue>(endpoint, { method: 'GET' });
    //
    // See API_SPECIFICATION.md for endpoint details

  }

  async claimConversation(conversationId: string): Promise<void> {
    // TODO: Implement claimConversation method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = `/expert/conversations/${conversationId}/claim`;
    // 2. Return void (no response body expected)
    return this.makeRequest<void>(endpoint, { method: 'POST' });
    //
    // See API_SPECIFICATION.md for endpoint details

  }

  async unclaimConversation(conversationId: string): Promise<void> {
    // TODO: Implement unclaimConversation method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = `/expert/conversations/${conversationId}/unclaim`;
    // 2. Return void (no response body expected)
    return this.makeRequest<void>(endpoint, { method: 'POST' });
    //
    // See API_SPECIFICATION.md for endpoint details
  }

  async getExpertProfile(): Promise<ExpertProfile> {
    // TODO: Implement getExpertProfile method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = `/expert/profile`;
    // 2. Return the expert profile object
    return this.makeRequest<ExpertProfile>(endpoint, { method: 'GET' });
    //
    // See API_SPECIFICATION.md for endpoint details
  }

  async updateExpertProfile(
    request: UpdateExpertProfileRequest
  ): Promise<ExpertProfile> {
    // TODO: Implement updateExpertProfile method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = `/expert/profile`;
    // 2. Return the updated expert profile object
    return this.makeRequest<ExpertProfile>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    //
    // See API_SPECIFICATION.md for endpoint details
  }

  async getExpertAssignmentHistory(): Promise<ExpertAssignment[]> {
    // TODO: Implement getExpertAssignmentHistory method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = `/expert/assignments/history`;
    // 2. Return the array of expert assignments
    return this.makeRequest<ExpertAssignment[]>(endpoint, { method: 'GET' });
    //
    // See API_SPECIFICATION.md for endpoint details

  }
}
