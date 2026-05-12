import { useNavigate } from "react-router-dom"

// Dummy data for design
const postedJobs = [
  { id: 1, title: "Frontend Developer", location: "Remote", applicants: 24, status: "Active" },
  { id: 2, title: "UI/UX Designer", location: "Lahore", applicants: 15, status: "Active" },
  { id: 3, title: "Digital Marketer", location: "Karachi", applicants: 8, status: "Closed" },
]

const ManageJobs = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your posted job listings</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/add-job')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add New Job
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Location</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Applicants</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {postedJobs.map(job => (
              <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{job.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{job.location}</td>
                <td className="px-6 py-4 text-sm text-gray-800 font-semibold text-center">{job.applicants}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => navigate('/dashboard/view-applications')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageJobs