const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
  
    try {
      return await response.json();
    } catch (error) {
      console.log('Error parsing JSON response:', error);
      throw new Error('Failed to parse response as JSON');
    }
  }