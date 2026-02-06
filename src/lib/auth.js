import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * NextAuth configuration with credentials provider
 * Connects to FastAPI backend for authentication
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Call backend login endpoint directly to avoid ES module issues in middleware
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
          const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || 'Invalid email or password');
          }

          const responseData = await response.json();

          // Backend should return user data and token
          // Handle different possible response formats
          const userData = responseData.user || responseData;
          const token = responseData.access_token || responseData.token || responseData.accessToken;

          if (userData && token) {
            return {
              id: userData.id?.toString() || userData.email,
              email: userData.email,
              name: userData.name || userData.full_name || userData.email,
              role: userData.role,
              organisation_id: userData.organisation_id || userData.organisationId,
              access_token: token,
            };
          }

          throw new Error("Invalid response from server");
        } catch (error) {
          console.error("Authentication error:", error);
          // Return null to show error, or throw to show error message
          if (error.message) {
            throw new Error(error.message);
          }
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.access_token;
        token.role = user.role;
        token.organisationId = user.organisation_id;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.organisation_id = token.organisationId;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "ovwtn-secret-key-change-in-production",
});
