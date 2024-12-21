import axios from 'axios';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const response = await axios.post(
            'http://bff:3000/api/auth/login',
            credentials,
          );

          const user = response.data;
          console.log('Response from BFF:',user);
          if (user) {
            return user;
          } else {
            console.log('User not found');
            return null;
          }
        } catch (error: any) {
          if(error.response) {
            console.error('Error response', error.response.data);
          } else {
            console.error('Error message', error.message);
          }
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }: any) {
      session.user = token;
      return session;
    },
  },
});
