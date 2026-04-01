import React from "react"
import { Search, MapPin, Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"

const POPULAR_SKILLS = ["React", "Java", "English", "UI/UX", "Python", "Marketing"]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-28 lg:pb-36 flex items-center justify-center">
      {/* Background Decor */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0b5cff] to-[#0d9488] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" clipPath="polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
      </div>

      <div className="container mx-auto px-4 md:px-8 text-center flex flex-col items-center">
        <Badge variant="secondary" className="mb-6 px-3 py-1 bg-blue-50 text-primary border border-blue-100 flex items-center gap-1.5 rounded-full text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>New Escrow Payment System is Live</span>
        </Badge>
        
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl mb-6 leading-tight">
          Master any skill with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-500">world-class mentors</span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-10 leading-relaxed">
          The most trusted network of experts. Book 1-on-1 sessions, get personalized guidance, and guarantee your satisfaction with secure escrow payments.
        </p>

        {/* Large Search Bar */}
        <div className="w-full max-w-2xl bg-white p-2 sm:p-3 rounded-2xl sm:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col sm:flex-row items-center gap-3 relative z-10">
          <div className="flex-1 flex items-center w-full px-4 text-slate-800">
            <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
            <input 
              type="text" 
              placeholder="What do you want to learn? (e.g. Java, English)" 
              className="w-full bg-transparent border-none outline-none text-base h-12 focus:ring-0 placeholder:text-slate-400"
            />
          </div>
          
          <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
          
          <Button size="lg" className="w-full sm:w-auto rounded-xl sm:rounded-full h-12 px-8 font-semibold text-base shrink-0">
            Find Mentor
          </Button>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <p className="text-sm font-medium text-slate-500 mb-3">Popular skills learned today</p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_SKILLS.map((skill) => (
              <Badge key={skill} variant="outline" className="hover:bg-slate-100 cursor-pointer rounded-full px-3 py-1 font-medium bg-white border-slate-200">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
