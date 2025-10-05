"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { fetchuser, updateProfile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify'

const Dashboard = () => {
  const { data: session, status } = useSession()             // ← use `status`, not `update`
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


  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else {
      // 1. Prefill from session
      setForm(current => ({
        ...current,
        name: session.user.name || "",
        email: session.user.email || "",
        username: session.user.name || ""
      }));
      // 2. Then fetch and merge any saved fields
      loadProfile();
    }
  }, [session, status, router]);



  const getData = async () => {
    if (!session?.user?.name) return                         // guard session.user
    const u = await fetchuser(session.user.name)
    setForm(u || {})
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const loadProfile = async () => {
    if (!session?.user?.email) return; // email use karo, name nahi
   
    const dbUser = await fetchuser(session.user.email); // email pass karo
   
    if (dbUser) {
      setForm((f) => ({ ...f, ...dbUser }));
    }
  };



  // in Dashboard.js (client)
  // Dashboard.js handleSubmit
  const handleSubmit = async (e) => {
    toast('Profile Updated', {
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
  };





  // Show loading state
  if (status === "loading") {
    return <div className="text-center py-10">Loading...</div>
  }

  // If not signed in, router.push already ran
  if (!session) {
    return null
  }

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
        transition={Bounce}
      />
      <div className='container mx-auto py-5 px-6'>
        <h1 className='text-center my-5 text-3xl font-bold'>
          Welcome, {session.user.name}
        </h1>
        <form onSubmit={handleSubmit} className='max-w-2xl mx-auto'>
          {/* Name */}
          <div className='my-2'>
            <label htmlFor="name" className='block mb-2 text-sm font-medium '>
              Name
            </label>
            <input
              id='name'
              name='name'
              type='text'
              value={form.name || ""}
              onChange={handleChange}
              className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
          </div>
          {/* Repeat for other fields... */}
          {/* Email */}
          <div className='my-2'>
            <label htmlFor="email" className='block mb-2 text-sm font-medium '>
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              value={form.email || ""}
              onChange={handleChange}
              className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
          </div>
          {/* Username */}
          <div className='my-2'>
            <label htmlFor="username" className='block mb-2 text-sm font-medium '>
              Username
            </label>
            <input
              id='username'
              name='username'
              type='text'
              value={form.username || ""}
              onChange={handleChange}
              className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
          </div>
          {/* Profile Picture */}
          <div className='my-2'>
            <label htmlFor="profilepic" className='block mb-2 text-sm font-medium '>
              Profile Picture
            </label>
            <input
              id='profilepic'
              name='profilepic'
              type='text'
              value={form.profilepic || ""}
              onChange={handleChange}
              className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
          </div>
          {/* Cover Picture */}
          <div className='my-2'>
            <label htmlFor="coverpic" className='block mb-2 text-sm font-medium '>
              Cover Picture
            </label>
            <input
              id='coverpic'
              name='coverpic'
              type='text'
              value={form.coverpic || ""}
              onChange={handleChange}
              className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
          </div>
          {/* Razorpay Id */}
          <div className='my-2'>
            <label htmlFor="razorpayid" className='block mb-2 text-sm font-medium '>
              Razorpay Id
            </label>
            <input
              id='razorpayid'
              name='razorpayid'
              type='text'
              value={form.razorpayid || ""}
              onChange={handleChange}
              className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
          </div>
          {/* Razorpay Secret */}
          <div className='my-2'>
            <label htmlFor="razorpaysecret" className='block mb-2 text-sm font-medium '>
              Razorpay Secret
            </label>
            <input
              id='razorpaysecret'
              name='razorpaysecret'
              type='text'
              value={form.razorpaysecret || ""}
              onChange={handleChange}
              className='block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
          </div>
          {/* Save Button */}
          <div className='my-6'>
            <button
              type='submit'
              className='w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Dashboard
