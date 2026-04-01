import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import RegistrationSidebar from "../components/mentor/RegistrationSidebar"
import RegistrationForm from "../components/mentor/RegistrationForm"

export default function MentorRegistrationPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Protect route
  useEffect(() => {
    if (!user && !localStorage.getItem('mentormatch_user')) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null; // Prevent flash

  return (
    <div className="min-h-screen bg-slate-50/30 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Navigation Context */}
          <RegistrationSidebar />

          {/* Main Form Content */}
          <div className="flex-1 w-full min-w-0 pb-12">
            <div className="animate-in fade-in duration-300">
              <RegistrationForm />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
