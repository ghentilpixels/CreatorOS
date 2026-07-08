"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Video, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data
const daysInMonth = 31;
const startingDayOfWeek = 3; // 0 = Sun, 1 = Mon... (e.g., Wed start)
const todayDate = 15;

const events = [
  { date: 4, title: "React 19 Video", status: "published", type: "video" },
  { date: 8, title: "Next.js Tutorial", status: "published", type: "video" },
  { date: 15, title: "Desk Setup Tour", status: "recording", type: "video" },
  { date: 22, title: "Tailwind Guide", status: "scheduled", type: "video" },
  { date: 28, title: "Q&A Livestream", status: "ideas", type: "stream" },
];

export default function ContentPlanner() {
  const getEventForDate = (date: number) => events.find(e => e.date === date);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow flex items-center gap-3">
            Content Planner
          </h1>
          <p className="text-muted-foreground mt-1">Schedule and organize your publishing pipeline.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-background/50 border border-white/10 rounded-lg p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-4 w-32 text-center">August 2024</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <CalendarIcon className="w-4 h-4" /> Schedule
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Calendar Grid */}
        <div className="flex-1 glass rounded-3xl p-6 border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
          
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-4 mb-4 relative z-10">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="grid grid-cols-7 gap-3 relative z-10">
            {/* Empty slots before start of month */}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-white/[0.02]" />
            ))}
            
            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = i + 1;
              const isToday = date === todayDate;
              const event = getEventForDate(date);
              
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  key={date}
                  className={`aspect-square rounded-2xl p-2 sm:p-3 relative group transition-all cursor-pointer flex flex-col ${
                    isToday 
                      ? "bg-primary/20 border-2 border-primary/50 shadow-inner" 
                      : "bg-background/40 border border-white/5 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span className={`text-sm sm:text-base font-semibold ${isToday ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {date}
                  </span>
                  
                  {/* Event Indicator */}
                  {event && (
                    <div className="mt-auto">
                      <div className={`text-[10px] sm:text-xs font-medium px-1.5 py-1 rounded-md truncate w-full flex items-center gap-1 sm:gap-1.5 ${
                        event.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                        event.status === 'recording' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {event.status === 'published' ? <CheckCircle2 className="w-3 h-3 shrink-0 hidden sm:block" /> : 
                         event.status === 'recording' ? <Clock className="w-3 h-3 shrink-0 hidden sm:block" /> :
                         <Video className="w-3 h-3 shrink-0 hidden sm:block" />}
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Sidebar */}
        <div className="w-full lg:w-80 space-y-4">
          <div className="glass rounded-3xl p-6 border-white/5 shadow-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Upcoming
            </h3>
            
            <div className="space-y-4">
              {events.filter(e => e.date >= todayDate).map((event, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl bg-background/50 border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center justify-center bg-white/5 rounded-lg w-12 h-12 shrink-0">
                    <span className="text-xs text-muted-foreground uppercase">Aug</span>
                    <span className="font-bold text-lg leading-none">{event.date}</span>
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden">
                    <h4 className="font-semibold text-sm truncate">{event.title}</h4>
                    <span className="text-xs text-muted-foreground capitalize mt-0.5 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        event.status === 'recording' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-6 bg-transparent border-white/10 hover:bg-white/5">
              View All Tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
