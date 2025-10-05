"use client"
import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { fetchuser, fetchpayments, initiate } from '@/actions/useractions'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const PaymentPage = ({ username }) => {
    const { data: session } = useSession()
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
    const [paymentform, setPaymentform] = useState({
        name: "",
        message: "",
        amount: "",
    });
    const searchParams = useSearchParams();
    const router = useRouter();


    // DIRECT HARDCODE - Test ke liye
    const [currentUser, setcurrentUser] = useState({
        coverpic: "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/452146dcfeb04f38853368f554aadde1/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/18.gif?token-hash=2vOo9TQgrnL3x9ZV6_eh3p9Ulm8lMQmfZonf9gApV5Q%3D&token-time=1759536000",
        profilepic: "https://cdn.mos.cms.futurecdn.net/yndpargBis8vKfRThU4erA.jpg",
        name: "Mahir Kumar"
    });

    const [payments, setPayments] = useState([]);


    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        if (searchParams.get("paymentdone") == "true") {
            toast('Thanks for your donation!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
        router.push(`/${username}`)
    }, [])

    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
    };

    // Yeh temporarily add karo
    const getData = async () => {
        try {
            const u = await fetchuser(username);
            if (u) {
                setcurrentUser(u);
            }

            const dbpayments = await fetchpayments(username);

            // Filter only successful payments
            const successfulPayments = dbpayments?.filter(payment => payment.done === true) || [];

            setPayments(successfulPayments);
        } catch (error) {
            console.error("Error:", error);
        }
    };



    // Image loading error handler
    const handleImageError = (e, type) => {
       
        e.target.style.display = 'none';
    };

    const pay = async (amount) => {
        if (!session || !session.user) {
            alert("User session not available. Please login.");
            return;
        }

        try {
            const orderResponse = await initiate(amount, username, paymentform);
           

            const options = {
                key: currentUser.razorpayid || process.env.NEXT_PUBLIC_KEY_ID,
                amount: orderResponse.amount,
                currency: "INR",
                name: "Get Me A Chai",
                description: "Test Transaction",
                order_id: orderResponse.id,
                callback_url: `${window.location.origin}/api/razorpay`,
                // redirect: true,
                prefill: {
                    name: paymentform.name || session?.user?.name || "Anonymous",
                    email: session?.user?.email || "test@example.com",
                    contact: "+919876543210"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert(`Payment failed: ${error.message}`);
        }
    };
   



    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"

            />
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setIsRazorpayLoaded(true)}
                onError={() => console.error("Failed to load Razorpay")}
            />

            {/* DEBUG INFO - Remove after fixing */}


            <div className='cover w-full relative'>
                {currentUser.coverpic ? (
                    <Image
                        className='object-cover w-full h-48 md:h-[500px]'
                        src={currentUser.coverpic}
                        alt="Cover"
                        onError={(e) => handleImageError(e, 'Cover')}
                        
                    />
                ) : (
                    <div className='w-full h-[500px] bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl'>
                        No Cover Image
                    </div>
                )}

                <div className='absolute -bottom-20 right-[38%] md:right-[46%] border-white border-2 rounded-full size-32'>
                    {currentUser.profilepic ? (
                        <Image
                            className='rounded-full object-cover size-32'
                            width={128}
                            height={128}
                            src={currentUser.profilepic}
                            alt="Profile"
                            onError={(e) => handleImageError(e, 'Profile')}
                            
                        />
                    ) : (
                        <div className='rounded-full w-[100px] h-[100px] bg-gray-400 flex items-center justify-center text-white font-bold text-xl'>
                            {username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    )}
                </div>
            </div>

            <div className="info flex justify-center items-center my-24 mb-32 flex-col gap-2 ">
                <div className='font-bold text-lg'>@{username}</div>
                <div className='text-slate-400'>
                    Lets help {username} get a chai!
                </div>
                <div className='text-slate-400'>
                    {payments.length} Payments . ₹{payments.reduce((total, p) => total + p.amount, 0)} raised
                </div>

                <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row justifty-center items-start md:items-stretch">
                    <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-10">
                        <h2 className='text-2xl font-bold my-5'>Top 10 Supporters</h2>
                        <ul className='mx-5 text-lg'>

                            {Array.isArray(payments) && payments.length > 0 ? (
                                payments.map((p, i) => (
                                    <li key={i} className='my-3 flex gap-2 items-center'>
                                        <Image src='users.gif' className='w-15' />
                                        {p.name} donated ₹{p.amount} with message {p.message}
                                    </li>
                                ))
                            ) : (
                                <p>Payments array is empty (length: {payments.length})</p>
                            )}

                        </ul>
                    </div>


                    <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-10">
                        <h2 className='text-2xl font-bold my-5'>Make a Payment</h2>
                        <div className='flex gap-2 flex-col'>
                            <input
                                onChange={handleChange}
                                value={paymentform.name}
                                name='name'
                                type="text"
                                className='w-full p-3 rounded-lg bg-slate-800'
                                placeholder='Enter Name'
                            />
                            <input
                                onChange={handleChange}
                                value={paymentform.message}
                                name='message'
                                type="text"
                                className='w-full p-3 rounded-lg bg-slate-800'
                                placeholder='Enter Message'
                            />
                            <input
                                onChange={handleChange}
                                value={paymentform.amount}
                                name='amount'
                                type="number"
                                className='w-full p-3 rounded-lg bg-slate-800'
                                placeholder='Enter Amount'
                            />

                            <button className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:from-slate-900'
                                disabled={!isRazorpayLoaded || !paymentform.amount || !session || paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount ?. length < 1}
                                onClick={() => pay(Number(paymentform.amount))}
                            >
                                {!isRazorpayLoaded ? 'Loading...' : 'Pay'}
                            </button>

                        </div>

                        <div className='flex flex-col md:flex-row gap-2 mt-5'>
                            <button
                                className='bg-slate-800 p-3 rounded-lg disabled:opacity-50'
                                onClick={() => pay(1000)}
                                // Ab yeh form par bhi dependent hai
                                disabled={!isRazorpayLoaded || paymentform.name?.length < 3 || paymentform.message?.length < 4}
                            >
                                Pay ₹1000
                            </button>
                            <button
                                className='bg-slate-800 p-3 rounded-lg disabled:opacity-50'
                                onClick={() => pay(2000)}
                                // Ab yeh form par bhi dependent hai
                                disabled={!isRazorpayLoaded || paymentform.name?.length < 3 || paymentform.message?.length < 4}
                            >
                                Pay ₹2000
                            </button>
                            <button
                                className='bg-slate-800 p-3 rounded-lg disabled:opacity-50'
                                onClick={() => pay(3000)}
                                // Ab yeh form par bhi dependent hai
                                disabled={!isRazorpayLoaded || paymentform.name?.length < 3 || paymentform.message?.length < 4}
                            >
                                Pay ₹3000
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentPage;
