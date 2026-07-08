"use client";

import { useState } from 'react';
import { Sparkles, Save, Copy, Loader2, Image as ImageIcon, Lightbulb, Type, Smile, Layout, Box, CopyCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateThumbnailAI, saveThumbnail } from '@/features/thumbnails/actions';
import { toast } from 'sonner';

export default function ThumbnailStudio() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState('High Contrast / Minimalist');
  
  const [thumbnailData, setThumbnailData] = useState<{
    concept: string;
    headline: string;
    emotion: string;
    composition: string;
    objects: string;
    prompt: string;
    tips: string[];
  } | null>(null);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await generateThumbnailAI({
        topic,
        audience: audience || 'General Audience',
        style,
      });

      if (response.success && response.data) {
        setThumbnailData(response.data);
        toast.success('Thumbnail concept generated!');
      } else {
        toast.error(response.error || 'Failed to generate thumbnail concept');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!thumbnailData) return;
    
    setIsSaving(true);
    try {
      const response = await saveThumbnail(thumbnailData);

      if (response.success) {
        toast.success('Thumbnail concept saved successfully!');
      } else {
        toast.error(response.error || 'Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col xl:flex-row gap-6">
      {/* Canvas Section */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto scrollbar-hide pb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-glow bg-transparent border-none outline-none w-full truncate">
              {thumbnailData?.headline || "Thumbnail Concept"}
            </h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Thumbnail Studio
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              className="gap-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20"
              onClick={handleSave}
              disabled={isSaving || !thumbnailData}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
              {isSaving ? 'Saving...' : 'Save Concept'}
            </Button>
          </div>
        </div>

        {thumbnailData ? (
          <div className="flex flex-col gap-6">
            <div className="glass rounded-2xl p-8 border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-6">
                
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white/90 mb-1">Core Concept</h3>
                    <p className="text-white/70 leading-relaxed">{thumbnailData.concept}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <Type className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Headline Text</span>
                      <p className="text-xl font-bold text-white tracking-wide mt-1">{thumbnailData.headline}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <Smile className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Target Emotion</span>
                      <p className="text-white font-medium mt-1">{thumbnailData.emotion}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <Layout className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Composition</span>
                      <p className="text-white/80 mt-1 text-sm">{thumbnailData.composition}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <Box className="w-5 h-5 text-pink-400 mt-0.5" />
                    <div>
                      <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Key Objects</span>
                      <p className="text-white/80 mt-1 text-sm">{thumbnailData.objects}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white/90">Midjourney / AI Image Prompt</h3>
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => copyToClipboard(thumbnailData.prompt)}>
                      <Copy className="w-3.5 h-3.5" /> Copy Prompt
                    </Button>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 font-mono text-sm text-white/70 leading-relaxed border border-white/5">
                    {thumbnailData.prompt}
                  </div>
                </div>

              </div>
            </div>

            <div className="glass rounded-2xl p-6 border-white/5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" /> CTR Improvement Tips
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {thumbnailData.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary text-xs font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-white/80 text-sm leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex-1 glass rounded-2xl flex items-center justify-center border-white/5 shadow-2xl p-10 text-center">
            <div className="max-w-md flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-primary opacity-50" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Concept Generated</h3>
              <p className="text-white/50 text-lg">
                Enter your video topic in the sidebar and let AI craft the perfect, high-converting thumbnail concept.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Sidebar */}
      <div className="w-full xl:w-[400px] flex flex-col gap-4 shrink-0 overflow-y-auto scrollbar-hide">
        <div className="p-5 glass rounded-2xl border-white/5 shadow-lg relative flex flex-col gap-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-2 relative z-10">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="font-bold text-lg">Thumbnail Generator</h2>
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            <div className="space-y-2">
              <Label>Video Topic</Label>
              <Input 
                placeholder="e.g. 10 ways to boost productivity" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input 
                placeholder="e.g. Entrepreneurs, Students" 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Visual Style</Label>
              <Select value={style} onValueChange={(val) => val && setStyle(val)}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High Contrast / Minimalist">High Contrast / Minimalist</SelectItem>
                  <SelectItem value="Vibrant & Playful">Vibrant & Playful</SelectItem>
                  <SelectItem value="Dark & Moody (Cinematic)">Dark & Moody (Cinematic)</SelectItem>
                  <SelectItem value="Tech/Neon Aesthetic">Tech/Neon Aesthetic</SelectItem>
                  <SelectItem value="Documentary / Realism">Documentary / Realism</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium shadow-lg shadow-purple-500/20"
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Concept...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Concept
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
