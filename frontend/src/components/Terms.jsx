import React from 'react'

const Terms = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg text-[#f0ede8]">Terms and Conditions</h3>

      <p>
        By using this OJT Hours Tracking platform, you agree to the following terms:
      </p>

      <h4 className="text-md font-semibold">1. Student Use Only</h4>
      <p>
        This platform is intended solely for students to track their internship hours and notes. You must provide accurate information when logging your activities.
      </p>

      <h4 className="text-md font-semibold">2. Account Access</h4>
      <p>
        You can log in only using your Google account. You are responsible for maintaining the security of your Google account.
      </p>

      <h4 className="text-md font-semibold">3. Data Usage</h4>
      <p>
        The platform collects only the information you provide through Google authentication and your logged hours/notes. This information is used solely to track your internship progress.
      </p>

      <h4 className="text-md font-semibold">4. Limitations of Liability</h4>
      <p>
        The platform is provided "as-is." We are not liable for any errors in your logged hours or notes. Students are responsible for the accuracy of their records.
      </p>

      <h4 className="text-md font-semibold">5. Changes</h4>
      <p>
        We may update these terms occasionally. Continued use of the platform constitutes acceptance of the updated terms.
      </p>
    </div>
  )
}

export default Terms