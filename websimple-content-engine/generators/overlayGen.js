import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Text overlay configuration
const config = {
  width: 1024,
  height: 1536,
  padding: 60,
  textColor: '#FFFFFF',
  shadowColor: 'rgba(0,0,0,0.8)',
  fontSize: {
    hook: 72,      // Slide 1 - bigger for impact
    body: 56,      // Slides 2-5
    cta: 64        // Slide 6 - CTA
  },
  lineHeight: 1.3,
  maxWidth: 900   // Max text width
};

/**
 * Escape special XML characters for SVG
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Wrap text to fit within max width (approximate)
 */
function wrapText(text, fontSize, maxWidth) {
  const avgCharWidth = fontSize * 0.5; // Rough approximation
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);

  const lines = [];
  const inputLines = text.split('\n');

  for (const inputLine of inputLines) {
    if (inputLine.length <= maxCharsPerLine) {
      lines.push(inputLine);
    } else {
      // Word wrap
      const words = inputLine.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length <= maxCharsPerLine) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Generate SVG text overlay
 */
function createTextOverlaySvg(text, slideNumber) {
  // Determine font size based on slide number
  let fontSize;
  if (slideNumber === 1) {
    fontSize = config.fontSize.hook;
  } else if (slideNumber === 6) {
    fontSize = config.fontSize.cta;
  } else {
    fontSize = config.fontSize.body;
  }

  // Wrap text
  const lines = wrapText(text, fontSize, config.maxWidth);
  const lineHeight = fontSize * config.lineHeight;

  // Calculate vertical position (center the text block)
  const totalTextHeight = lines.length * lineHeight;
  const startY = (config.height - totalTextHeight) / 2 + fontSize;

  // Build SVG text elements with shadow
  let textElements = '';

  lines.forEach((line, index) => {
    const y = startY + (index * lineHeight);
    const escapedLine = escapeXml(line);

    // Shadow (multiple layers for better effect)
    textElements += `
      <text x="50%" y="${y + 3}" text-anchor="middle"
            font-family="Arial Black, Arial, sans-serif" font-size="${fontSize}"
            font-weight="900" fill="${config.shadowColor}">${escapedLine}</text>
      <text x="50%" y="${y + 2}" text-anchor="middle"
            font-family="Arial Black, Arial, sans-serif" font-size="${fontSize}"
            font-weight="900" fill="${config.shadowColor}">${escapedLine}</text>
    `;

    // Main text
    textElements += `
      <text x="50%" y="${y}" text-anchor="middle"
            font-family="Arial Black, Arial, sans-serif" font-size="${fontSize}"
            font-weight="900" fill="${config.textColor}">${escapedLine}</text>
    `;
  });

  // Add WebSimple watermark on slide 5
  if (slideNumber === 5) {
    textElements += `
      <text x="50%" y="${config.height - 80}" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="32"
            font-weight="bold" fill="rgba(255,255,255,0.9)">WebSimple AI</text>
      <text x="50%" y="${config.height - 45}" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="22"
            fill="rgba(255,255,255,0.7)">websimple.ai</text>
    `;
  }

  // Add slide number indicator (small, bottom right)
  textElements += `
    <text x="${config.width - 40}" y="${config.height - 30}" text-anchor="end"
          font-family="Arial, sans-serif" font-size="24"
          fill="rgba(255,255,255,0.5)">${slideNumber}/6</text>
  `;

  return `
    <svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">
      ${textElements}
    </svg>
  `;
}

/**
 * Apply text overlay to a single image
 */
export async function applyOverlay(inputPath, outputPath, text, slideNumber) {
  // Create SVG overlay
  const overlaySvg = createTextOverlaySvg(text, slideNumber);
  const overlayBuffer = Buffer.from(overlaySvg);

  // Check if input exists
  if (!existsSync(inputPath)) {
    throw new Error(`Input image not found: ${inputPath}`);
  }

  // Composite the overlay onto the image
  await sharp(inputPath)
    .composite([
      {
        input: overlayBuffer,
        top: 0,
        left: 0
      }
    ])
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  return {
    success: true,
    inputPath,
    outputPath,
    slideNumber
  };
}

/**
 * Apply overlays to all slides
 */
export async function applyAllOverlays(slides, inputDir, outputDir) {
  const results = [];

  for (const slide of slides) {
    const inputPath = join(inputDir, `slide_${slide.slideNumber}_raw.png`);
    const outputPath = join(outputDir, `slide_${slide.slideNumber}.jpg`);

    console.log(`  Applying overlay to slide ${slide.slideNumber}...`);

    try {
      const result = await applyOverlay(
        inputPath,
        outputPath,
        slide.text,
        slide.slideNumber
      );
      results.push(result);
    } catch (error) {
      console.error(`  Failed to apply overlay to slide ${slide.slideNumber}:`, error.message);
      results.push({
        success: false,
        slideNumber: slide.slideNumber,
        error: error.message
      });
    }
  }

  return results;
}

/**
 * Create a simple test image with overlay (for testing without API)
 */
export async function createTestSlide(text, slideNumber, outputPath, backgroundColor = '#2C5F6E') {
  // Create base image
  const svg = `
    <svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
    </svg>
  `;

  const baseImage = await sharp(Buffer.from(svg)).png().toBuffer();

  // Create overlay
  const overlaySvg = createTextOverlaySvg(text, slideNumber);
  const overlayBuffer = Buffer.from(overlaySvg);

  // Composite
  await sharp(baseImage)
    .composite([{ input: overlayBuffer, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  return { success: true, outputPath };
}

export default { applyOverlay, applyAllOverlays, createTestSlide };
