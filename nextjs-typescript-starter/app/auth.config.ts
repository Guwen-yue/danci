import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/me?login=1',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      let isLearningPath =
        nextUrl.pathname.startsWith('/learn') || nextUrl.pathname.startsWith('/word');

      if (isLearningPath) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login dialog
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
