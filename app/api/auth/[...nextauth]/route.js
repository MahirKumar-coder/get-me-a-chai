import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import User from '@/models/User'; // User model ko import karein
import connectDb from '@/db/connectDb'; // DB connection ko import karein

export const authOptions = {
    debug: true,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account.provider == 'github') {
                await connectDb()
                // Check if user already exists in the database
                const currentUser = await User.findOne({ email: email }).lean()
                if (!currentUser) {
                    // If not, create a new user
                    await User.create({
                        email: user.email,
                        username: user.email.split("@")[0]
                    })
                }
                return true
            }
        },

        async session({ session }) {
            // Database se user ka latest data fetch karein
            const dbUser = await User.findOne({ email: session.user.email }).lean();
            
            if (dbUser) { // Ensure user exists
                // ✅ THE FIX: Sirf zaroori aur plain data session mein add karein
                session.user.username = dbUser.username;
                session.user._id = dbUser._id.toString(); // _id ko string mein convert karein
                
                // Aap aur bhi cheezein add kar sakte hain:
                // session.user.razorpayid = dbUser.razorpayid;
            }
            
            return session; // Saaf kiya hua session return karein
        },
    },
    // adapter: MongoDBAdapter(clientPromise), // <-- Aapke paas aisi line kahin aur configure hogi
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };