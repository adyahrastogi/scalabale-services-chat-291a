import type {
  AuthService,
  RegisterRequest,
  User,
  AuthServiceConfig,
} from '@/types';
import TokenManager from '@/services/TokenManager';

/**
 * API-based implementation of AuthService
 * Uses fetch for HTTP requests
 */
export class ApiAuthService implements AuthService {
  private baseUrl: string;
  private tokenManager: TokenManager;

  constructor(config: AuthServiceConfig) {
    this.baseUrl = config.baseUrl || 'http://localhost:3000';
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
    // 2. Set up default headers including 'Content-Type': 'application/json'
    const headers = new Headers(options.headers ?? {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    // 3. Use {credentials: 'include'} for session cookies

    // 4. Make the fetch request with the provided options
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      credentials: 'include',});
    // 5. Handle non-ok responses by throwing an error with status and message
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error with request: status ${response.status}, message: ${errorMessage}`);
    }
    // 6. Return the parsed JSON response
    return response.json();
  }

  async login(username: string, password: string): Promise<User> {
    // TODO: Implement login method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = 'auth/login';
    const response = await this.makeRequest<{user: User; token: string}>(endpoint, {
      method: 'POST',
      body: JSON.stringify({username, password}),
    });
    // 2. Store the token using this.tokenManager.setToken(response.token)
    this.tokenManager.setToken(response.token);
    // 3. Return the user object
    return response.user;
    //
    // See API_SPECIFICATION.md for endpoint details
  }

  async register(userData: RegisterRequest): Promise<User> {
    // TODO: Implement register method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = '/auth/register';
    // 2. Store the token using this.tokenManager.setToken(response.token)
    const response = await this.makeRequest<{ token: string; user: User }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.tokenManager.setToken(response.token);
    return response.user;
    // 3. Return the user object
    //
    // See API_SPECIFICATION.md for endpoint details
  }

  async logout(): Promise<void> {
    const endpoint = '/auth/logout';
  
    try {
      // 1. Make a POST request to the logout endpoint
      await this.makeRequest<void>(endpoint, {
        method: 'POST',
      });
    } catch (error: any) {
      // 2. Handle errors gracefully (e.g., network issues or 401)
      console.warn('Logout request failed:', error);
    } finally {
      // 3. Always clear the token, even if logout request fails
      this.tokenManager.clearToken();
    }
  }

  async refreshToken(): Promise<User> {
    // TODO: Implement refreshToken method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = '/auth/refresh';
    const response = await this.makeRequest<{user: User; token: string;}>(endpoint, {
      method: 'POST',
    });

    // 2. Update the stored token
    this.tokenManager.setToken(response.token);

    // 3. Return the user object
    return response.user;
    //
    // See API_SPECIFICATION.md for endpoint details

  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: Implement getCurrentUser method
    // This should:
    // 1. Make a request to the appropriate endpoint
    const endpoint = '/auth/me';
    // 2. Return the user object if successful
    try {
      const user = await this.makeRequest<User>(endpoint, {
        method: 'GET',
      });
        return user;
  
    } catch (error: any) {
    // 3. If the request fails (e.g., session invalid), clear the token and return null
      if (error.status === 401) {
        this.tokenManager.clearToken();
        return null;
      }
  
      console.error('Failed to fetch current user:', error);
      return null;
    }
    //
    // See API_SPECIFICATION.md for endpoint details

    throw new Error('getCurrentUser method not implemented');
  }
}
