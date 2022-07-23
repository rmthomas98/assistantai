import NextAuth from "next-auth/next";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";
const nodemailer = require("nodemailer");

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => {
      session.id = user.id;
      return session;
    },
  },
  events: {
    signIn: async ({ profile, isNewUser }) => {
      if (isNewUser) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          secure: false,
          port: 587,
          auth: {
            user: "rmthomas1998@gmail.com",
            pass: process.env.GOOGLE_PASSWORD,
          },
        });

        const msg = {
          from: "rmthomas1998@gmail.com",
          to: "rmthomas1998@gmail.com",
          subject: "New User for AssistantAI",
          text: `New signup from @${profile.screen_name}`,
        };

        await transporter.sendMail(msg);
      }
    },
  },
});
