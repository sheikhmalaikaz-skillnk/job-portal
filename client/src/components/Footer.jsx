import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <footer className='border-t border-gray-200 bg-white'>
            <div className='container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-5 py-6'>
                <img width={140} src={assets.skillink} alt="SkillLink" />
                <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>
                    Copyright @SheikhMalaika.dev | All rights reserved
                </p>
                <div className='flex gap-4'>
                    <a href="#"><img width={40} src={assets.facebook_icon} alt="Facebook" /></a>
                    <a href="#"><img width={40} src={assets.instagram_icon} alt="Instagram" /></a>
                    <a href="#"><img width={40} src={assets.twitter_icon} alt="Twitter" /></a>
                </div>
            </div>
        </footer>
    )
}

export default Footer