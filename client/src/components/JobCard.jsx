import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const JobCard = ({ job }) => {

    const navigate = useNavigate()

    return (
        <div className='border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow bg-white group'>

            <div className='flex items-center justify-between mb-4'>

                <span className='text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full'>
                    {job.category}
                </span>

                <span className='text-xs text-gray-400'>
                    {new Date(job.date).toLocaleDateString()}
                </span>

            </div>

            <div className='flex items-center gap-3 mb-4'>
                <img
                    className='w-12 h-12'
                    src={job.companyId.image}
                    alt=""
                />

                <div>
                    <h3 className='text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors'>
                        {job.title}
                    </h3>

                    <p className='text-sm text-gray-500'>
                        {job.companyId.name}
                    </p>
                </div>
            </div>

            <div className='flex flex-wrap gap-3 mb-5'>

                <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                    <img className='w-4 h-4' src={assets.location_icon} alt="" />
                    {job.location}
                </div>

                <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                    <img className='w-4 h-4' src={assets.money_icon} alt="" />
                    ${job.salary}
                </div>

                <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                    <img className='w-4 h-4' src={assets.suitcase_icon} alt="" />
                    {job.level}
                </div>

            </div>

            <button
                onClick={() => navigate(`/job/${job._id}`)}
                className='block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors'
            >
                Apply Now
            </button>

        </div>
    )
}

export default JobCard