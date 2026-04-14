import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.discordId = token.discordId;
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.discordId = profile?.id;
      }
      return token;
    },
  },
});
