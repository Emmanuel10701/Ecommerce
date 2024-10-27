import NextAuth, { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from 'bcrypt';
import prisma from '../../../../libs/prismadb'; // Adjust path to your Prisma client

// Extend NextAuth types to include the role and accessToken
declare module 'next-auth' {
  interface User {
    role?: string | null; // Extend User type
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null; // Include role in session
    };
    accessToken?: string; // Include access token in session
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string | null; // Role included in JWT
    accessToken?: string; // Access token included in JWT
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('No user found or incorrect password');
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!isPasswordValid) {
          throw new Error('Incorrect password');
        }

        return user; // Returning the user if valid
      },
    }),
  ],
  secret: process.env.JWT_SECRET!,
  session: {
    strategy: "jwt", // Using JWT-based sessions
    maxAge: 60 * 60,  // Session expires in 1 hour
  },
  callbacks: {
    // JWT callback for token persistence
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }

      if (user) {
        token.role = user.role; // Assign role to JWT token
      }

      return token;
    },

    // Session callback to add accessToken and role to session
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Add access token to session
      session.user.role = token.role; // Pass the role from JWT to session
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl; // Redirect to base URL or specified URL
    },
  },
  pages: {
    signIn: '/login', // Customize the sign-in page path
    error: '/auth/error', // Error page
  },
  debug: process.env.NODE_ENV === "development",
};

// Exporting the handler for API routes
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
