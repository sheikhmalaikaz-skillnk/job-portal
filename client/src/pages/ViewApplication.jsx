const ViewApplication = () => {
  // Dummy applicants
  const applicants = [
    { id: 1, name: "Ahmed Khan", email: "ahmed@gmail.com", role: "Frontend Developer", status: "Shortlisted", applied: "2 days ago" },
    { id: 2, name: "Sara Ali", email: "sara@gmail.com", role: "Frontend Developer", status: "Pending", applied: "1 day ago" },
    { id: 3, name: "Usman Tariq", email: "usman@gmail.com", role: "UI/UX Designer", status: "Rejected", applied: "5 days ago" },
  ]

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Shortlisted': return 'bg-blue-100 text-blue-700'
      case 'Pending': return 'bg-yellow-100 text-yellow-700'
      case 'Rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Review candidates who applied to your job posts</p>
      </div>

      <div className="flex flex-col gap-4">
        {applicants.map(applicant => (
          <div key={applicant.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
                {applicant.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">{applicant.name}</h3>
                <p className="text-xs text-gray-400">{applicant.email}</p>
                <p className="text-sm text-gray-500 mt-1">Applied for: <span className="font-medium text-gray-700">{applicant.role}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-xs text-gray-400 hidden md:block">{applicant.applied}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(applicant.status)}`}>
                {applicant.status}
              </span>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-medium transition-all">
                Resume
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewApplication