import React from "react"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-white pt-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
                M
              </div>
              <span className="text-xl font-bold text-primary">MentorMatch</span>
            </div>
            <p className="mb-6 text-sm text-muted-foreground leading-relaxed max-w-sm">
              The premier platform connecting ambitious learners with world-class mentors. Achieve your career goals with personalized guidance and secure escrow payments.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-slate-900">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Find Mentors</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Become a Mentor</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-900">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Career Guides</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-900">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@mentormatch.com</li>
              <li>1-800-MENTOR-ME</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t py-6 md:flex-row text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MentorMatch Inc. All rights reserved.</p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
