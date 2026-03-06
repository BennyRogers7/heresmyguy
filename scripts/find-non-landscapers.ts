import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findSuspicious() {
  const businesses = await prisma.business.findMany({
    where: { verticalSlug: 'landscapers' },
    select: { id: true, name: true, city: true, state: true, hasWebsite: true, rating: true }
  });

  // Keywords that suggest NOT a landscaper
  const nonLandscaperKeywords = [
    'plumb', 'roof', 'hvac', 'heating', 'cooling', 'air condition', 'electric',
    'paint', 'carpet', 'floor', 'window', 'door', 'garage', 'pest', 'termite',
    'cleaning', 'maid', 'junk', 'hauling', 'moving', 'storage',
    'pool', 'spa', 'hot tub',
    'tree service', 'tree removal', 'stump', 'arborist', 'tree care',
    'restaurant', 'cafe', 'pizza', 'food', 'bar', 'grill', 'bakery',
    'salon', 'barber', 'nail', 'beauty', 'hair',
    'auto', 'car wash', 'tire', 'mechanic', 'body shop', 'towing',
    'church', 'school', 'bank', 'insurance', 'attorney', 'dental', 'medical', 'clinic',
    'real estate', 'realty', 'property management', 'rental',
    'pet', 'dog', 'cat', 'vet', 'animal', 'grooming',
    'photo', 'video', 'wedding', 'event planning',
    'snow plow', 'snow removal', 'excavat', 'demolition',
    'septic', 'sewer', 'drain',
    'handyman', 'general contract', 'remodel', 'renovation', 'construction',
    'gutter', 'siding', 'insulation'
  ];

  // Keywords that ARE landscaping-related (to avoid false positives)
  const landscaperKeywords = [
    'landscape', 'landscaping', 'lawn', 'grass', 'mow', 'garden', 'yard',
    'turf', 'sod', 'irrigation', 'sprinkler', 'mulch', 'plant', 'shrub',
    'outdoor', 'grounds', 'green', 'leaf', 'nursery', 'horticulture'
  ];

  const suspicious: Array<{id: string, name: string, city: string, state: string, reason: string}> = [];

  for (const b of businesses) {
    const nameLower = b.name.toLowerCase();

    // Check if name contains non-landscaper keywords
    for (const keyword of nonLandscaperKeywords) {
      if (nameLower.includes(keyword)) {
        // But skip if it also has landscaper keywords
        const hasLandscaperKeyword = landscaperKeywords.some(lk => nameLower.includes(lk));
        if (!hasLandscaperKeyword) {
          suspicious.push({ id: b.id, name: b.name, city: b.city, state: b.state, reason: keyword });
          break;
        }
      }
    }
  }

  // Sort by reason for easier review
  suspicious.sort((a, b) => a.reason.localeCompare(b.reason));

  console.log('=== POTENTIALLY NON-LANDSCAPER BUSINESSES ===');
  console.log('Total found:', suspicious.length);
  console.log('');

  // Group by reason
  const grouped: Record<string, typeof suspicious> = {};
  for (const s of suspicious) {
    if (!grouped[s.reason]) grouped[s.reason] = [];
    grouped[s.reason].push(s);
  }

  for (const [reason, items] of Object.entries(grouped)) {
    console.log(`--- Keyword: "${reason}" (${items.length}) ---`);
    for (const item of items) {
      console.log(`  ${item.name} | ${item.city}, ${item.state} | ID: ${item.id}`);
    }
    console.log('');
  }

  await prisma.$disconnect();
}

findSuspicious();
