// app/api/razorpay/route.js

import { NextResponse } from 'next/server';
import Payment from '@/models/Payment';
import connectDB from '@/db/connectDb';
import User from '@/models/User';
import crypto from 'crypto'; // Security ke liye zaroori

export async function POST(request) {
    try {
        const formData = await request.formData();
        const razorpay_order_id = formData.get('razorpay_order_id');
        const razorpay_payment_id = formData.get('razorpay_payment_id');
        const razorpay_signature = formData.get('razorpay_signature');

        await connectDB();

        // Step 1: Payment document ko order_id se dhoondein
        const payment = await Payment.findOne({ oid: razorpay_order_id });
        if (!payment) {
            return NextResponse.json({ success: false, message: "Order ID not found" }, { status: 404 });
        }
        
        // Step 2: Payment document se 'to_user' ka username lein
        const to_username = payment.to_user;

        // Step 3: Uss username se user ko dhoondh kar secret key nikalein
        const user = await User.findOne({ username: to_username }).lean();
        const secret = user.razorpaysecret;

        // Step 4: 🚨 Security - Signature ko Verify Karein
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Agar signature match hota hai, tabhi payment ko update karein
            await Payment.findOneAndUpdate(
                { oid: razorpay_order_id },
                {
                    razorpay_payment_id: razorpay_payment_id,
                    razorpay_signature: razorpay_signature,
                    done: true
                }
            );

            // Redirect to success page with the username
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${to_username}?paymentdone=true`);
        } else {
            // Agar signature match nahi hota, toh fail karein
            console.error('Payment verification failed: Signature mismatch');
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/paymentfailed`);
        }

    } catch (error) {
        console.error('Payment callback error:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/paymentfailed`);
    }
}