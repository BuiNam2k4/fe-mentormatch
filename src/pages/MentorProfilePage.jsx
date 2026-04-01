import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import MentorHeader from "../components/mentor/MentorHeader"
import MentorSkills from "../components/mentor/MentorSkills"
import MentorAbout from "../components/mentor/MentorAbout"
import MentorReviews from "../components/mentor/MentorReviews"
import BookingWidget from "../components/mentor/BookingWidget"
import GuaranteeCard from "../components/mentor/GuaranteeCard"
import { userService } from "../services/userService"

export default function MentorProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileResult, slotsResult] = await Promise.allSettled([
        userService.getUserById(id),
        userService.getMentorTimeSlots(id)
      ]);
      
      if (profileResult.status === 'fulfilled' && profileResult.value.code === 1000) {
        setUser(profileResult.value.result);
      }
      if (slotsResult.status === 'fulfilled' && slotsResult.value.code === 1000) {
        setTimeSlots(slotsResult.value.result);
      }
    } catch (err) {
      console.error("Failed to fetch mentor profile or time slots", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
       fetchProfile();
    }
  }, [id]);

  const handleBookingSuccess = () => {
    // Only re-fetch the slots to update the calendar UI seamlessly
    userService.getMentorTimeSlots(id).then(res => {
      if (res.code === 1000) setTimeSlots(res.result);
    }).catch(console.error);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column - Main Profile Content */}
        <div className="flex-1 w-full min-w-0">
          <MentorHeader user={user} loading={loading} />
          {!loading && user && (
            <>
              <MentorSkills user={user} />
              <MentorAbout user={user} />
              <MentorReviews mentorId={user.id} />
            </>
          )}
        </div>

        {/* Right Column - Booking Sidebar */}
        <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24">
          <BookingWidget timeSlots={timeSlots} onBookingSuccess={handleBookingSuccess} />
          <GuaranteeCard />
        </div>

      </div>
    </div>
  )
}
