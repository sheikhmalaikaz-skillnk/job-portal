import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const { setShowRecruiterLogin, setCurrentPage } = useContext(AppContext)

  return (
    <div className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center py-4'>

        <img 
          className='h-10 cursor-pointer' 
          src={assets.skillink} 
          alt="SkillLink Logo" 
          onClick={() => setCurrentPage('home')} 
        />

        {user ? (
          <div className='flex items-center gap-4 text-sm font-medium'>
            <button 
              onClick={() => setCurrentPage('applications')} 
              className='hover:text-green-600 transition-colors'
            >
              Applied Jobs
            </button>
            <p className='text-gray-300'>|</p>
            <p>Hi, {user.firstName} {user.lastName}</p>
            <UserButton />
          </div>
        ) : (
          <div className='flex items-center gap-6 text-sm font-medium text-gray-700'>
            <button 
              onClick={() => setCurrentPage('home')} 
              className='hover:text-green-600 transition-colors'
            >
              Home
            </button>
            
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className='border border-green-600 text-green-600 px-5 py-2 rounded-full hover:bg-green-50 transition-colors'
            >
              Recruiter Login
            </button>

            <button
              onClick={() => openSignIn()}
              className='bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors'
            >
              Login
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Navbar