import 'dotenv/config';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { verticals, getVerticalForDay } from './config/verticals.js';
import { pillars, getPillarForPost } from './config/pillars.js';
import { generateWeeklySchedule } from './config/schedule.js';
import { generateScript, formatCaption } from './generators/scriptGen.js';
import { generateAllImages, generatePlaceholderImages } from './generators/imageGen.js';
import { applyAllOverlays } from './generators/overlayGen.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const OUTPUT_DIR = join(__dirname, 'output');
const CALENDAR_PATH = join(__dirname, 'data', 'calendar.json');
const USE_REAL_IMAGES = process.env.OPENAI_API_KEY && process.env.USE_REAL_IMAGES !== 'false';

/**
 * Load calendar data
 */
function loadCalendar() {
  if (existsSync(CALENDAR_PATH)) {
    return JSON.parse(readFileSync(CALENDAR_PATH, 'utf-8'));
  }
  return { generated: [], usedHooks: [], lastRun: null };
}

/**
 * Save calendar data
 */
function saveCalendar(calendar) {
  writeFileSync(CALENDAR_PATH, JSON.stringify(calendar, null, 2));
}

/**
 * Generate a single post
 */
async function generatePost(postNumber, vertical, pillar, outputDir, usedHooks) {
  const postDir = join(outputDir, `post_${String(postNumber + 1).padStart(2, '0')}_${vertical.id}_${pillar.id}`);
  mkdirSync(postDir, { recursive: true });

  console.log(`\n📝 Generating post ${postNumber + 1}: ${vertical.name} - ${pillar.name}`);

  // Step 1: Generate script
  console.log('  Step 1: Generating script with Claude...');
  const script = await generateScript(vertical, pillar, usedHooks);
  console.log(`  ✓ Script generated. Hook: "${script.hook}"`);

  // Save script JSON
  writeFileSync(join(postDir, 'script.json'), JSON.stringify(script, null, 2));

  // Step 2: Generate images
  console.log('  Step 2: Generating images...');
  let imageResults;

  if (USE_REAL_IMAGES) {
    console.log('  (Using OpenAI gpt-image-1 for real images)');
    imageResults = await generateAllImages(script.slides, vertical, postDir);
  } else {
    console.log('  (Using placeholders - set OPENAI_API_KEY and USE_REAL_IMAGES=true for real images)');
    imageResults = await generatePlaceholderImages(script.slides, vertical, postDir);
  }
  console.log(`  ✓ ${imageResults.length} images generated`);

  // Step 3: Apply text overlays
  console.log('  Step 3: Applying text overlays...');
  const overlayResults = await applyAllOverlays(script.slides, postDir, postDir);
  const successfulOverlays = overlayResults.filter(r => r.success).length;
  console.log(`  ✓ ${successfulOverlays}/6 overlays applied`);

  // Step 4: Save caption
  const caption = formatCaption(script);
  writeFileSync(join(postDir, 'caption.txt'), caption);
  console.log('  ✓ Caption saved');

  // Create a summary file
  const summary = {
    postNumber: postNumber + 1,
    vertical: vertical.name,
    pillar: pillar.name,
    hook: script.hook,
    slides: script.slides.map(s => s.text.split('\n')[0]), // First line of each slide
    generatedAt: new Date().toISOString()
  };
  writeFileSync(join(postDir, 'summary.json'), JSON.stringify(summary, null, 2));

  return {
    postNumber: postNumber + 1,
    directory: postDir,
    hook: script.hook,
    vertical: vertical.id,
    pillar: pillar.id,
    success: true
  };
}

/**
 * Generate a week of content
 */
async function generateWeek() {
  console.log('🚀 WebSimple Content Engine');
  console.log('============================');
  console.log(`Generating a week of TikTok content...\n`);

  // Check for API keys
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY is required');
    console.log('   Set it in your .env file');
    process.exit(1);
  }

  // Create output directory
  const weekDir = join(OUTPUT_DIR, `week_${new Date().toISOString().split('T')[0]}`);
  mkdirSync(weekDir, { recursive: true });
  console.log(`📁 Output directory: ${weekDir}\n`);

  // Load calendar for used hooks
  const calendar = loadCalendar();
  const usedHooks = calendar.usedHooks || [];

  // Generate weekly schedule
  const schedule = generateWeeklySchedule();
  console.log(`📅 Scheduled ${schedule.length} posts for this week\n`);

  // Generate each post
  const results = [];
  for (let i = 0; i < schedule.length; i++) {
    const slot = schedule[i];

    // Get vertical (rotate through them)
    const verticalIndex = i % verticals.length;
    const vertical = verticals[verticalIndex];

    // Get pillar (rotate through them)
    const pillar = getPillarForPost(i);

    try {
      const result = await generatePost(i, vertical, pillar, weekDir, usedHooks);
      results.push(result);

      // Track used hook
      usedHooks.push(result.hook);
    } catch (error) {
      console.error(`  ❌ Failed to generate post ${i + 1}:`, error.message);
      results.push({
        postNumber: i + 1,
        success: false,
        error: error.message
      });
    }
  }

  // Update calendar
  calendar.generated.push({
    weekOf: new Date().toISOString().split('T')[0],
    directory: weekDir,
    posts: results
  });
  calendar.usedHooks = usedHooks.slice(-50); // Keep last 50 hooks
  calendar.lastRun = new Date().toISOString();
  saveCalendar(calendar);

  // Summary
  const successful = results.filter(r => r.success).length;
  console.log('\n============================');
  console.log('✅ Generation Complete!');
  console.log(`   ${successful}/${schedule.length} posts generated`);
  console.log(`   Output: ${weekDir}`);
  console.log('\nPost breakdown:');
  results.forEach(r => {
    if (r.success) {
      console.log(`   ✓ Post ${r.postNumber}: ${r.vertical} - ${r.pillar}`);
    } else {
      console.log(`   ✗ Post ${r.postNumber}: FAILED - ${r.error}`);
    }
  });
}

/**
 * Generate a single test post
 */
async function generateSinglePost(verticalId, pillarId) {
  console.log('🧪 Generating single test post...\n');

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY is required');
    process.exit(1);
  }

  const vertical = verticals.find(v => v.id === verticalId) || verticals[0];
  const pillar = pillars.find(p => p.id === pillarId) || pillars[0];

  const testDir = join(OUTPUT_DIR, 'test');
  mkdirSync(testDir, { recursive: true });

  try {
    await generatePost(0, vertical, pillar, testDir, []);
    console.log(`\n✅ Test post generated in: ${testDir}/post_01_${vertical.id}_${pillar.id}`);
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

// CLI handling
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
WebSimple Content Engine

Usage:
  node run.js              Generate a full week of content (10 posts)
  node run.js --test       Generate a single test post
  node run.js --test [vertical] [pillar]
                           Generate test post with specific vertical/pillar

Verticals: roofers, plumbers, electricians, hvac, landscapers, painters
Pillars: lost-jobs, contractor-tip, ai-demo, before-after

Environment variables:
  ANTHROPIC_API_KEY       Required for script generation
  OPENAI_API_KEY          Required for real image generation
  USE_REAL_IMAGES         Set to 'true' to use OpenAI images (default: false)

Examples:
  node run.js --test roofers lost-jobs
  node run.js --test plumbers ai-demo
  `);
  process.exit(0);
}

if (args.includes('--test')) {
  const verticalId = args[args.indexOf('--test') + 1] || 'roofers';
  const pillarId = args[args.indexOf('--test') + 2] || 'lost-jobs';
  generateSinglePost(verticalId, pillarId);
} else {
  generateWeek();
}
