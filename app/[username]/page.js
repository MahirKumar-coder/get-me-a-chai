import PaymentPage from '@/components/PaymentPage';
import { notFound } from "next/navigation";
import connectDB from '@/db/connectDb';
import User from '@/models/User';

// ✅ FIX 1: Destructure 'username' directly from params
const Username = async ({ params: { username } }) => {
  
    await connectDB();

    // ✅ FIX 2: Decode the username to handle spaces (%20) and other special characters
    const decodedUsername = decodeURIComponent(username);
    
    
    
    let u = await User.findOne({ username: decodedUsername });

    
    
    if (!u) {
        return notFound();
    }
  
    return (
        <>
            <PaymentPage username={decodedUsername} />
        </>
    );
}

export default Username;

export async function generateMetadata({ params }) {
    return {
        title: `Support ${params.username} - Get Me A Chai`,
    }
}