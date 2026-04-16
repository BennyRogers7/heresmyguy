import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const anthropic = new Anthropic();

// Load hooks data
const hooksPath = join(__dirname, '..', 'data', 'hooks.json');
const hooks = JSON.parse(readFileSync(hooksPath, 'utf-8'));

/**
 * Get a hook for the given pillar and vertical
 */
function selectHook(pillarId, verticalId, usedHooks = []) {
  const pillarHooks = hooks[pillarId];
  if (!pillarHooks) return null;

  // Try vertical-specific hooks first
  let availableHooks = pillarHooks[verticalId] || [];

  // Add general hooks
  availableHooks = [...availableHooks, ...(pillarHooks.general || [])];

  // Filter out used hooks
  availableHooks = availableHooks.filter(h => !usedHooks.includes(h));

  // If all hooks used, reset and use all
  if (availableHooks.length === 0) {
    availableHooks = [...(pillarHooks[verticalId] || []), ...(pillarHooks.general || [])];
  }

  // Pick random hook
  return availableHooks[Math.floor(Math.random() * availableHooks.length)];
}

/**
 * Generate slide scripts using Claude
 */
export async function generateScript(vertical, pillar, usedHooks = []) {
  const hook = selectHook(pillar.id, vertical.id, usedHooks);

  const systemPrompt = `You are a content writer for WebSimple AI, creating TikTok slideshow scripts for contractors.

BRAND VOICE:
- First-person contractor perspective: "I had a problem, I fixed it, I'm happy"
- Relatable, NOT techy - speak like a real contractor talks
- WebSimple AI is the tool, but the CONTRACTOR is the hero
- Conversational, punchy, easy to read on a phone screen
- No jargon, no corporate speak

OUTPUT FORMAT:
You must respond with valid JSON only. No markdown, no explanation. Just the JSON object.

The JSON structure must be:
{
  "slides": [
    {"slideNumber": 1, "text": "...", "imagePrompt": "..."},
    {"slideNumber": 2, "text": "...", "imagePrompt": "..."},
    {"slideNumber": 3, "text": "...", "imagePrompt": "..."},
    {"slideNumber": 4, "text": "...", "imagePrompt": "..."},
    {"slideNumber": 5, "text": "...", "imagePrompt": "..."},
    {"slideNumber": 6, "text": "...", "imagePrompt": "..."}
  ],
  "caption": "...",
  "hashtags": ["...", "..."]
}

SLIDE TEXT RULES:
- Each slide: 2-3 short lines max (it overlays on an image)
- Use line breaks between phrases
- Punchy, scannable, emotional
- Slide 1 is the HOOK - must stop the scroll
- Slide 6 is always the CTA

IMAGE PROMPT RULES:
- Describe a simple, clean image that works as a background
- Include the contractor type (${vertical.name})
- Use warm, professional lighting
- No text in the image (text gets overlaid)
- Style: professional photography, slightly dramatic lighting`;

  const userPrompt = `Create a 6-slide TikTok script for a ${vertical.name}.

CONTENT PILLAR: ${pillar.name}
PILLAR DESCRIPTION: ${pillar.description}
PILLAR TONE: ${pillar.tone}

SLIDE STRUCTURE:
- Slide 1: ${pillar.slideStructure.slide1}
- Slide 2: ${pillar.slideStructure.slide2}
- Slide 3: ${pillar.slideStructure.slide3}
- Slide 4: ${pillar.slideStructure.slide4}
- Slide 5: ${pillar.slideStructure.slide5}
- Slide 6: ${pillar.slideStructure.slide6}

USE THIS HOOK FOR SLIDE 1: "${hook}"

VERTICAL DETAILS:
- Services: ${vertical.services.join(', ')}
- Pain points: ${vertical.painPoints.join(', ')}

${pillar.promptFocus}

Generate the JSON now:`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ],
    system: systemPrompt
  });

  // Extract text content
  const textContent = response.content.find(c => c.type === 'text');
  if (!textContent) {
    throw new Error('No text content in response');
  }

  // Parse JSON response
  let scriptData;
  try {
    // Try to extract JSON from the response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      scriptData = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  } catch (parseError) {
    console.error('Failed to parse script response:', textContent.text);
    throw new Error(`Failed to parse script JSON: ${parseError.message}`);
  }

  return {
    ...scriptData,
    hook,
    vertical: vertical.id,
    pillar: pillar.id,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generate caption with hashtags
 */
export function formatCaption(scriptData) {
  const { caption, hashtags } = scriptData;
  const formattedHashtags = hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ');
  return `${caption}\n\n${formattedHashtags}`;
}

export default { generateScript, formatCaption, selectHook };
