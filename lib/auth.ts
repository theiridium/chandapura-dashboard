import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userAuthentication } from "./apiLibrary";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

const authOptions = {
    pages: {
        signIn: '/signin',
        error: '/unauthorized'
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email ID", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<any> {
                const user: User.Login = {
                    identifier: credentials?.email,
                    password: credentials?.password,
                };

                const res = await userAuthentication(user);
                if (!res.user) {
                    return null; // invalid credentials
                }

                // ❌ BLOCK LOGIN IF NOT BACKEND USER
                if (res.user.user_type !== "Backend User") {
                    throw new Error("unauthorized"); // This stops login immediately
                }
                // ✅ ALLOW LOGIN
                return {
                    firstname: res.user.firstname,
                    name: `${res.user.firstname} ${res.user.lastname}`,
                    email: res.user.email,
                    phone: res.user.phone,
                    user_type: res.user.user_type,
                    id: res.user.id.toString(),
                    strapiUserId: res.user.id.toString(),
                    blocked: res.user.blocked,
                    strapiToken: res.jwt,
                };
            },
        }),
    ],

    session: {
        maxAge: 15 * 24 * 60 * 60,
    },

    callbacks: {
        async jwt({ user, token, trigger, session }: any) {
            // On login
            if (user) {
                token.user = { ...user };
                token.firstname = user.firstname;
                token.phone = user.phone;
                token.user_type = user.user_type;
                token.strapiToken = user.strapiToken;
                token.strapiUserId = user.strapiUserId;
                token.provider = "credentials";
                token.blocked = user.blocked;
            }

            // Update username
            if (trigger === "update" && session?.username) {
                token.name = session.username;
            }

            // Change password update
            if (trigger === "update" && session?.strapiToken) {
                token.strapiToken = session.strapiToken;
            }

            return token;
        },

        async session({ session, token }: any) {
            if (token?.user) {
                session.user.firstname = token.firstname;
                session.user.phone = token.phone;
                session.user.user_type = token.user_type;
                session.strapiToken = token.strapiToken;
                session.provider = token.provider;
                session.user.strapiUserId = token.strapiUserId;
                session.user.blocked = token.blocked;
            }
            return session;
        },

        async signIn() {
            // With only credentials provider this always returns true
            return true;
        },
    },
};

function auth(
    ...args:
        | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions);
}

export { authOptions, auth };
