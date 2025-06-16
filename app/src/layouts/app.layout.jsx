import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/header'

const AppLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container px-4 py-8">
                <Outlet />
            </main>
            {/* <footer className="mt-6 mb-2 py-2 bg-indigo-700 text-white text-center text-sm flex flex-col items-center">
                <p>© {new Date().getFullYear()} Trimrr. All rights reserved.</p>
                <p>Made with <span role="img" aria-label="love">❤️</span> in Mansa, Punjab, India.</p>
            </footer> */}
        </div>
    )
}

export default AppLayout
