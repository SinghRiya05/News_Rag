const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiService = {
  // Chat APIs
  async sendMessage(sessionId: string, message: string) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message })
    });
    return response.json();
  },

  async getSessions() {
    const response = await fetch(`${API_BASE_URL}/chat/sessions`);
    return response.json();
  },

  async getSessionMessages(sessionId: string) {
    const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`);
    return response.json();
  },

  // Analysis APIs
  async analyzeResponse(originalResponse: string, currentMessage: string, messages: any[]) {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalResponse, currentMessage, messages })
    });
    return response.json();
  }
};
