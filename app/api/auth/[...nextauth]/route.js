import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import User from '@/models/User';
import connectDb from '@/db/connectDb';

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        // ✅ STEP 1: SIGN IN - User create karne ke liye
        async signIn({ user, account, profile }) {
            if (account.provider === 'github') {
                await connectDb();
                // Check if user exists
                const currentUser = await User.findOne({ email: user.email });
                if (!currentUser) {
                    // Create a new user if they don't exist
                    const newUser = await User.create({
                        email: user.email,
                        username: user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, ''), // Make username URL-friendly
                        name: user.name,
                        profilepic: user.image,
                    });
                }
            }
            return true;
        },

        // ✅ STEP 2: JWT - Token mein extra data daalne ke liye
        async jwt({ token, user }) {
            // Login ke baad, user object milta hai
            if (user) {
                await connectDb();
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser) {
                    token.username = dbUser.username;
                }
            }
            return token;
        },
        
        // ✅ STEP 3: SESSION - Client ko token se data dene ke liye
        async session({ session, token }) {
            if (session.user) {
                // Token se username nikal kar session mein daalo
                session.user.username = token.username;
            }
            return session;
        },
    },
    // Aapne adapter comment kiya hua hai, isliye hum callbacks use kar rahe hain
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
