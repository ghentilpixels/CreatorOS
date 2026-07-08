"use client";

import { useState } from 'react';
import { Sparkles, Save, Copy, Loader2, Search, Type, AlignLeft, Hash, MessageCircle, Share2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateSeoAssetAI, saveSeoAsset } from '@/features/seo/actions';
import { toast } from 'sonner';

export default function SeoStudio() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  
  const [seoData, setSeoData] = useState<{
    title: string;
    description: string;
    tags: string[];
    keywords: string[];
    hashtags: string[];
    pinnedComment: string;
    communityPost: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await generateSeoAssetAI({
        topic,
        context,
      });

      if (response.success && response.data) {
        setSeoData(response.data);
        toast.success('SEO metadata generated!');
      } else {
        toast.error(response.error || 'Failed to generate SEO metadata');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!seoData) return;
    
    setIsSaving(true);
    try {
      const response = await saveSeoAsset(seoData);

      if (response.success) {
        toast.success('SEO Asset saved successfully!');
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
      {/* Dashboard / Editor Section */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto scrollbar-hide pb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <input 
              type="text"
              value={seoData?.title || ''}
              onChange={(e) => setSeoData(prev => prev ? {...prev, title: e.target.value} : null)}
              className="text-2xl font-bold tracking-tight text-glow bg-transparent border-none outline-none w-full truncate"
              placeholder={seoData ? "SEO Title" : "Generated SEO Title will appear here"}
              disabled={!seoData}
            />
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Search className="w-4 h-4" /> SEO Studio
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              className="gap-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20"
              onClick={handleSave}
              disabled={isSaving || !seoData}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
              {isSaving ? 'Saving...' : 'Save Metadata'}
            </Button>
          </div>
        </div>

        {seoData ? (
          <div className="flex flex-col gap-6">
            <div className="glass rounded-2xl p-6 md:p-8 border-white/5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlignLeft className="w-5 h-5 text-blue-400" /> Description
                </h3>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(seoData.description)}>
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
              </div>
              <Textarea 
                value={seoData.description}
                onChange={(e) => setSeoData(prev => prev ? {...prev, description: e.target.value} : null)}
                className="min-h-[250px] bg-black/20 border-white/10 text-white/90 text-sm leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6 border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Hash className="w-5 h-5 text-purple-400" /> Tags & Keywords
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(seoData.tags.join(', '))}>
                    <Copy className="w-4 h-4 mr-2" /> Copy Tags
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/60 mb-2 block">Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {seoData.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-white/60 mb-2 block">Target Keywords</Label>
                    <div className="flex flex-wrap gap-2">
                      {seoData.keywords.map(kw => (
                        <span key={kw} className="px-3 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-400" /> Hashtags
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(seoData.hashtags.join(' '))}>
                    <Copy className="w-4 h-4 mr-2" /> Copy
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seoData.hashtags.map(ht => (
                    <span key={ht} className="px-4 py-2 bg-green-500/10 text-green-300 text-sm font-medium rounded-lg border border-green-500/20">
                      {ht}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6 border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-yellow-400" /> Pinned Comment
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(seoData.pinnedComment)}>
                    <Copy className="w-4 h-4 mr-2" /> Copy
                  </Button>
                </div>
                <Textarea 
                  value={seoData.pinnedComment}
                  onChange={(e) => setSeoData(prev => prev ? {...prev, pinnedComment: e.target.value} : null)}
                  className="min-h-[120px] bg-black/20 border-white/10"
                />
              </div>

              <div className="glass rounded-2xl p-6 border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-red-400" /> Community Post
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(seoData.communityPost)}>
                    <Copy className="w-4 h-4 mr-2" /> Copy
                  </Button>
                </div>
                <Textarea 
                  value={seoData.communityPost}
                  onChange={(e) => setSeoData(prev => prev ? {...prev, communityPost: e.target.value} : null)}
                  className="min-h-[120px] bg-black/20 border-white/10"
                />
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 glass rounded-2xl flex items-center justify-center border-white/5 shadow-2xl p-10 text-center">
            <div className="max-w-md flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-primary opacity-50" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No SEO Metadata Generated</h3>
              <p className="text-white/50 text-lg">
                Enter your video topic in the sidebar to generate highly optimized metadata for search.
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
            <h2 className="font-bold text-lg">SEO Generator</h2>
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            <div className="space-y-2">
              <Label>Main Topic or Title</Label>
              <Input 
                placeholder="e.g. 10 ways to boost productivity" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Extra Context / Script Summary (Optional)</Label>
              <Textarea 
                placeholder="Briefly describe what happens in the video to improve SEO accuracy..." 
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="bg-background/50 min-h-[120px]"
              />
            </div>
            
            <Button 
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium shadow-lg shadow-purple-500/20"
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating SEO...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate SEO Assets
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
