"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDB from "@/db/connectDb"
import User from "@/models/User"

export const initiate = async (amount, to_username, paymentform) => {
    
    try {
        
        await connectDB();
        

        

        const decoded_username = decodeURIComponent(to_username);

        // This search will ignore case (e.g., 'Mahir Kumar' will match 'mahir kumar')
        let user = await User.findOne({
            username: new RegExp(`^${decoded_username}$`, 'i')
        }).lean();

        // 👇 Add this check!
        if (!user) {
            throw new Error(`User with username '${decoded_username}' not found.`);
        }

        // The rest of the code will only run if a user was found
        const secret = user.razorpaysecret;

        var instance = new Razorpay({
            key_id: user.razorpayid,
            key_secret: secret
        });

        let options = {
            amount: Number.parseInt(amount) * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                to_user: to_username,
                from_name: paymentform.name,
                message: paymentform.message
            }
        };

        

        let orderResponse = await instance.orders.create(options);
       

        // Save payment record
        await Payment.create({
            oid: orderResponse.id,
            amount: amount,
            to_user: to_username,
            name: paymentform.name,
            message: paymentform.message
        });

        return orderResponse;
    } catch (error) {
        console.error('=== INITIATE FUNCTION ERROR ===', error);
        throw error;
    }
}

// useractions.js
export const fetchuser = async (username) => {
    await connectDB();

    // Decode karein aur case-insensitive search use karein
    const decoded_username = decodeURIComponent(username);
    const user = await User.findOne({
        username: new RegExp(`^${decoded_username}$`, 'i')
    }).lean();

    return user;
};

export const fetchpayments = async (username) => {
    await connectDB();
    // Yahan bhi .lean() method ka use karein
    const payments = await Payment.find({ to_user: username, done: true }).sort({ amount: -1 }).limit(10).lean();

    // 'payments' ab plain objects ka array hai
    return payments;
};


// app/actions/useractions.js (server)
// app/actions/useractions.js
export const updateProfile = async (data, email) => {
    await connectDB();
    let ndata = Object.fromEntries(data);

    if(oldusername !== ndata.username) {
        let u = await User.findOne({ username: ndata.username })
        if(u) {
            return { error: "Username already taken" }
        }
        await User.updateOne({email: ndata.email}, ndata)

        await Payment.updateMany({to_user: oldusername}, {to_user: ndata.username})
    }
    else(
        await User.updateOne({email: ndata.email}, ndata)
    )
};
