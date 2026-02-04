import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * AI Chat state management
 * Handles AI assistant interactions and handovers
 */
export const useAIChatStore = create(
  persist(
    (set, get) => ({
      // Chat state
      isChatOpen: false,
      openChat: () => set({ isChatOpen: true }),
      closeChat: () => set({ isChatOpen: false }),
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      
      // Current session
      sessionId: null,
      setSessionId: (sessionId) => set({ sessionId }),
      
      // Messages
      messages: [],
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      clearMessages: () => set({ messages: [], sessionId: null }),
      
      // Typing indicator
      isTyping: false,
      setTyping: (isTyping) => set({ isTyping }),
      
      // Handover state
      handoverTriggered: false,
      setHandoverTriggered: (triggered) => set({ handoverTriggered: triggered }),
      
      // Context (for personalized responses)
      userContext: null,
      setUserContext: (context) => set({ userContext: context }),
      
      // Suggested questions
      suggestedQuestions: [
        "What are the membership tiers?",
        "How do I apply for membership?",
        "What are the membership fees?",
        "How can I post a listing?",
        "Talk to a human",
      ],
      setSuggestedQuestions: (questions) => set({ suggestedQuestions: questions }),
      
      // Chat history (for logged-in users)
      chatHistory: [],
      setChatHistory: (history) => set({ chatHistory: history }),
      addToChatHistory: (session) => set((state) => ({
        chatHistory: [session, ...state.chatHistory]
      })),
    }),
    {
      name: 'ovwtn-ai-chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        sessionId: state.sessionId,
        userContext: state.userContext,
      }),
    }
  )
);
