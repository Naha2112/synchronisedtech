import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      }
    }),
  ],
  session: { 
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  // Add error handling for JWT issues
  events: {
    async signOut(message) {
      console.log('User signed out:', message);
    },
    async session(message) {
      // Log session events for debugging
      console.log('Session event:', message.session?.user?.email);
    }
  },
  // Handle JWT errors gracefully
  logger: {
    error(code, metadata) {
      if (code === 'JWT_SESSION_ERROR') {
        console.log('JWT Session Error - clearing session:', metadata);
      }
    },
    warn(code) {
      console.log('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth Debug:', code, metadata);
      }
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 