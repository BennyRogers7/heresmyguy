// Content pillars for TikTok posts
export const pillars = [
  {
    id: 'lost-jobs',
    name: 'Lost Jobs Hook',
    description: "You're losing jobs without this",
    tone: 'urgent, eye-opening',
    slideStructure: {
      slide1: 'Hook about losing money/jobs',
      slide2: 'The hidden problem (no website, bad online presence)',
      slide3: 'What customers actually do (search online, check reviews)',
      slide4: 'The cost of being invisible online',
      slide5: 'The fix: WebSimple AI builds your site in minutes',
      slide6: 'CTA: Follow for contractor marketing tips'
    },
    promptFocus: 'Focus on the pain of losing jobs to competitors who have websites. Make it personal and relatable.'
  },
  {
    id: 'contractor-tip',
    name: 'Contractor Tip',
    description: 'Marketing or web tip for contractors',
    tone: 'helpful, practical, insider knowledge',
    slideStructure: {
      slide1: 'Hook with a surprising tip or stat',
      slide2: 'Why this matters for contractors',
      slide3: 'The simple thing most contractors miss',
      slide4: 'How to actually do it',
      slide5: 'How WebSimple AI makes it easy',
      slide6: 'CTA: Follow for contractor marketing tips'
    },
    promptFocus: 'Share practical, actionable advice that contractors can use. Position the tip as insider knowledge.'
  },
  {
    id: 'ai-demo',
    name: 'AI Demo',
    description: 'Watch AI build a contractor site',
    tone: 'exciting, futuristic, simple',
    slideStructure: {
      slide1: 'Hook about AI building websites',
      slide2: 'The old way (expensive, slow, complicated)',
      slide3: 'The new way (AI does it in minutes)',
      slide4: 'What you get (professional site, mobile-ready)',
      slide5: 'WebSimple AI in action',
      slide6: 'CTA: Follow for contractor marketing tips'
    },
    promptFocus: 'Make AI feel accessible and not scary. Focus on the magic of getting a professional site without the hassle.'
  },
  {
    id: 'before-after',
    name: 'Before/After',
    description: 'No website → professional site transformation',
    tone: 'transformation, success story',
    slideStructure: {
      slide1: 'Hook about transformation',
      slide2: 'Before: No website, losing jobs, invisible online',
      slide3: 'The turning point (decided to get a website)',
      slide4: 'After: Professional site, more calls, more jobs',
      slide5: 'How WebSimple AI made it happen',
      slide6: 'CTA: Follow for contractor marketing tips'
    },
    promptFocus: 'Tell a transformation story. Make the before painful and the after aspirational.'
  }
];

// Get pillar by ID
export function getPillarById(id) {
  return pillars.find(p => p.id === id);
}

// Get random pillar
export function getRandomPillar() {
  return pillars[Math.floor(Math.random() * pillars.length)];
}

// Rotate pillars based on post number
export function getPillarForPost(postNumber) {
  const index = postNumber % pillars.length;
  return pillars[index];
}

export default pillars;
