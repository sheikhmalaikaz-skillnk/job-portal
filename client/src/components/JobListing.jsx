import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'

const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)
    const [showFilter, setShowFilter] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedLocations, setSelectedLocations] = useState([])
    const [filteredJobs, setFilteredJobs] = useState([])

    const clearTitle = () => setSearchFilter(prev => ({ ...prev, title: "" }))
    const clearLocation = () => setSearchFilter(prev => ({ ...prev, location: "" }))

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category])
    }

    const handleLocationChange = (location) => {
        setSelectedLocations(prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location])
    }

    useEffect(() => {
        const newFilteredJobs = jobs?.slice().reverse().filter(job =>
            (selectedCategories.length === 0 || selectedCategories.includes(job.category)) &&
            (selectedLocations.length === 0 || selectedLocations.includes(job.location)) &&
            (searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())) &&
            (searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase()))
        ) || []
        setFilteredJobs(newFilteredJobs)
        setCurrentPage(1)
    }, [jobs, selectedCategories, selectedLocations, searchFilter])

    const jobsPerPage = 6
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

    return (
        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
            
            <div className='w-full lg:w-1/4 bg-white px-4'>
                <button onClick={() => setShowFilter(prev => !prev)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden mb-4'>
                    {showFilter ? "Close Filters" : "Show Filters"}
                </button>

                {showFilter && (
                    <>
                        {isSearched && (searchFilter.title || searchFilter.location) && (
                            <div className='mb-4'>
                                <h2 className='font-bold text-lg mb-4'>Current Search</h2>
                                <div className='flex flex-wrap gap-2'>
                                    {searchFilter.title && (
                                        <span className='flex items-center gap-2 bg-green-50 border px-3 py-1 rounded'>
                                            {searchFilter.title}
                                            <img onClick={clearTitle} className='w-3 cursor-pointer' src={assets.cross_icon} alt="clear" />
                                        </span>
                                    )}
                                    {searchFilter.location && (
                                        <span className='flex items-center gap-2 bg-red-50 border px-3 py-1 rounded'>
                                            {searchFilter.location}
                                            <img onClick={clearLocation} className='w-3 cursor-pointer' src={assets.cross_icon} alt="clear" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className='mt-6'>
                            <h2 className='font-bold text-lg mb-3'>Search by Categories</h2>
                            <ul className='space-y-2 text-gray-700'>
                                {JobCategories.map(category => (
                                    <li key={category} className='flex items-center gap-2'>
                                        <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => handleCategoryChange(category)} />
                                        {category}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className='mt-6'>
                            <h2 className='font-bold text-lg mb-3'>Search by Location</h2>
                            <ul className='space-y-2 text-gray-700'>
                                {JobLocations.map(location => (
                                    <li key={location} className='flex items-center gap-2'>
                                        <input type="checkbox" checked={selectedLocations.includes(location)} onChange={() => handleLocationChange(location)} />
                                        {location}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>

            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
                <h3 className='font-bold text-3xl py-2'>Latest Jobs</h3>
                <p className='mb-8'>Get your desired job from top companies</p>

                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {filteredJobs.length > 0 ? (
                        filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map((job, index) => (
                            <JobCard key={job.id || index} job={job} />
                        ))
                    ) : (
                        <div className='col-span-full text-center py-20'>
                            <p className='text-gray-400 text-lg'>No jobs found</p>
                        </div>
                    )}
                </div>

                {filteredJobs.length > 0 && (
                    <div className='flex items-center justify-center gap-2 mt-10'>
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`p-2 rounded ${currentPage === 1 ? 'opacity-50' : 'hover:bg-gray-100'}`}>
                            <img src={assets.left_arrow_icon} alt="prev" />
                        </button>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button key={index} onClick={() => setCurrentPage(index + 1)} className={`w-10 h-10 border rounded ${currentPage === index + 1 ? 'bg-blue-100 text-blue-600 border-blue-300' : 'text-gray-500'}`}>
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`p-2 rounded ${currentPage === totalPages ? 'opacity-50' : 'hover:bg-gray-100'}`}>
                            <img src={assets.right_arrow_icon} alt="next" />
                        </button>
                    </div>
                )}
            </section>
        </div>
    )
}

export default JobListing