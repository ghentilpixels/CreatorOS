"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Video,
  CheckCircle2,
  Clock,
  Plus,
  X,
  Sparkles,
  Radio,
  FileText,
  Mic2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventStatus = "published" | "recording" | "scheduled" | "ideas" | "draft";
type EventType = "video" | "stream" | "short" | "podcast";

interface CalendarEvent {
  id: string;
  date: number;
  month: number;
  year: number;
  title: string;
  status: EventStatus;
  type: EventType;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_STYLES: Record<EventStatus, { pill: string; dot: string; label: string }> = {
  published: { pill: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20", dot: "bg-emerald-500", label: "Published" },
  recording: { pill: "bg-amber-500/20 text-amber-400 border border-amber-500/20", dot: "bg-amber-500", label: "Recording" },
  scheduled: { pill: "bg-blue-500/20 text-blue-400 border border-blue-500/20", dot: "bg-blue-500", label: "Scheduled" },
  ideas:     { pill: "bg-purple-500/20 text-purple-400 border border-purple-500/20", dot: "bg-purple-500", label: "Idea" },
  draft:     { pill: "bg-zinc-500/20 text-zinc-400 border border-zinc-500/20", dot: "bg-zinc-400", label: "Draft" },
};

const TYPE_ICON: Record<EventType, React.ElementType> = {
  video: Video,
  stream: Radio,
  short: Sparkles,
  podcast: Mic2,
};

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: "1", date: 4,  month: 7, year: 2025, title: "React 19 Deep Dive",  status: "published", type: "video" },
  { id: "2", date: 8,  month: 7, year: 2025, title: "Next.js Tutorial",     status: "published", type: "video" },
  { id: "3", date: 15, month: 7, year: 2025, title: "Desk Setup Tour",      status: "recording", type: "video" },
  { id: "4", date: 22, month: 7, year: 2025, title: "Tailwind v4 Guide",    status: "scheduled", type: "short" },
  { id: "5", date: 28, month: 7, year: 2025, title: "Q&A Livestream",       status: "ideas",     type: "stream" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContentPlanner() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear]   = useState(now.getFullYear());
  const [events, setEvents]             = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [modalOpen, setModalOpen]       = useState(false);
  const [detailEvent, setDetailEvent]   = useState<CalendarEvent | null>(null);

  // form state
  const [newTitle,    setNewTitle]    = useState("");
  const [newStatus,   setNewStatus]   = useState<EventStatus>("scheduled");
  const [newType,     setNewType]     = useState<EventType>("video");

  const daysInMonth     = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const isToday = (date: number) =>
    date === now.getDate() &&
    currentMonth === now.getMonth() &&
    currentYear  === now.getFullYear();

  const eventsForDate = (date: number) =>
    events.filter(e => e.date === date && e.month === currentMonth && e.year === currentYear);

  const upcomingEvents = useMemo(() =>
    events
      .filter(e => {
        const d = new Date(e.year, e.month, e.date);
        return d >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
      })
      .sort((a, b) => new Date(a.year, a.month, a.date).getTime() - new Date(b.year, b.month, b.date).getTime())
      .slice(0, 5),
  [events]);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDate(null);
  };

  const openAddModal = (date?: number) => {
    if (date) setSelectedDate(date);
    setNewTitle("");
    setNewStatus("scheduled");
    setNewType("video");
    setDetailEvent(null);
    setModalOpen(true);
  };

  const handleDayClick = (date: number) => {
    const dayEvents = eventsForDate(date);
    if (dayEvents.length > 0) {
      setDetailEvent(dayEvents[0]);
      setSelectedDate(date);
    } else {
      setSelectedDate(date);
      openAddModal(date);
    }
  };

  const saveEvent = () => {
    if (!newTitle.trim() || !selectedDate) return;
    const evt: CalendarEvent = {
      id: `${Date.now()}`,
      date: selectedDate,
      month: currentMonth,
      year: currentYear,
      title: newTitle.trim(),
      status: newStatus,
      type: newType,
    };
    setEvents(prev => [...prev, evt]);
    setModalOpen(false);
    setDetailEvent(evt);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setDetailEvent(null);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Content Planner
          </h1>
          <p className="text-muted-foreground mt-1">Schedule and organize your publishing pipeline.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Navigator */}
          <div className="flex items-center glass rounded-xl p-1 gap-1">
            <button
              onClick={prevMonth}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold px-3 min-w-[130px] text-center tabular-nums">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button
              onClick={nextMonth}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={() => openAddModal(selectedDate ?? now.getDate())}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Schedule
          </Button>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(STATUS_STYLES) as [EventStatus, typeof STATUS_STYLES[EventStatus]][]).map(([status, s]) => (
          <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            {s.label}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Calendar ── */}
        <div className="flex-1 glass rounded-3xl p-6 border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-3 relative z-10">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2 relative z-10">
            {/* empty lead cells */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`e-${i}`} className="aspect-square rounded-2xl bg-white/[0.02]" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date      = i + 1;
              const today     = isToday(date);
              const dayEvents = eventsForDate(date);
              const selected  = selectedDate === date;

              return (
                <motion.button
                  key={date}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.008, type: "spring", stiffness: 260, damping: 20 }}
                  onClick={() => handleDayClick(date)}
                  className={`aspect-square rounded-2xl p-2 relative group transition-all flex flex-col text-left
                    ${today    ? "bg-primary/20 border-2 border-primary/60 shadow-lg shadow-primary/10" : ""}
                    ${selected && !today ? "ring-2 ring-primary/40 bg-white/10" : ""}
                    ${!today   ? "bg-background/40 border border-white/5 hover:bg-white/8 hover:border-white/20" : ""}
                  `}
                >
                  <span className={`text-xs sm:text-sm font-bold leading-none
                    ${today    ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}
                  `}>
                    {date}
                  </span>

                  {/* event chips */}
                  <div className="mt-auto space-y-0.5 w-full">
                    {dayEvents.slice(0, 2).map(evt => {
                      const Icon = TYPE_ICON[evt.type];
                      return (
                        <div
                          key={evt.id}
                          className={`text-[9px] sm:text-[10px] font-medium px-1 py-0.5 rounded truncate flex items-center gap-0.5 ${STATUS_STYLES[evt.status].pill}`}
                        >
                          <Icon className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate hidden sm:block">{evt.title}</span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-muted-foreground px-1">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="w-full lg:w-80 space-y-4">

          {/* Selected day detail */}
          <AnimatePresence mode="wait">
            {detailEvent && (
              <motion.div
                key={detailEvent.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass rounded-3xl p-5 border-white/5 shadow-xl space-y-4"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-base leading-tight pr-2">{detailEvent.title}</h3>
                  <button
                    onClick={() => { setDetailEvent(null); setSelectedDate(null); }}
                    className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[detailEvent.status].pill}`}>
                    {STATUS_STYLES[detailEvent.status].label}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 capitalize">
                    {detailEvent.type}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  {MONTH_NAMES[detailEvent.month]} {detailEvent.date}, {detailEvent.year}
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-xs"
                    onClick={() => openAddModal(selectedDate ?? undefined)}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add More
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs"
                    onClick={() => deleteEvent(detailEvent.id)}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upcoming events */}
          <div className="glass rounded-3xl p-5 border-white/5 shadow-xl">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Upcoming
            </h3>

            <div className="space-y-3">
              {upcomingEvents.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No upcoming events</p>
              )}
              {upcomingEvents.map((event, i) => {
                const Icon = TYPE_ICON[event.type];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      setCurrentMonth(event.month);
                      setCurrentYear(event.year);
                      setSelectedDate(event.date);
                      setDetailEvent(event);
                    }}
                    className="flex gap-3 p-3 rounded-xl bg-background/50 border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-col items-center justify-center bg-white/5 rounded-lg w-11 h-11 shrink-0 border border-white/10 group-hover:border-primary/30 transition-colors">
                      <span className="text-[10px] text-muted-foreground uppercase">{MONTH_NAMES[event.month].slice(0,3)}</span>
                      <span className="font-bold text-base leading-none">{event.date}</span>
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{event.title}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[event.status].dot}`} />
                        <span className="text-xs text-muted-foreground capitalize">{event.status}</span>
                        <Icon className="w-3 h-3 text-muted-foreground ml-1" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Button
              onClick={() => openAddModal(now.getDate())}
              variant="outline"
              className="w-full mt-5 bg-transparent border-white/10 hover:bg-white/5 gap-2 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Event
            </Button>
          </div>
        </div>
      </div>

      {/* ── Add Event Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="glass w-full max-w-md rounded-3xl p-7 border border-white/10 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Schedule Content</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Date</label>
                <div className="text-sm font-medium text-foreground glass rounded-xl px-4 py-2.5 border-white/10">
                  {selectedDate ? `${MONTH_NAMES[currentMonth]} ${selectedDate}, ${currentYear}` : "No date selected"}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Title</label>
                <input
                  className="w-full bg-background/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                  placeholder="e.g. React 19 Full Tutorial"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveEvent()}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["video", "short", "stream", "podcast"] as EventType[]).map(t => {
                    const Icon = TYPE_ICON[t];
                    return (
                      <button
                        key={t}
                        onClick={() => setNewType(t)}
                        className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-xs font-medium capitalize transition-all border ${
                          newType === t
                            ? "bg-primary/20 border-primary/50 text-primary"
                            : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["scheduled", "ideas", "draft", "recording"] as EventStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setNewStatus(s)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium capitalize transition-all border ${
                        newStatus === s
                          ? `${STATUS_STYLES[s].pill}`
                          : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[s].dot}`} />
                      {STATUS_STYLES[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveEvent}
                  disabled={!newTitle.trim()}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-40"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Save Event
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
