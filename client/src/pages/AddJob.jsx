import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useClerk } from "@clerk/clerk-react"
import Quill from "quill"
import "quill/dist/quill.snow.css"

const AddJob = () => {

  const navigate = useNavigate()
  const { signOut } = useClerk()

  // Form States
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [category, setCategory] = useState('')
  const [experience, setExperience] = useState('')

  // Hidden Menu State
  const [showMenu, setShowMenu] = useState(false)

  // Quill Editor Refs
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  // Initialize Quill
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {

      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write job description here...',
      })

    }
  }, [])

  // Submit Function
  const handleSubmit = (e) => {
    e.preventDefault()

    const description =
      quillRef.current?.root.innerHTML || ""

    console.log({
      title,
      location,
      salary,
      category,
      experience,
      description
    })

    alert("Job Posted Successfully!")

    navigate('/dashboard/manage-jobs')
  }

  return (
    <div className="max-w-4xl mx-auto relative">

      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Post a New Job
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Fill all details carefully
          </p>
        </div>

        {/* Hidden Menu Button */}
        <div className="relative">

          {/* Small Hidden Toggle */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold"
          >
            ⋮
          </button>

          {/* Hidden Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">

              <button
                onClick={() => navigate('/applications')}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition"
              >
                My Profile
              </button>

              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Job Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Job Title
            </label>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Frontend Developer"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Location
            </label>

            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lahore, Pakistan"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Salary
            </label>

            <input
              type="text"
              required
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="80K - 120K"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Category
            </label>

            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="">Select Category</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          {/* Experience */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Experience Level
            </label>

            <select
              required
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="">Select Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          {/* Quill Editor */}
          <div className="md:col-span-2">

            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Job Description
            </label>

            <div className="border border-gray-300 rounded-xl overflow-hidden">
              <div
                ref={editorRef}
                className="min-h-[220px] bg-white"
              />
            </div>

          </div>

        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-medium transition"
          >
            Post Job
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-xl text-sm font-medium transition"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  )
}

export default AddJob