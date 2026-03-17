import React from 'react'

const Privacy = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg text-[#f0ede8]">Privacy Policy</h3>

      <p>
        This platform values your privacy. We only collect information necessary to track your internship progress.
      </p>

      <h4 className="text-md font-semibold">1. Information We Collect</h4>
      <p>
        - Google authentication information (name, email) to access your account. <br/>
        - Internship hours and notes you log on the platform.
      </p>

      <h4 className="text-md font-semibold">2. How We Use Your Information</h4>
      <p>
        Your data is used solely to provide you with an accurate record of your internship hours and progress.
      </p>

      <h4 className="text-md font-semibold">3. Data Security</h4>
      <p>
        All information is stored securely. We follow industry-standard security practices to protect your data.
      </p>

      <h4 className="text-md font-semibold">4. No Sharing</h4>
      <p>
        We do not sell, rent, or share your personal information with any third parties.
      </p>

      <h4 className="text-md font-semibold">5. Retention and Deletion</h4>
      <p>
        You can delete your account at any time, which will remove all your logged hours and notes from our system.
      </p>

      <h4 className="text-md font-semibold">6. Changes</h4>
      <p>
        We may update this privacy policy occasionally. Continued use of the platform constitutes acceptance of any updates.
      </p>
    </div>
  )
}

export default Privacy