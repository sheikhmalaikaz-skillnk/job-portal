import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import kConvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'

const ApplyJob = () => {

    const { id } = useParams()
    const { jobs = [], userData } = useContext(AppContext)

    const [jobData, setJobData] = useState(null)
    const [loading, setLoading] = useState(true)

    const [showModal, setShowModal] = useState(false)
    const [activeTab, setActiveTab] = useState('description')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
        resume: null,
    })
    const [fileName, setFileName] = useState('No file chosen')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const fileInputRef = useRef(null)

    useEffect(() => {
        if (userData && showModal) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || userData.name || '',
                email: prev.email || userData.email || '',
            }))
        }
    }, [userData, showModal])

    useEffect(() => {
        if (!jobs || jobs.length === 0) return
        const job = jobs.find(job => job._id === id)
        setJobData(job || null)
        setLoading(false)
    }, [id, jobs])

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeModal()
        }
        if (showModal) {
            document.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = 'auto'
        }
    }, [showModal])

    const moreJobs = jobs.filter(job =>
        job._id !== jobData?._id &&
        job.companyId?._id === jobData?.companyId?._id
    ).slice(0, 6)

    const openModal = () => {
        setShowModal(true)
        setActiveTab('description')
        setSubmitted(false)
        setError('')
    }

    const closeModal = () => {
        if (submitting) return
        setShowModal(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]
            if (!allowedTypes.includes(file.type)) {
                setError('Please upload PDF or DOC/DOCX file only')
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB')
                return
            }
            setFormData(prev => ({ ...prev, resume: file }))
            setFileName(file.name)
            setError('')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.name.trim()) { setError('Name is required'); return }
        if (!formData.email.trim()) { setError('Email is required'); return }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Please enter a valid email'); return }
        if (!formData.phone.trim()) { setError('Phone number is required'); return }
        if (!/^[0-9+\-\s()]{7,15}$/.test(formData.phone)) { setError('Please enter a valid phone number'); return }
        if (!formData.resume) { setError('Please upload your resume'); return }

        setSubmitting(true)

        try {
            const formPayload = new FormData()
            formPayload.append('name', formData.name)
            formPayload.append('email', formData.email)
            formPayload.append('phone', formData.phone)
            formPayload.append('coverLetter', formData.coverLetter)
            formPayload.append('resume', formData.resume)
            formPayload.append('jobId', jobData._id)
            formPayload.append('companyId', jobData.companyId?._id)

            console.log('Application Submitting...', {
                jobId: jobData._id,
                jobTitle: jobData.title,
                company: jobData.companyId?.name,
                applicant: formData.name,
                email: formData.email,
                phone: formData.phone,
                resumeName: formData.resume.name,
            })

            await new Promise(resolve => setTimeout(resolve, 2000))

            // Save to localStorage for Applications page
            const appData = {
                jobId: jobData._id,
                jobTitle: jobData.title,
                company: jobData.companyId?.name || 'Unknown',
                companyImage: jobData.companyId?.image || '',
                location: jobData.location,
                level: jobData.level,
                salary: jobData.salary,
                appliedDate: new Date().toISOString(),
                applicantName: formData.name,
                applicantEmail: formData.email,
                applicantPhone: formData.phone,
                resumeName: fileName,
                coverLetter: formData.coverLetter,
                status: 'Under Review',
            }

            const userId = userData?.id || userData?._id
            if (userId) {
                const key = `applications_${userId}`
                const existing = JSON.parse(localStorage.getItem(key) || '[]')
                if (!existing.find(a => a.jobId === jobData._id)) {
                    existing.unshift(appData)
                    localStorage.setItem(key, JSON.stringify(existing))
                }
            }

            setSubmitted(true)
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const resetAndClose = () => {
        setFormData({ name: '', email: '', phone: '', coverLetter: '', resume: null })
        setFileName('No file chosen')
        setSubmitted(false)
        setError('')
        setShowModal(false)
    }

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <Loading />
            </div>
        )
    }

    if (!jobData) {
        return (
            <div className='min-h-screen flex items-center justify-center text-gray-500'>
                Job not found
            </div>
        )
    }

    return (
        <>
            <Navbar />

            <div className='min-h-screen container mx-auto px-4 2xl:px-20 py-10'>

                <div className='bg-white rounded-lg shadow'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-8 px-8 py-8 bg-sky-50 border border-sky-300 rounded-xl'>
                        <div className='flex flex-col md:flex-row items-center'>
                            <img
                                className='h-20 bg-white rounded-lg p-3 mr-4 mb-4 md:mb-0 border'
                                src={jobData.companyId?.image || assets.company_icon}
                                alt="company"
                            />
                            <div className='text-center md:text-left'>
                                <h1 className='text-2xl sm:text-3xl font-semibold'>{jobData.title}</h1>
                                <p className='text-gray-500'>{jobData.companyId?.name}</p>
                            </div>
                        </div>
                        <div className='flex flex-wrap gap-4 text-sm text-gray-600 justify-center'>
                            <span className='flex items-center gap-2'>
                                <img src={assets.suitcase_icon} className='h-4' alt="" />
                                {jobData.category}
                            </span>
                            <span className='flex items-center gap-2'>
                                <img src={assets.location_icon} className='h-4' alt="" />
                                {jobData.location}
                            </span>
                            <span className='flex items-center gap-2'>
                                <img src={assets.person_icon} className='h-4' alt="" />
                                {jobData.level}
                            </span>
                            <span className='flex items-center gap-2'>
                                <img src={assets.money_icon} className='h-4' alt="" />
                                {kConvert.convertTo(jobData.salary)} PKR
                            </span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col items-end max-md:items-center mt-4 text-sm'>
                    <button
                        onClick={openModal}
                        className='bg-blue-600 px-8 py-2.5 text-white rounded hover:bg-blue-700 transition cursor-pointer'
                    >
                        Apply Now
                    </button>
                    <p className='mt-1 text-gray-600'>Posted {moment(jobData.date).fromNow()}</p>
                </div>

                <div className='flex flex-col lg:flex-row gap-10 mt-10'>
                    <div className='w-full lg:w-2/3'>
                        <h2 className='font-bold text-xl mb-4'>Job Description</h2>
                        <div className='rich-text' dangerouslySetInnerHTML={{ __html: jobData.description }} />
                        <div className='mt-8'>
                            <button
                                onClick={openModal}
                                className='bg-blue-600 px-8 py-3 text-white rounded hover:bg-blue-700 transition w-full sm:w-auto cursor-pointer'
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                    <div className='w-full lg:w-1/3'>
                        <h2 className='text-lg font-semibold mb-4'>More jobs from {jobData.companyId?.name}</h2>
                        <div className='flex flex-col gap-4'>
                            {moreJobs.map((job, index) => (
                                <JobCard key={job._id || index} job={job} />
                            ))}
                            {moreJobs.length === 0 && (
                                <p className='text-gray-400 text-sm'>No more jobs from this company</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== APPLY MODAL ========== */}
            {showModal && (
                <div
                    className='fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto'
                    onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
                >
                    <div className='bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-6'>

                        {/* Modal Header */}
                        <div className='sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-2xl'>
                            <div className='flex items-center justify-between px-6 py-4'>
                                <div className='flex items-center gap-3'>
                                    <img
                                        className='h-12 w-12 rounded-lg border p-1.5 object-contain'
                                        src={jobData.companyId?.image || assets.company_icon}
                                        alt=""
                                    />
                                    <div>
                                        <h2 className='text-lg font-semibold text-gray-900'>{jobData.title}</h2>
                                        <p className='text-sm text-gray-500'>{jobData.companyId?.name} - {jobData.location}</p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className='text-gray-400 hover:text-gray-700 transition cursor-pointer p-1'>
                                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                </button>
                            </div>

                            {!submitted && (
                                <div className='flex px-6 gap-1'>
                                    <button
                                        onClick={() => setActiveTab('description')}
                                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition cursor-pointer ${activeTab === 'description' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Job Details
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('form')}
                                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition cursor-pointer ${activeTab === 'form' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Apply Form
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('morejobs')}
                                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition cursor-pointer ${activeTab === 'morejobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        More Jobs ({moreJobs.length})
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Modal Body */}
                        <div className='px-6 py-6 max-h-[70vh] overflow-y-auto'>

                            {/* SUCCESS STATE */}
                            {submitted ? (
                                <div className='flex flex-col items-center justify-center py-12 text-center'>
                                    <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6'>
                                        <svg className='w-10 h-10 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                        </svg>
                                    </div>
                                    <h3 className='text-2xl font-bold text-gray-900 mb-2'>Application Submitted!</h3>
                                    <p className='text-gray-500 max-w-md mb-2'>
                                        Your application for <span className='font-semibold text-gray-700'>{jobData.title}</span> at{' '}
                                        <span className='font-semibold text-gray-700'>{jobData.companyId?.name}</span> has been submitted successfully.
                                    </p>
                                    <p className='text-sm text-gray-400 mb-8'>
                                        We will email you at <span className='text-gray-600'>{formData.email}</span> for updates.
                                    </p>
                                    <div className='bg-gray-50 rounded-xl p-5 w-full max-w-sm text-left text-sm space-y-2 mb-8'>
                                        <p><span className='text-gray-500'>Name:</span> <span className='font-medium'>{formData.name}</span></p>
                                        <p><span className='text-gray-500'>Email:</span> <span className='font-medium'>{formData.email}</span></p>
                                        <p><span className='text-gray-500'>Phone:</span> <span className='font-medium'>{formData.phone}</span></p>
                                        <p><span className='text-gray-500'>Resume:</span> <span className='font-medium'>{fileName}</span></p>
                                    </div>
                                    <div className='flex gap-3'>
                                        <button onClick={resetAndClose} className='px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer'>
                                            Close
                                        </button>
                                        {moreJobs.length > 0 && (
                                            <button
                                                onClick={() => { setSubmitted(false); setActiveTab('morejobs') }}
                                                className='px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer'
                                            >
                                                View More Jobs
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : activeTab === 'description' ? (
                                /* TAB: DESCRIPTION */
                                <div>
                                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6'>
                                        <div className='bg-gray-50 rounded-lg p-3 text-center'>
                                            <img src={assets.suitcase_icon} className='h-5 mx-auto mb-1 opacity-60' alt="" />
                                            <p className='text-xs text-gray-400'>Category</p>
                                            <p className='text-sm font-medium text-gray-800'>{jobData.category}</p>
                                        </div>
                                        <div className='bg-gray-50 rounded-lg p-3 text-center'>
                                            <img src={assets.location_icon} className='h-5 mx-auto mb-1 opacity-60' alt="" />
                                            <p className='text-xs text-gray-400'>Location</p>
                                            <p className='text-sm font-medium text-gray-800'>{jobData.location}</p>
                                        </div>
                                        <div className='bg-gray-50 rounded-lg p-3 text-center'>
                                            <img src={assets.person_icon} className='h-5 mx-auto mb-1 opacity-60' alt="" />
                                            <p className='text-xs text-gray-400'>Level</p>
                                            <p className='text-sm font-medium text-gray-800'>{jobData.level}</p>
                                        </div>
                                        <div className='bg-gray-50 rounded-lg p-3 text-center'>
                                            <img src={assets.money_icon} className='h-5 mx-auto mb-1 opacity-60' alt="" />
                                            <p className='text-xs text-gray-400'>Salary</p>
                                            <p className='text-sm font-medium text-gray-800'>{kConvert.convertTo(jobData.salary)} PKR</p>
                                        </div>
                                    </div>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-3'>Full Job Description</h3>
                                    <div className='rich-text text-gray-700 leading-relaxed' dangerouslySetInnerHTML={{ __html: jobData.description }} />
                                    <div className='mt-6 pt-4 border-t border-gray-100 flex items-center justify-between'>
                                        <p className='text-sm text-gray-400'>Posted {moment(jobData.date).fromNow()}</p>
                                        <button onClick={() => setActiveTab('form')} className='bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm cursor-pointer'>
                                            Proceed to Apply
                                        </button>
                                    </div>
                                </div>
                            ) : activeTab === 'form' ? (
                                /* TAB: APPLY FORM */
                                <form onSubmit={handleSubmit} className='max-w-2xl'>
                                    {error && (
                                        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 flex items-center gap-2 text-sm'>
                                            <svg className='w-5 h-5 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                            </svg>
                                            {error}
                                        </div>
                                    )}
                                    <div className='space-y-5'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1.5'>Full Name <span className='text-red-500'>*</span></label>
                                            <input type='text' name='name' value={formData.name} onChange={handleInputChange} placeholder='e.g. Muhammad Ali' className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 placeholder:text-gray-400' />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email Address <span className='text-red-500'>*</span></label>
                                            <input type='email' name='email' value={formData.email} onChange={handleInputChange} placeholder='e.g. ali@example.com' className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 placeholder:text-gray-400' />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1.5'>Phone Number <span className='text-red-500'>*</span></label>
                                            <input type='tel' name='phone' value={formData.phone} onChange={handleInputChange} placeholder='e.g. 0300-1234567' className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 placeholder:text-gray-400' />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1.5'>Resume / CV <span className='text-red-500'>*</span></label>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${formData.resume ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'}`}
                                            >
                                                <input ref={fileInputRef} type='file' accept='.pdf,.doc,.docx' onChange={handleFileChange} className='hidden' />
                                                {formData.resume ? (
                                                    <div className='flex items-center justify-center gap-3'>
                                                        <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                                        </svg>
                                                        <div className='text-left'>
                                                            <p className='text-sm font-medium text-green-700'>{fileName}</p>
                                                            <p className='text-xs text-green-500'>{(formData.resume.size / 1024).toFixed(1)} KB - Click to change</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <svg className='w-10 h-10 text-gray-400 mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                                                        </svg>
                                                        <p className='text-sm text-gray-600 font-medium'>Click to upload resume</p>
                                                        <p className='text-xs text-gray-400 mt-1'>PDF, DOC, DOCX (Max 5MB)</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1.5'>Cover Letter <span className='text-gray-400 font-normal'>(optional)</span></label>
                                            <textarea name='coverLetter' value={formData.coverLetter} onChange={handleInputChange} rows={5} placeholder='Tell the employer why you are a good fit for this role...' className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 placeholder:text-gray-400 resize-none' />
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3 mt-8 pt-5 border-t border-gray-100'>
                                        <button type='button' onClick={() => setActiveTab('description')} className='px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition text-sm cursor-pointer'>
                                            Back
                                        </button>
                                        <button
                                            type='submit'
                                            disabled={submitting}
                                            className={`flex-1 sm:flex-none px-8 py-3 rounded-lg text-white font-medium transition cursor-pointer ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                        >
                                            {submitting ? (
                                                <span className='flex items-center justify-center gap-2'>
                                                    <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                                                    </svg>
                                                    Submitting...
                                                </span>
                                            ) : 'Submit Application'}
                                        </button>
                                    </div>
                                </form>
                            ) : activeTab === 'morejobs' ? (
                                /* TAB: MORE JOBS */
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-1'>More Jobs from {jobData.companyId?.name}</h3>
                                    <p className='text-sm text-gray-500 mb-5'>Explore other opportunities at this company</p>
                                    {moreJobs.length > 0 ? (
                                        <div className='space-y-3'>
                                            {moreJobs.map((job, index) => (
                                                <div key={job._id || index} className='border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition'>
                                                    <div className='flex items-start gap-4'>
                                                        <img className='h-12 w-12 rounded-lg border p-1.5 object-contain' src={job.companyId?.image || assets.company_icon} alt="" />
                                                        <div className='flex-1 min-w-0'>
                                                            <h4 className='font-semibold text-gray-900 truncate'>{job.title}</h4>
                                                            <p className='text-sm text-gray-500'>{job.location} - {job.level} - {kConvert.convertTo(job.salary)} PKR</p>
                                                        </div>
                                                        <span className='text-xs text-gray-400 whitespace-nowrap'>{moment(job.date).fromNow()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='text-center py-12'>
                                            <svg className='w-16 h-16 text-gray-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                            </svg>
                                            <p className='text-gray-400'>No more jobs available from this company</p>
                                        </div>
                                    )}
                                    <div className='mt-6 pt-4 border-t border-gray-100'>
                                        <button onClick={() => setActiveTab('form')} className='bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm cursor-pointer'>
                                            Back to Apply Form
                                        </button>
                                    </div>
                                </div>
                            ) : null}

                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    )
}

export default ApplyJob