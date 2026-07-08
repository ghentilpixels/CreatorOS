"use client";

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { motion } from 'framer-motion';
import { Sparkles, Save, Bold, Italic, List, Heading2, Wand2, Copy, Loader2, PlaySquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateScriptAI, saveScript } from '@/features/scripts/actions';
import { toast } from 'sonner';

export default function ScriptStudio() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [topic, setTopic] = useState('');
  const [videoLength, setVideoLength] = useState('5-10 minutes');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Engaging');
  const [style, setStyle] = useState('Educational');
  const [platform, setPlatform] = useState('YouTube');
  
  const [scriptId, setScriptId] = useState<string | null>(null);
  const [title, setTitle] = useState('Untitled Script');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Your generated script will appear here. Or start typing manually...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] text-lg',
      },
    },
  });

  const handleGenerate = async () => {
    if (!topic) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await generateScriptAI({
        topic,
        videoLength,
        audience: audience || 'General Audience',
        tone,
        style,
        platform
      });

      if (response.success && response.data) {
        setTitle(response.data.seoTitle);
        editor?.commands.setContent(response.data.formattedContent);
        toast.success('Script generated successfully!');
      } else {
        toast.error(response.error || 'Failed to generate script');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!editor) return;
    
    const content = editor.getHTML();
    if (!content || content === '<p></p>') {
      toast.error('Cannot save empty script');
      return;
    }

    setIsSaving(true);
    try {
      const response = await saveScript({
        scriptId: scriptId || undefined,
        title,
        content,
        style,
      });

      if (response.success && response.data) {
        setScriptId(response.data.id);
        toast.success('Draft saved successfully!');
      } else {
        toast.error(response.error || 'Failed to save draft');
      }
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const copyScript = () => {
    if (!editor) return;
    navigator.clipboard.writeText(editor.getText());
    toast.success('Script copied to clipboard!');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col xl:flex-row gap-6">
      {/* Editor Section */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold tracking-tight text-glow bg-transparent border-none outline-none w-full truncate"
              placeholder="Script Title"
            />
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <PlaySquare className="w-4 h-4" /> Script Studio Editor
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              variant="outline" 
              className="gap-2 border-white/10"
              onClick={copyScript}
            >
              <Copy className="w-4 h-4" /> Copy
            </Button>
            <Button 
              className="gap-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
          </div>
        </div>

        <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden border-white/5 shadow-2xl">
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-background/50 backdrop-blur-md">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive('bold') ? 'bg-white/10' : ''}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive('italic') ? 'bg-white/10' : ''}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor?.isActive('heading', { level: 2 }) ? 'bg-white/10' : ''}
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={editor?.isActive('bulletList') ? 'bg-white/10' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Editor Canvas */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-hide bg-gradient-to-b from-transparent to-background/30">
            <EditorContent editor={editor} className="max-w-3xl mx-auto" />
          </div>
        </div>
      </div>

      {/* AI Assistant Generator Sidebar */}
      <div className="w-full xl:w-[400px] flex flex-col gap-4 shrink-0 overflow-y-auto scrollbar-hide">
        <div className="p-5 glass rounded-2xl border-white/5 shadow-lg relative flex flex-col gap-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-2 relative z-10">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="font-bold text-lg">Script Generator</h2>
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            <div className="space-y-2">
              <Label>Topic or Idea</Label>
              <Input 
                placeholder="e.g. How to start a YouTube channel" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={(val) => val && setPlatform(val)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Instagram Reels">Instagram Reels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={videoLength} onValueChange={(val) => val && setVideoLength(val)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under 1 minute">Under 1 min</SelectItem>
                    <SelectItem value="1-3 minutes">1-3 mins</SelectItem>
                    <SelectItem value="5-10 minutes">5-10 mins</SelectItem>
                    <SelectItem value="10-20 minutes">10-20 mins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input 
                placeholder="e.g. Beginners, Tech Enthusiasts" 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={style} onValueChange={(val) => val && setStyle(val)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Documentary">Documentary</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Storytelling">Storytelling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(val) => val && setTone(val)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engaging">Engaging</SelectItem>
                    <SelectItem value="Humorous">Humorous</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Dramatic">Dramatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium shadow-lg shadow-purple-500/20"
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Script
                </>
              )}
            </Button>
          </div>

          <div className="mt-2 relative z-10">
            <div className="p-3 bg-muted/30 rounded-xl text-xs text-muted-foreground border border-dashed border-white/10">
              Generating a script will replace your current editor content. Save your draft first if needed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
