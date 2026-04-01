import React from "react"
import MentorCard from "./MentorCard"
import { MOCK_MENTORS } from "../../data/mockData"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"

export default function TopMentors() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-3">
              Learn from the very best
            </h2>
            <p className="text-lg text-muted-foreground">
              Book 1-on-1 sessions with top industry experts. Secure with escrow payments.
            </p>
          </div>
          <Button variant="outline" className="shrink-0 font-medium group text-primary border-primary/20 hover:bg-primary/5">
            View All Mentors 
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_MENTORS.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      </div>
    </section>
  )
}
