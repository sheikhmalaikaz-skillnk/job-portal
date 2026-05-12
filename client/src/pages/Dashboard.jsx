import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Dashboard = () => {

    const navigate = useNavigate()

    // Sidebar Active Classes
    const sidebarClasses = ({ isActive }) =>
        `flex items-center gap-3 w-full px-4 sm:px-6 py-3 hover:bg-gray-100 transition-all
        ${isActive
            ? 'bg-blue-100 border-r-4 border-blue-500 text-blue-600'
            : 'text-gray-700'
        }`

    return (

        <div className='min-h-screen flex flex-col bg-gray-50'>

            {/* Navbar */}
            <div className='shadow-md bg-white z-50'>

                <div className='flex items-center justify-between px-4 sm:px-6 py-4'>

                    {/* Logo */}
                    <img
                        onClick={() => navigate('/')}
                        className='w-28 sm:w-32 cursor-pointer'
                        src={assets.skillink}
                        alt="logo"
                    />

                    {/* Right Side */}
                    <div className='flex items-center gap-3'>

                        {/* Welcome Text */}
                        <p className='hidden md:block text-gray-700 font-medium'>
                            Welcome, Recruiter
                        </p>

                        {/* Logout Button Hidden on Mobile */}
                        <button
                            onClick={() => navigate('/')}
                            className='hidden sm:block text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition'
                        >
                            Logout
                        </button>

                        {/* Company Image */}
                        <img
                            className='w-9 h-9 sm:w-10 sm:h-10 rounded-full border'
                            src={assets.company_icon}
                            alt=""
                        />

                    </div>

                </div>

            </div>

            {/* Sidebar + Main Content */}
            <div className='flex flex-1'>

                {/* Sidebar */}
                <div className='w-16 sm:w-64 bg-white border-r min-h-[calc(100vh-72px)]'>

                    <ul className='flex flex-col pt-5'>

                        {/* Add Job */}
                        <NavLink
                            to="/dashboard/add-job"
                            className={sidebarClasses}
                        >
                            <img
                                className='w-5 h-5 min-w-5'
                                src={assets.add_icon}
                                alt=""
                            />

                            <p className='hidden sm:block'>
                                Add Job
                            </p>
                        </NavLink>

                        {/* Manage Jobs */}
                        <NavLink
                            to="/dashboard/manage-jobs"
                            className={sidebarClasses}
                        >
                            <img
                                className='w-5 h-5 min-w-5'
                                src={assets.home_icon}
                                alt=""
                            />

                            <p className='hidden sm:block'>
                                Manage Jobs
                            </p>
                        </NavLink>

                        {/* View Applications */}
                        <NavLink
                            to="/dashboard/view-applications"
                            className={sidebarClasses}
                        >
                            <img
                                className='w-5 h-5 min-w-5'
                                src={assets.person_tick_icon}
                                alt=""
                            />

                            <p className='hidden sm:block'>
                                View Applications
                            </p>
                        </NavLink>

                    </ul>

                </div>

                {/* Main Content */}
                <div className='flex-1 p-4 sm:p-6 overflow-y-auto'>
                    <Outlet />
                </div>

            </div>

        </div>
    )
}

export default Dashboard