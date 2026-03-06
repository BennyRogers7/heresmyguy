import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getDeleteIds() {
  const businesses = await prisma.business.findMany({
    where: { verticalSlug: 'landscapers' },
    select: { id: true, name: true, city: true, state: true }
  });

  // Keywords for businesses to DELETE (not landscapers, excluding tree services)
  const deleteKeywords = [
    'plumb', 'roof', 'hvac', 'heating', 'cooling', 'air condition', 'electric',
    'carpet', 'floor', 'window', 'garage door', 'pest', 'termite',
    'maid', 'moving', 'storage',
    'pool', 'hot tub',
    'restaurant', 'cafe', 'pizza', 'food', 'grill', 'bakery',
    'salon', 'barber', 'nail', 'beauty', 'hair',
    'auto', 'car wash', 'mechanic', 'body shop', 'towing', 'lube',
    'church', 'school', 'bank', 'insurance', 'attorney', 'dental', 'medical', 'clinic',
    'real estate', 'realty', 'property management',
    'grooming',
    'photograph', 'video', 'wedding', 'event planning',
    'septic', 'sewer',
    'handyman', 'general contract', 'remodel', 'renovation',
    'gutter', 'siding', 'insulation', 'waterproof',
    'bargain outlet', 'rental'
  ];

  // Keywords to KEEP (landscaping-related, including tree services)
  const keepKeywords = [
    'landscape', 'landscaping', 'lawn', 'grass', 'mow', 'garden', 'yard',
    'turf', 'sod', 'irrigation', 'sprinkler', 'mulch', 'plant', 'shrub',
    'outdoor', 'grounds', 'green', 'leaf', 'nursery', 'horticulture',
    'tree', 'stump', 'arborist', 'excavat', 'grading', 'clearing'
  ];

  const toDelete: Array<{id: string, name: string, city: string, state: string, reason: string}> = [];

  for (const b of businesses) {
    const nameLower = b.name.toLowerCase();

    // Check if it has a keep keyword - if so, skip
    const hasKeepKeyword = keepKeywords.some(kk => nameLower.includes(kk));
    if (hasKeepKeyword) continue;

    // Check if name contains delete keywords
    for (const keyword of deleteKeywords) {
      if (nameLower.includes(keyword)) {
        toDelete.push({ id: b.id, name: b.name, city: b.city, state: b.state, reason: keyword });
        break;
      }
    }
  }

  // Also find obvious junk entries
  for (const b of businesses) {
    const nameLower = b.name.toLowerCase();
    if (nameLower.includes('oh shit') || nameLower.includes('retired')) {
      if (!toDelete.find(d => d.id === b.id)) {
        toDelete.push({ id: b.id, name: b.name, city: b.city, state: b.state, reason: 'junk' });
      }
    }
  }

  console.log('=== BUSINESSES TO DELETE ===');
  console.log('Total:', toDelete.length);
  console.log('');

  // Group by reason
  const grouped: Record<string, typeof toDelete> = {};
  for (const item of toDelete) {
    if (!grouped[item.reason]) grouped[item.reason] = [];
    grouped[item.reason].push(item);
  }

  for (const [reason, items] of Object.entries(grouped)) {
    console.log(`--- ${reason} (${items.length}) ---`);
    for (const item of items) {
      console.log(`  ${item.name} | ${item.city}, ${item.state}`);
    }
    console.log('');
  }

  console.log('=== IDs TO DELETE (copy this array) ===');
  console.log(JSON.stringify(toDelete.map(d => d.id)));

  await prisma.$disconnect();
}

getDeleteIds();
