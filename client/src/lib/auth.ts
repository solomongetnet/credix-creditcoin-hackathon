import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "@/server/config/prisma";
import { nanoid } from "nanoid";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
      disableIpTracking: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  // session: {
  //   storeSessionInDatabase: true,
  //   cookieCache: {
  //     enabled: false,
  //   },
  //   preserveSessionInDatabase: true,
  // },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes, or whatever
    },
  },
  // plug
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!(user as any).username && user.name) {
            const baseName = user.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/[^a-z0-9]/g, "");

            const username = `${baseName}_${nanoid(6)}`; // e.g. solomon_8j3k

            return {
              data: {
                username,
              },
            };
          }

          return;
        },
        after: async (user) => {},
      },
    },
    session: {
      create: {
        after: async ({ userId, ipAddress }) => {},
      },
    },
  },
  plugins: [
    nextCookies(),
    customSession(async ({ user, session }) => {
      const userDoc = await prisma.user.findFirst({
        where: { id: user.id },
      });

      return {
        user: {
          ...user,
          role: userDoc?.role,
          username: userDoc?.username,
        },
        session,
      };
    }),
  ],
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        unique: true,
        input: false,
      },
    },
  },
  secret: "jdksjkf390fdsiofjkdfskcmsdnfm",
});
