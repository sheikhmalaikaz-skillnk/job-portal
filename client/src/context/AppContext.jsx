import { createContext, useEffect, useState } from "react"
import { jobsData } from "../assets/assets"

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    })

    const [isSearched, setIsSearched] = useState(false)
    const [jobs, setJobs] = useState([])
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    // ✅ FIX: missing navigation state (THIS WAS BREAKING YOUR APP)
    const [currentPage, setCurrentPage] = useState('home')

    const fetchJobs = () => {
        setJobs(jobsData)
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    return (
        <AppContext.Provider value={{
            searchFilter,
            setSearchFilter,
            isSearched,
            setIsSearched,
            jobs,
            setJobs,
            showRecruiterLogin,
            setShowRecruiterLogin,
            currentPage,
            setCurrentPage
        }}>
            {children}
        </AppContext.Provider>
    )
}