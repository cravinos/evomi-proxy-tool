import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/' },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // Store the actual Discord username (not display name)
        token.discordUsername = profile.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.discordUsername = token.discordUsername;
      return session;
    },
  },
};

export default NextAuth(authOptions);
