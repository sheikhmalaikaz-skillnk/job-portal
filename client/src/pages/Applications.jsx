import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useUser } from '@clerk/clerk-react'
import moment from 'moment'

const Applications = () => {

    const { jobs } = useContext(AppContext)
    const { user } = useUser()

    const [applications, setApplications] = useState([])
    const [filter, setFilter] = useState('all')

    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])

    // ================= LOAD APPLICATIONS =================
    useEffect(() => {

        if (!user) return

        const storedApplications =
            localStorage.getItem(`applications_${user.id}`)

        if (storedApplications) {
            setApplications(JSON.parse(storedApplications))
        } else {

            // Dummy data so page always shows something
            const demoApplications = [
                {
                    jobTitle: 'Frontend Developer',
                    company: 'Skillink',
                    appliedDate: new Date(),
                    status: 'Under Review',
                    applicantName: '',
                    applicantEmail: '',
                    applicantPhone: '',
                    coverLetter: '',
                    resumeName: '',
                    resumeFile: '',
                    voiceNote: ''
                }
            ]

            setApplications(demoApplications)

            localStorage.setItem(
                `applications_${user.id}`,
                JSON.stringify(demoApplications)
            )
        }

    }, [user])

    // ================= SAVE =================
    const saveApplications = (updatedApplications) => {

        setApplications(updatedApplications)

        localStorage.setItem(
            `applications_${user.id}`,
            JSON.stringify(updatedApplications)
        )
    }

    // ================= FILTER =================
    const filteredApplications =
        filter === 'all'
            ? applications
            : applications.filter(
                  app => app.status === filter
              )

    // ================= INPUT CHANGE =================
    const handleInputChange = (index, field, value) => {

        const updatedApplications = [...applications]

        updatedApplications[index][field] = value

        saveApplications(updatedApplications)
    }

    // ================= RESUME UPLOAD =================
    const handleResumeUpload = (index, file) => {

        if (!file) return

        const reader = new FileReader()

        reader.onload = () => {

            const updatedApplications = [...applications]

            updatedApplications[index].resumeFile = reader.result
            updatedApplications[index].resumeName = file.name

            saveApplications(updatedApplications)
        }

        reader.readAsDataURL(file)
    }

    // ================= START RECORDING =================
    const startRecording = async () => {

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                })

            const mediaRecorder = new MediaRecorder(stream)

            mediaRecorderRef.current = mediaRecorder

            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data)
            }

            mediaRecorder.start()

            alert('Recording Started')

        } catch (error) {

            alert('Microphone Permission Denied')
        }
    }

    // ================= STOP RECORDING =================
    const stopRecording = (index) => {

        const mediaRecorder = mediaRecorderRef.current

        if (!mediaRecorder) return

        mediaRecorder.stop()

        mediaRecorder.onstop = () => {

            const audioBlob = new Blob(
                audioChunksRef.current,
                { type: 'audio/mp3' }
            )

            const audioUrl =
                URL.createObjectURL(audioBlob)

            const updatedApplications = [...applications]

            updatedApplications[index].voiceNote = audioUrl

            saveApplications(updatedApplications)

            alert('Voice Note Saved')
        }
    }

    // ================= LOGIN CHECK =================
    if (!user) {

        return (
            <div className='p-10 text-center'>
                <h1 className='text-2xl font-bold mb-3'>
                    Please Login First
                </h1>

                <p className='text-gray-500'>
                    You need to login to view applications
                </p>
            </div>
        )
    }

    return (

        <div className='min-h-screen bg-gray-50 p-4 sm:p-6'>

            {/* HEADING */}
            <div className='mb-8'>

                <h1 className='text-3xl font-bold text-gray-800'>
                    My Applications
                </h1>

                <p className='text-gray-500 mt-1'>
                    Manage your resumes, profile and voice notes
                </p>

            </div>

            {/* FILTERS */}
            <div className='flex flex-wrap gap-3 mb-8'>

                {[
                    'all',
                    'Under Review',
                    'Shortlisted',
                    'Rejected'
                ].map((status) => (

                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg border transition ${
                            filter === status
                                ? 'bg-black text-white'
                                : 'bg-white hover:bg-gray-100'
                        }`}
                    >
                        {status}
                    </button>

                ))}

            </div>

            {/* APPLICATIONS */}
            <div className='space-y-6'>

                {filteredApplications.length === 0 && (

                    <div className='bg-white rounded-xl border p-10 text-center'>

                        <h2 className='text-xl font-semibold mb-2'>
                            No Applications Found
                        </h2>

                        <p className='text-gray-500'>
                            Apply for jobs to see them here
                        </p>

                    </div>
                )}

                {filteredApplications.map((app, index) => (

                    <div
                        key={index}
                        className='bg-white border rounded-2xl p-5 shadow-sm'
                    >

                        {/* TOP */}
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5'>

                            <div>

                                <h2 className='text-xl font-bold text-gray-800'>
                                    {app.jobTitle}
                                </h2>

                                <p className='text-gray-500'>
                                    {app.company}
                                </p>

                            </div>

                            <div className='text-sm text-gray-500'>

                                Applied{' '}
                                {moment(app.appliedDate).fromNow()}

                            </div>

                        </div>

                        {/* STATUS */}
                        <div className='mb-5'>

                            <span className='px-4 py-1.5 rounded-full text-sm bg-green-100 text-green-700'>
                                {app.status}
                            </span>

                        </div>

                        {/* FORM */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                            {/* NAME */}
                            <div>

                                <label className='block mb-1 text-sm font-medium'>
                                    Full Name
                                </label>

                                <input
                                    type='text'
                                    value={app.applicantName || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            'applicantName',
                                            e.target.value
                                        )
                                    }
                                    placeholder='Enter your name'
                                    className='w-full border rounded-lg px-4 py-2 outline-none focus:border-green-500'
                                />

                            </div>

                            {/* EMAIL */}
                            <div>

                                <label className='block mb-1 text-sm font-medium'>
                                    Email
                                </label>

                                <input
                                    type='email'
                                    value={app.applicantEmail || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            'applicantEmail',
                                            e.target.value
                                        )
                                    }
                                    placeholder='Enter your email'
                                    className='w-full border rounded-lg px-4 py-2 outline-none focus:border-green-500'
                                />

                            </div>

                            {/* PHONE */}
                            <div>

                                <label className='block mb-1 text-sm font-medium'>
                                    Phone
                                </label>

                                <input
                                    type='text'
                                    value={app.applicantPhone || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            'applicantPhone',
                                            e.target.value
                                        )
                                    }
                                    placeholder='Enter your phone number'
                                    className='w-full border rounded-lg px-4 py-2 outline-none focus:border-green-500'
                                />

                            </div>

                            {/* RESUME */}
                            <div>

                                <label className='block mb-1 text-sm font-medium'>
                                    Upload Resume
                                </label>

                                <input
                                    type='file'
                                    accept='.pdf,.doc,.docx'
                                    onChange={(e) =>
                                        handleResumeUpload(
                                            index,
                                            e.target.files[0]
                                        )
                                    }
                                    className='w-full border rounded-lg px-3 py-2'
                                />

                                {app.resumeName && (

                                    <div className='mt-2 flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2'>

                                        <p className='text-sm text-green-700 truncate'>
                                            {app.resumeName}
                                        </p>

                                        <a
                                            href={app.resumeFile}
                                            download={app.resumeName}
                                            className='text-blue-600 text-sm hover:underline'
                                        >
                                            Download
                                        </a>

                                    </div>
                                )}

                            </div>

                        </div>

                        {/* COVER LETTER */}
                        <div className='mt-5'>

                            <label className='block mb-1 text-sm font-medium'>
                                Cover Letter
                            </label>

                            <textarea
                                rows='5'
                                value={app.coverLetter || ''}
                                onChange={(e) =>
                                    handleInputChange(
                                        index,
                                        'coverLetter',
                                        e.target.value
                                    )
                                }
                                placeholder='Write about yourself...'
                                className='w-full border rounded-lg px-4 py-3 outline-none resize-none focus:border-green-500'
                            />

                        </div>

                        {/* VOICE NOTE */}
                        <div className='mt-6'>

                            <h3 className='font-semibold text-gray-700 mb-3'>
                                Voice Introduction
                            </h3>

                            <div className='flex flex-wrap gap-3'>

                                <button
                                    onClick={startRecording}
                                    className='bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg'
                                >
                                    Start Recording
                                </button>

                                <button
                                    onClick={() => stopRecording(index)}
                                    className='bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg'
                                >
                                    Stop & Save
                                </button>

                            </div>

                            {app.voiceNote && (

                                <div className='mt-4'>

                                    <audio
                                        controls
                                        src={app.voiceNote}
                                        className='w-full'
                                    />

                                </div>
                            )}

                        </div>

                    </div>
                ))}

            </div>

        </div>
    )
}

export default Applications