import { useContext } from "react"
import { Routes, Route } from "react-router-dom"

import { AppContext } from "./context/AppContext"

import RecruiterLogin from "./components/RecruiterLogin"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import JobListing from "./components/JobListing"
import AppDownload from "./components/AppDownload"
import Footer from "./components/Footer"

// Pages
import Applications from "./pages/Applications"
import Dashboard from "./pages/Dashboard"
import AddJob from "./pages/AddJob"
import ManageJobs from "./pages/ManageJobs"
import ViewApplication from "./pages/ViewApplication"
import JobDetails from "./pages/JobDetails"
import 'quill/dist/quill.snow.css'
// Home Page Component
const Home = () => (
  <div className="min-h-screen bg-gray-50">
    
    <Navbar />

    <main>
      <Hero />
      <JobListing />
      <AppDownload />
    </main>

    <Footer />

  </div>
)

function App() {

  const { showRecruiterLogin, setShowRecruiterLogin } = useContext(AppContext)

  return (
    <>

      {/* Recruiter Login Modal */}
      {showRecruiterLogin && (

        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center"
          onClick={() => setShowRecruiterLogin(false)}
        >

          <div
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setShowRecruiterLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
            >
              ×
            </button>

            <RecruiterLogin />

          </div>

        </div>
      )}

      {/* Main Routes */}
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Job Details */}
        <Route path="/job/:id" element={<JobDetails />} />

        {/* User Applications */}
        <Route path="/applications" element={<Applications />} />

        {/* Recruiter Dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>

          <Route path="add-job" element={<AddJob />} />

          <Route path="manage-jobs" element={<ManageJobs />} />

          <Route
            path="view-applications"
            element={<ViewApplication />}
          />

        </Route>

      </Routes>

    </>
  )
}

export default App   