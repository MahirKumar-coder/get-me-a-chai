"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { fetchuser, updateProfile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify'

const Dashboard = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [form, setForm] = useState({
        name: "",
        email: "",
        username: "",
        profilepic: "",
        coverpic: "",
        razorpayid: "",
        razorpaysecret: ""
    });

    useEffect(() => {
        // Function to load user data
        const loadUserData = async () => {
            if (session?.user?.username) {
                // Fetch user data from the database using the username
                const dbUser = await fetchuser(session.user.username);
                // Merge database data with session data to create the final form state
                setForm(prevForm => ({
                    ...prevForm, // Keep any previous state (optional)
                    ...dbUser, // Overwrite with data from DB
                    name: dbUser?.name || session.user.name || "", // Fallbacks
                    email: session.user.email || "", // Email from session is reliable
                    username: dbUser?.username || session.user.username || ""
                }));
            }
        };

        if (status === "loading") return; // Wait until session is loaded

        if (!session) {
            router.push("/login"); // Redirect if not logged in
        } else {
            loadUserData(); // Load data if logged in
        }
    }, [session, status, router]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Create a FormData object from the form state
        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }

        // Call the server action to update the profile
        const result = await updateProfile(formData, session.user.username);

        if (result && result.error) {
            // Handle error (e.g., username taken)
            toast.error(result.error);
        } else {
            // Show success toast
            toast('Profile Updated Successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    if (status === "loading") {
        return <div className="text-center py-10">Loading your dashboard...</div>
    }

    if (!session) {
        return null; // Render nothing while redirecting
    }

    return (
        <>
            <ToastContainer />
            <div className='container mx-auto py-5 px-6'>
                <h1 className='text-center my-5 text-3xl font-bold'>
                    Welcome to your Dashboard, {form.name || session.user.name}
                </h1>
                <p className='text-center mb-8'>Edit your profile and payment details below.</p>
                <form onSubmit={handleSubmit} className='max-w-2xl mx-auto'>
                    {/* Name */}
                    <div className='my-2'>
                        <label htmlFor="name" className='block mb-2 text-sm font-medium '>Name</label>
                        <input id='name' name='name' type='text' value={form.name || ""} onChange={handleChange} className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                    </div>
                    {/* Email (Read-only recommended) */}
                    <div className='my-2'>
                        <label htmlFor="email" className='block mb-2 text-sm font-medium '>Email</label>
                        <input id='email' name='email' type='email' value={form.email || ""} readOnly className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-200 text-xs dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400' />
                    </div>
                    {/* Username */}
                    <div className='my-2'>
                        <label htmlFor="username" className='block mb-2 text-sm font-medium '>Username</label>
                        <input id='username' name='username' type='text' value={form.username || ""} onChange={handleChange} className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                    </div>
                    {/* Profile Picture */}
                    <div className='my-2'>
                        <label htmlFor="profilepic" className='block mb-2 text-sm font-medium '>Profile Picture URL</label>
                        <input id='profilepic' name='profilepic' type='text' value={form.profilepic || ""} onChange={handleChange} className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                    </div>
                    {/* Cover Picture */}
                    <div className='my-2'>
                        <label htmlFor="coverpic" className='block mb-2 text-sm font-medium '>Cover Picture URL</label>
                        <input id='coverpic' name='coverpic' type='text' value={form.coverpic || ""} onChange={handleChange} className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                    </div>
                    {/* Razorpay Id */}
                    <div className='my-2'>
                        <label htmlFor="razorpayid" className='block mb-2 text-sm font-medium '>Razorpay Key ID</label>
                        <input id='razorpayid' name='razorpayid' type='text' value={form.razorpayid || ""} onChange={handleChange} className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                    </div>
                    {/* Razorpay Secret */}
                    <div className='my-2'>
                        <label htmlFor="razorpaysecret" className='block mb-2 text-sm font-medium '>Razorpay Key Secret</label>
                        <input id='razorpaysecret' name='razorpaysecret' type='text' value={form.razorpaysecret || ""} onChange={handleChange} className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                    </div>
                    {/* Save Button */}
                    <div className='my-6'>
                        <button type='submit' className='w-full p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold'>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Dashboard
