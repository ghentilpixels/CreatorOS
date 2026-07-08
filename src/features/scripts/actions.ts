"use server";

import { revalidatePath } from "next/cache";
import { ScriptAgent, ScriptAgentInput } from "@/lib/ai/agents/ScriptAgent";
import { prisma } from "@/lib/prisma";

export async function generateScriptAI(input: ScriptAgentInput) {
  try {
    const agent = new ScriptAgent();
    const scriptData = await agent.run(input);
    
    // Format the structured output into a Markdown string for the editor
    let content = `<h1>${scriptData.seoTitle}</h1>\n\n`;
    
    content += `<h2>Hook</h2>\n<p>${scriptData.hook}</p>\n\n`;
    content += `<h2>Introduction</h2>\n<p>${scriptData.introduction}</p>\n\n`;
    
    scriptData.mainSections.forEach((section) => {
      content += `<h2>${section.title}</h2>\n<p>${section.content}</p>\n\n`;
    });
    
    if (scriptData.examples && scriptData.examples.length > 0) {
      content += `<h2>Examples & Case Studies</h2>\n<ul>\n`;
      scriptData.examples.forEach(ex => {
        content += `<li>${ex}</li>\n`;
      });
      content += `</ul>\n\n`;
    }
    
    content += `<h2>Conclusion</h2>\n<p>${scriptData.conclusion}</p>\n\n`;
    content += `<h2>Call to Action</h2>\n<p>${scriptData.callToAction}</p>\n\n`;
    
    if (scriptData.bRollSuggestions && scriptData.bRollSuggestions.length > 0) {
      content += `<h2>B-Roll Suggestions</h2>\n<ul>\n`;
      scriptData.bRollSuggestions.forEach(broll => {
        content += `<li>${broll}</li>\n`;
      });
      content += `</ul>\n\n`;
    }
    
    if (scriptData.editingNotes) {
      content += `<h2>Editing Notes</h2>\n<p>${scriptData.editingNotes}</p>\n\n`;
    }

    return { success: true, data: { ...scriptData, formattedContent: content } };
  } catch (error) {
    console.error("Failed to generate script:", error);
    return { success: false, error: "Failed to generate script" };
  }
}

export async function saveScript(data: { title: string; hook?: string; content: string; style?: string; projectId?: string; scriptId?: string }) {
  try {
    let script;
    
    if (data.scriptId) {
      // Update existing
      script = await prisma.script.update({
        where: { id: data.scriptId },
        data: {
          title: data.title,
          hook: data.hook,
          content: data.content,
          style: data.style,
          projectId: data.projectId,
        }
      });
    } else {
      // Create new
      script = await prisma.script.create({
        data: {
          title: data.title,
          hook: data.hook || null,
          content: data.content,
          style: data.style || null,
          projectId: data.projectId || null,
          status: "draft"
        }
      });
    }

    revalidatePath("/script-studio");
    return { success: true, data: script };
  } catch (error) {
    console.error("Failed to save script:", error);
    return { success: false, error: "Failed to save script" };
  }
}

export async function getScripts() {
  try {
    const scripts = await prisma.script.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: scripts };
  } catch (error) {
    console.error("Failed to fetch scripts:", error);
    return { success: false, error: "Failed to fetch scripts" };
  }
}
