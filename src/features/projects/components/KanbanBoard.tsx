"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { MoreHorizontal, Calendar, Eye, PlaySquare, Plus } from "lucide-react";

// Mock Data
const initialColumns = {
  ideas: {
    id: "ideas",
    title: "Ideas",
    videoIds: ["vid-1", "vid-2"],
  },
  researching: {
    id: "researching",
    title: "Researching",
    videoIds: ["vid-3"],
  },
  writing: {
    id: "writing",
    title: "Writing",
    videoIds: ["vid-4"],
  },
  recording: {
    id: "recording",
    title: "Recording",
    videoIds: [],
  },
  editing: {
    id: "editing",
    title: "Editing",
    videoIds: ["vid-5"],
  },
  scheduled: {
    id: "scheduled",
    title: "Scheduled",
    videoIds: ["vid-6"],
  },
  published: {
    id: "published",
    title: "Published",
    videoIds: ["vid-7"],
  },
};

type Video = {
  id: string;
  title: string;
  platform: string;
  tag: string;
  date?: string;
  views?: string;
};

const initialVideos: Record<string, Video> = {
  "vid-1": { id: "vid-1", title: "Top 10 AI Tools 2024", platform: "YouTube", tag: "Tech" },
  "vid-2": { id: "vid-2", title: "Day in the Life of a SWE", platform: "YouTube Shorts", tag: "Vlog" },
  "vid-3": { id: "vid-3", title: "How to Build a SaaS", platform: "YouTube", tag: "Tutorial" },
  "vid-4": { id: "vid-4", title: "React 19 Changes Explained", platform: "YouTube", tag: "Code" },
  "vid-5": { id: "vid-5", title: "My Desk Setup 2024", platform: "YouTube", tag: "Tech" },
  "vid-6": { id: "vid-6", title: "Is Next.js Still Good?", platform: "YouTube", tag: "Opinion", date: "Tomorrow" },
  "vid-7": { id: "vid-7", title: "CSS Grid vs Flexbox", platform: "YouTube", tag: "Tutorial", views: "14.2K" },
};

const columnOrder = ["ideas", "researching", "writing", "recording", "editing", "scheduled", "published"];

export function KanbanBoard({ projectId }: { projectId: string }) {
  const [mounted, setMounted] = useState(false);
  const [videos, setVideos] = useState(initialVideos);
  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId as keyof typeof columns];
    const finish = columns[destination.droppableId as keyof typeof columns];

    // Moving within the same column
    if (start === finish) {
      const newVideoIds = Array.from(start.videoIds);
      newVideoIds.splice(source.index, 1);
      newVideoIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        videoIds: newVideoIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving from one column to another
    const startVideoIds = Array.from(start.videoIds);
    startVideoIds.splice(source.index, 1);
    const newStart = {
      ...start,
      videoIds: startVideoIds,
    };

    const finishVideoIds = Array.from(finish.videoIds);
    finishVideoIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      videoIds: finishVideoIds,
    };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
  };

  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
      <DragDropContext onDragEnd={onDragEnd}>
        {columnOrder.map((columnId) => {
          const column = columns[columnId as keyof typeof columns];
          const columnVideos = column.videoIds.map((videoId) => videos[videoId as keyof typeof videos]);

          return (
            <div key={column.id} className="min-w-[300px] w-[300px] flex flex-col snap-start h-full max-h-full">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  {column.title}
                  <span className="text-xs font-medium bg-white/10 px-2 py-0.5 rounded-full text-muted-foreground">
                    {columnVideos.length}
                  </span>
                </h3>
                <button className="p-1 text-muted-foreground hover:text-foreground transition-colors hover:bg-white/5 rounded">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 glass bg-background/30 rounded-xl overflow-hidden flex flex-col">
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors ${
                        snapshot.isDraggingOver ? "bg-primary/5" : ""
                      }`}
                    >
                      {columnVideos.map((video, index) => (
                        <Draggable key={video.id} draggableId={video.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-3 p-4 rounded-xl bg-background border transition-all ${
                                snapshot.isDragging 
                                  ? "shadow-[0_8px_30px_rgb(0,0,0,0.2)] border-primary/50 rotate-2 z-50 cursor-grabbing" 
                                  : "border-border shadow-sm hover:border-primary/30 cursor-grab"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded flex w-fit">
                                  {video.tag}
                                </span>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <h4 className="font-semibold text-sm mb-3 leading-tight">{video.title}</h4>
                              
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <PlaySquare className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[80px]">{video.platform}</span>
                                </div>
                                
                                {video.date && (
                                  <div className="flex items-center gap-1.5 text-amber-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{video.date}</span>
                                  </div>
                                )}
                                
                                {video.views && (
                                  <div className="flex items-center gap-1.5 text-emerald-500">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{video.views}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
