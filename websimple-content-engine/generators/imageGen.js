import OpenAI from 'openai';
import { writeFileSync } from 'fs';
import { join } from 'path';

const openai = new OpenAI();

/**
 * Enhance image prompt for better results
 */
function enhancePrompt(basePrompt, vertical, slideNumber) {
  const styleGuide = `
Professional photography style, clean composition, warm lighting.
9:16 vertical aspect ratio suitable for TikTok.
No text, logos, or watermarks in the image.
Modern, high-quality, slightly dramatic lighting.
Colors should be warm and inviting.
The image should work as a background for text overlay.
`.trim();

  const contextPrefix = slideNumber === 1
    ? 'Eye-catching, attention-grabbing scene. '
    : slideNumber === 6
    ? 'Inviting, professional, call-to-action feel. '
    : '';

  return `${contextPrefix}${basePrompt}\n\n${styleGuide}`;
}

/**
 * Generate a single image using OpenAI gpt-image-1
 */
export async function generateImage(imagePrompt, vertical, slideNumber, outputPath) {
  const enhancedPrompt = enhancePrompt(imagePrompt, vertical, slideNumber);

  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1536', // Vertical format for TikTok (close to 9:16)
      quality: 'high'
    });

    // Get base64 image data
    const imageData = response.data[0].b64_json;

    if (!imageData) {
      throw new Error('No image data returned from API');
    }

    // Convert base64 to buffer and save
    const buffer = Buffer.from(imageData, 'base64');
    writeFileSync(outputPath, buffer);

    return {
      success: true,
      path: outputPath,
      prompt: enhancedPrompt
    };
  } catch (error) {
    console.error(`Failed to generate image for slide ${slideNumber}:`, error.message);
    throw error;
  }
}

/**
 * Generate all images for a post (6 slides)
 */
export async function generateAllImages(slides, vertical, outputDir) {
  const results = [];

  for (const slide of slides) {
    const outputPath = join(outputDir, `slide_${slide.slideNumber}_raw.png`);

    console.log(`  Generating image for slide ${slide.slideNumber}...`);

    const result = await generateImage(
      slide.imagePrompt,
      vertical,
      slide.slideNumber,
      outputPath
    );

    results.push({
      slideNumber: slide.slideNumber,
      ...result
    });

    // Small delay between API calls to be respectful
    if (slide.slideNumber < 6) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}

/**
 * Generate placeholder images for testing (without API calls)
 */
export async function generatePlaceholderImages(slides, vertical, outputDir) {
  const sharp = (await import('sharp')).default;
  const results = [];

  for (const slide of slides) {
    const outputPath = join(outputDir, `slide_${slide.slideNumber}_raw.png`);

    // Create a simple gradient placeholder
    const colors = vertical.colors || ['#4A90A4', '#2C5F6E', '#1A3D47'];
    const primaryColor = colors[0];

    // Create a simple colored placeholder with Sharp
    const svg = `
      <svg width="1024" height="1536" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
            <stop offset="50%" style="stop-color:${colors[1] || colors[0]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors[2] || colors[0]};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="512" y="700" font-family="Arial" font-size="48" fill="white" text-anchor="middle" opacity="0.3">
          ${vertical.name}
        </text>
        <text x="512" y="780" font-family="Arial" font-size="32" fill="white" text-anchor="middle" opacity="0.3">
          Slide ${slide.slideNumber}
        </text>
        <text x="512" y="860" font-family="Arial" font-size="24" fill="white" text-anchor="middle" opacity="0.2">
          [Placeholder - Enable API for real images]
        </text>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    results.push({
      slideNumber: slide.slideNumber,
      success: true,
      path: outputPath,
      placeholder: true
    });
  }

  return results;
}

export default { generateImage, generateAllImages, generatePlaceholderImages };
