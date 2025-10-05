import React from 'react'

const About = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-8 md:px-4">
      <section className="max-w-xl w-full">
        <h1 className="text-3xl font-bold text-white mb-4 text-center drop-shadow">About Us</h1>
        <p className="text-white text-lg mb-6 text-center drop-shadow">
          Welcome to <span className="font-semibold text-yellow-300">Get Me A Chai</span>!<br />
          This application is designed to help you order your favorite chai quickly and easily.
        </p>
        <ul className="list-disc list-inside text-white mb-4 drop-shadow">
          <li>Fast and simple chai ordering</li>
          <li>Track your orders in real-time</li>
          <li>Discover new chai flavors</li>
        </ul>
        <p className="text-gray-200 text-sm text-center drop-shadow">
          Built with <span className="font-semibold">Next.js</span> and <span className="font-semibold">Tailwind CSS</span>.
        </p>
      </section>
    </main>
  )
}

export default About

export const metadata = {
  title: 'About - Get Me A Chai',
}