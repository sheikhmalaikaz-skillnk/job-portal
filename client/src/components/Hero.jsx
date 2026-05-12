import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {
    const { searchFilter, setSearchFilter, setIsSearched } = useContext(AppContext)

    const onSearchHandler = (e) => {
        e.preventDefault()
        setIsSearched(true)
    }

    return (
        <div className='container 2xl:px-20 mx-auto my-10'>
            <div className='bg-gradient-to-r from-green-600 to-green-700 rounded-2xl px-6 sm:px-14 py-16 text-white relative overflow-hidden'>
                <div className='absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2'></div>
                <div className='absolute left-0 bottom-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2'></div>

                <div className='relative z-10'>
                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-2xl'>
                        Find Your <span className='text-green-200'>Dream Job</span> Today
                    </h1>
                    <p className='mt-4 text-green-100 max-w-lg text-sm sm:text-base'>
                        Browse through thousands of job listings from top companies.
                    </p>

                    <form onSubmit={onSearchHandler} className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8 bg-white rounded-lg p-3 max-w-xl'>
                        <div className='flex items-center gap-2 flex-1 px-3'>
                            <img className='w-5 h-5' src={assets.search_icon} alt="Search" />
                            <input 
                                type="text" 
                                placeholder='Job title...' 
                                value={searchFilter.title} 
                                onChange={(e) => setSearchFilter(prev => ({ ...prev, title: e.target.value }))} 
                                className='outline-none text-gray-600 text-sm w-full' 
                            />
                        </div>
                        <div className='h-8 w-px bg-gray-300 hidden sm:block'></div>
                        <div className='flex items-center gap-2 flex-1 px-3'>
                            <img className='w-5 h-5' src={assets.location_icon} alt="Location" />
                            <input 
                                type="text" 
                                placeholder='Location...' 
                                value={searchFilter.location} 
                                onChange={(e) => setSearchFilter(prev => ({ ...prev, location: e.target.value }))} 
                                className='outline-none text-gray-600 text-sm w-full' 
                            />
                        </div>
                        <button 
                            type='submit' 
                            className='bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap'
                        >
                            Search
                        </button>
                    </form>

                    <div className='flex items-center gap-8 mt-10 text-green-100 text-sm'>
                        <div><p className='text-2xl font-bold text-white'>10K+</p><p>Active Jobs</p></div>
                        <div className='h-8 w-px bg-green-300'></div>
                        <div><p className='text-2xl font-bold text-white'>500+</p><p>Companies</p></div>
                        <div className='h-8 w-px bg-green-300'></div>
                        <div><p className='text-2xl font-bold text-white'>5K+</p><p>Job Seekers</p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero