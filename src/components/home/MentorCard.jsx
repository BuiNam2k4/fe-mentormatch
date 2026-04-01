import React from "react"
import { Star, Clock } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"

export default function MentorCard({ mentor }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardContent className="flex flex-col p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
              <Star className="h-4 w-4 fill-current" />
              {mentor.rating.toFixed(1)}
            </div>
            <span className="text-xs text-muted-foreground mt-1">({mentor.reviews} reviews)</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{mentor.name}</h3>
          <p className="text-sm text-primary font-medium mb-3">{mentor.expertise} - {mentor.yearOfExp}</p>
          
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {mentor.bio}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {mentor.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="font-normal text-xs bg-slate-100 text-slate-700">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t mt-auto">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="font-bold text-lg">${mentor.hourlyRate}</span>
            <span className="text-xs text-muted-foreground">/ hour</span>
          </div>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
            Book Trial
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
