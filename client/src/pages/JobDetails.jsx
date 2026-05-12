import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { jobsData, assets } from '../assets/assets'
import Navbar from '../components/Navbar'

const JobDetails = () => {

    const { id } = useParams()

    const job = jobsData.find(job => job._id === id)

    const [resume, setResume] = useState(null)

    if (!job) {
        return (
            <div className='text-center py-20 text-xl font-semibold'>
                Job Not Found
            </div>
        )
    }

    return (
        <>
            <Navbar />

            <div className='min-h-screen bg-gray-50 py-10 px-4'>
                <div className='max-w-6xl mx-auto grid lg:grid-cols-3 gap-8'>

                    {/* LEFT SIDE */}
                    <div className='lg:col-span-2 bg-white rounded-2xl shadow p-8'>

                        <div className='flex items-center gap-4 mb-6'>
                            <img
                                className='w-16 h-16'
                                src={job.companyId.image}
                                alt=""
                            />

                            <div>
                                <h1 className='text-3xl font-bold'>
                                    {job.title}
                                </h1>

                                <p className='text-gray-500 mt-1'>
                                    {job.companyId.name}
                                </p>
                            </div>
                        </div>

                        <div className='flex flex-wrap gap-4 mb-8'>

                            <div className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg'>
                                <img className='w-5' src={assets.location_icon} alt="" />
                                <span>{job.location}</span>
                            </div>

                            <div className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg'>
                                <img className='w-5' src={assets.money_icon} alt="" />
                                <span>${job.salary}</span>
                            </div>

                            <div className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg'>
                                <img className='w-5' src={assets.suitcase_icon} alt="" />
                                <span>{job.level}</span>
                            </div>

                        </div>

                        <div
                            className='prose max-w-none'
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />

                    </div>

                    {/* RIGHT SIDE */}
                    <div className='bg-white rounded-2xl shadow p-6 h-fit'>

                        <h2 className='text-2xl font-bold mb-6'>
                            Apply Now
                        </h2>

                        <div className='border-2 border-dashed rounded-xl p-6 text-center'>

                            <img
                                className='w-16 mx-auto mb-4'
                                src={
                                    resume
                                        ? assets.resume_selected
                                        : assets.resume_not_selected
                                }
                                alt=""
                            />

                            <input
                                type="file"
                                id="resumeUpload"
                                hidden
                                onChange={(e) => setResume(e.target.files[0])}
                            />

                            <label
                                htmlFor="resumeUpload"
                                className='cursor-pointer text-blue-600 font-medium'
                            >
                                {resume
                                    ? resume.name
                                    : 'Upload Resume'}
                            </label>

                        </div>

                        <button
                            className='w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold'
                        >
                            Submit Application
                        </button>

                    </div>

                </div>
            </div>
        </>
    )
}

export default JobDetails