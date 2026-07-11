"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Workflow, Plus, Play, Save, GripVertical, Bot, ArrowDown, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const AVAILABLE_AGENTS = [
  { id: "agent-research", name: "Research Agent", color: "bg-blue-500", text: "text-blue-400", bgLight: "bg-blue-500/15" },
  { id: "agent-script", name: "Script Agent", color: "bg-purple-500", text: "text-purple-400", bgLight: "bg-purple-500/15" },
  { id: "agent-seo", name: "SEO Agent", color: "bg-emerald-500", text: "text-emerald-400", bgLight: "bg-emerald-500/15" },
  { id: "agent-thumbnail", name: "Thumbnail Agent", color: "bg-orange-500", text: "text-orange-400", bgLight: "bg-orange-500/15" },
  { id: "agent-trend", name: "Trend Agent", color: "bg-pink-500", text: "text-pink-400", bgLight: "bg-pink-500/15" },
];

export default function WorkflowBuilder() {
  const [steps, setSteps] = useState([
    { id: "step-1", type: "trigger", name: "New Topic Added", isFixed: true },
    { id: "step-2", type: "agent", name: "Research Agent", agentId: "agent-research", color: "bg-blue-500", text: "text-blue-400", bgLight: "bg-blue-500/15" },
    { id: "step-3", type: "agent", name: "Script Agent", agentId: "agent-script", color: "bg-purple-500", text: "text-purple-400", bgLight: "bg-purple-500/15" },
    { id: "step-4", type: "agent", name: "SEO Agent", agentId: "agent-seo", color: "bg-emerald-500", text: "text-emerald-400", bgLight: "bg-emerald-500/15" },
    { id: "step-5", type: "action", name: "Save Content Package", isFixed: true },
  ]);

  const [isAdding, setIsAdding] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newSteps = Array.from(steps);
    const [reorderedItem] = newSteps.splice(result.source.index, 1);
    
    // Prevent dragging above trigger or below save action
    if (result.destination.index === 0 || result.destination.index === steps.length - 1) {
      newSteps.splice(result.source.index, 0, reorderedItem); // revert
      setSteps(newSteps);
      return;
    }

    newSteps.splice(result.destination.index, 0, reorderedItem);
    setSteps(newSteps);
  };

  const addAgent = (agent: typeof AVAILABLE_AGENTS[0]) => {
    const newStep = {
      id: `step-${Date.now()}`,
      type: "agent",
      name: agent.name,
      agentId: agent.id,
      color: agent.color,
      text: agent.text,
      bgLight: agent.bgLight,
    };
    
    const newSteps = [...steps];
    newSteps.splice(steps.length - 1, 0, newStep); // insert before the last fixed step
    setSteps(newSteps);
    setIsAdding(false);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow flex items-center gap-3">
            <div className="p-2 bg-purple-500/15 rounded-xl">
              <Workflow className="w-6 h-6 text-purple-400" />
            </div>
            Automation Builder
          </h1>
          <p className="text-muted-foreground mt-1">Chain AI agents together to automate your content pipeline.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-background/50 border-white/10 hover:bg-white/5">
            <Save className="w-4 h-4" /> Save Workflow
          </Button>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
            <Play className="w-4 h-4" /> Run Now
          </Button>
        </div>
      </div>

      <div className="glass rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="workflow-steps">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {steps.map((step, index) => (
                    <Draggable key={step.id} draggableId={step.id} index={index} isDragDisabled={step.isFixed}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative flex flex-col items-center ${snapshot.isDragging ? 'z-50' : ''}`}
                        >
                          <div className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                            step.isFixed ? 'bg-background/80 border-white/5' : 'glass hover:bg-white/5 border-white/10'
                          } ${snapshot.isDragging ? 'shadow-2xl shadow-purple-500/10 border-purple-500/30' : ''}`}>
                            <div className="flex items-center gap-4">
                              <div {...provided.dragHandleProps} className={`${step.isFixed ? 'opacity-0 cursor-default' : 'cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors'}`}>
                                <GripVertical className="w-5 h-5" />
                              </div>
                              
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.bgLight || 'bg-white/5'}`}>
                                {step.type === 'agent' ? (
                                  <Bot className={`w-5 h-5 ${step.text}`} />
                                ) : step.type === 'trigger' ? (
                                  <Play className="w-5 h-5 text-purple-400" />
                                ) : (
                                  <Save className="w-5 h-5 text-emerald-400" />
                                )}
                              </div>
                              
                              <div>
                                <h3 className="font-semibold text-foreground">{step.name}</h3>
                                <p className="text-xs text-muted-foreground capitalize mt-0.5">{step.type}</p>
                              </div>
                            </div>

                            {!step.isFixed && (
                              <button onClick={() => removeStep(step.id)} className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Arrow connector */}
                          {index < steps.length - 1 && (
                            <div className="h-6 flex flex-col items-center justify-center relative w-full my-1">
                              <div className="w-[2px] h-full bg-gradient-to-b from-white/10 to-white/5" />
                              <ArrowDown className="w-3.5 h-3.5 text-white/20 absolute bottom-[-4px]" />
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Add Step Button */}
          <div className="mt-8 flex justify-center">
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="glass rounded-2xl p-4 flex gap-2 flex-wrap max-w-lg justify-center shadow-2xl"
                >
                  {AVAILABLE_AGENTS.map(agent => (
                    <button
                      key={agent.id}
                      onClick={() => addAgent(agent)}
                      className={`flex items-center gap-2 px-3 py-2 bg-background/50 hover:${agent.bgLight} border border-white/5 hover:border-${agent.color}/30 rounded-xl text-sm transition-all group`}
                    >
                      <Bot className={`w-4 h-4 text-muted-foreground group-hover:${agent.text}`} />
                      <span className="text-muted-foreground group-hover:text-foreground">{agent.name}</span>
                    </button>
                  ))}
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-colors">
                    Cancel
                  </button>
                </motion.div>
              ) : (
                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-6 py-3 rounded-full transition-all border border-purple-500/20 shadow-lg shadow-purple-500/5"
                >
                  <Plus className="w-4 h-4" /> Add Agent Step
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
