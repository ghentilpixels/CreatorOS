"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Workflow, Plus, Play, Save, GripVertical, Bot, ArrowDown, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const AVAILABLE_AGENTS = [
  { id: "agent-research", name: "Research Agent", color: "bg-blue-500" },
  { id: "agent-script", name: "Script Agent", color: "bg-purple-500" },
  { id: "agent-seo", name: "SEO Agent", color: "bg-green-500" },
  { id: "agent-thumbnail", name: "Thumbnail Agent", color: "bg-orange-500" },
  { id: "agent-trend", name: "Trend Agent", color: "bg-pink-500" },
];

export default function WorkflowBuilder() {
  const [steps, setSteps] = useState([
    { id: "step-1", type: "trigger", name: "New Topic Added", isFixed: true },
    { id: "step-2", type: "agent", name: "Research Agent", agentId: "agent-research", color: "bg-blue-500" },
    { id: "step-3", type: "agent", name: "Script Agent", agentId: "agent-script", color: "bg-purple-500" },
    { id: "step-4", type: "agent", name: "SEO Agent", agentId: "agent-seo", color: "bg-green-500" },
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

  const addAgent = (agent: any) => {
    const newStep = {
      id: `step-${Date.now()}`,
      type: "agent",
      name: agent.name,
      agentId: agent.id,
      color: agent.color
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
    <div className="flex-1 overflow-y-auto bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <Workflow className="w-6 h-6 text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Automation Builder</h1>
            </div>
            <p className="text-zinc-400">Chain AI agents together to automate your content pipeline.</p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10">
              <Save className="w-4 h-4" />
              Save Workflow
            </button>
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              <Play className="w-4 h-4" />
              Run Now
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl">
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
                          className={`relative flex items-center ${snapshot.isDragging ? 'z-50' : ''}`}
                        >
                          <div className={`w-full flex items-center justify-between p-5 rounded-xl border ${step.isFixed ? 'bg-zinc-800/80 border-white/5' : 'bg-zinc-900/80 border-white/10 shadow-lg'} backdrop-blur-sm transition-all`}>
                            <div className="flex items-center gap-4">
                              <div {...provided.dragHandleProps} className={`${step.isFixed ? 'opacity-0 cursor-default' : 'cursor-grab text-zinc-500 hover:text-white'}`}>
                                <GripVertical className="w-5 h-5" />
                              </div>
                              
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${step.type === 'agent' ? step.color + '/20' : 'bg-white/5'}`}>
                                {step.type === 'agent' ? (
                                  <Bot className={`w-5 h-5 text-${step.color?.split('-')[1]}-400`} />
                                ) : (
                                  <Play className="w-5 h-5 text-zinc-400" />
                                )}
                              </div>
                              
                              <div>
                                <h3 className="text-white font-medium">{step.name}</h3>
                                <p className="text-xs text-zinc-500 capitalize">{step.type}</p>
                              </div>
                            </div>

                            {!step.isFixed && (
                              <button onClick={() => removeStep(step.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Arrow connector */}
                          {index < steps.length - 1 && (
                            <div className="absolute left-12 -bottom-6 flex flex-col items-center">
                              <div className="w-0.5 h-6 bg-white/10" />
                              <ArrowDown className="w-4 h-4 text-white/20 absolute bottom-0 translate-y-1/2" />
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
          <div className="mt-12 flex justify-center">
            {isAdding ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-800 border border-white/10 rounded-xl p-4 flex gap-2 flex-wrap max-w-lg justify-center"
              >
                {AVAILABLE_AGENTS.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => addAgent(agent)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-zinc-300 transition-colors"
                  >
                    <Bot className="w-4 h-4" />
                    {agent.name}
                  </button>
                ))}
                <button onClick={() => setIsAdding(false)} className="px-3 py-2 text-sm text-zinc-500 hover:text-white">Cancel</button>
              </motion.div>
            ) : (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-6 py-3 rounded-full transition-all border border-purple-500/20"
              >
                <Plus className="w-4 h-4" />
                Add Agent Step
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
