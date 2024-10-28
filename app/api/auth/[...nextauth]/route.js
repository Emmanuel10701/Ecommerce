import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import prisma from '../../../../libs/prismadb'; // Adjust path to your Prisma client

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
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
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt", // Using JWT-based sessions
    maxAge: 60 * 60,  // Session expires in 1 hour
  },
  callbacks: {
    // JWT callback for token persistence
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Assign role to JWT token
      }
      return token;
    },

    // Session callback to add role to session
    async session({ session, token }) {
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
