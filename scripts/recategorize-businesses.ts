import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function recategorize() {
  // 1. Create new verticals
  console.log('=== Creating new verticals ===');

  const newVerticals = [
    { slug: 'pool-contractors', name: 'Pool Contractors', nameSingular: 'Pool Contractor', description: 'Pool installation, maintenance & repair', icon: '🏊' },
    { slug: 'general-contractors', name: 'General Contractors', nameSingular: 'General Contractor', description: 'Home remodeling & renovation', icon: '🔨' },
    { slug: 'pest-control', name: 'Pest Control', nameSingular: 'Pest Control', description: 'Pest & termite control services', icon: '🐜' },
  ];

  for (const v of newVerticals) {
    await prisma.vertical.upsert({
      where: { slug: v.slug },
      update: {},
      create: v,
    });
    console.log(`  Created/verified: ${v.name}`);
  }

  // 2. Define moves
  const moves: Record<string, string[]> = {
    // Move to roofers
    'roofers': [
      'cmme046ak00yldla0covy8e2k', // Shoemaker Roofing
      'cmme050fx018vdla0yscff7q8', // Hart Masonry and Waterproofing
      'cmme05p9r01gpdla02s5m9tzl', // Irish Roofing Co.
      'cmme06ruk01uddla0kf18yoiv', // Martin Exteriors Roofing & Siding
      'cmme07uvp026ndla0uqru3n2h', // Shelter From the Storm Roofing
      'cmme084cy029fdla0linxetrt', // Local Roofing Solutions
      'cmme0856m029ndla0jr4rufk2', // Sawvell Roofing & Siding
      'cmme08jv102ebdla0qb54z5xa', // Area Waterproofing LLC
      'cmme09ass02pfdla0bfpwkcp1', // Chango's roofing services
      'cmme09c7t02pxdla0o11y9g8o', // Baine Roofing Co
      'cmme09eou02qzdla0pu0z95nh', // Helitech Waterproofing & Foundation Repair
      'cmme0a28x02z5dla07s1yee68', // New Heights Roofing
      'cmme0b6l303bzdla0kb99sc2e', // Wes Knox and Sons Roofing
      'cmme0cslc03x3dla07860q803', // Andes Roofing
    ],
    // Move to electricians
    'electricians': [
      'cmme0243a0095dla06l310kw6', // Harrod Nagel Electric
      'cmme071df01xddla03q3cfpje', // Lueder Electric LLC
      'cmme0b8st03cxdla0ey5b5xes', // Felger Electric
    ],
    // Move to plumbers
    'plumbers': [
      'cmme09hjd02rxdla0bggkf9e9', // Baker & Sons Plumbing
      'cmme0501r018pdla0jonl09l9', // Supeck Septic Services
    ],
    // Move to pool-contractors
    'pool-contractors': [
      'cmme03kvs00rxdla0lf62cn6g', // The Pool People
      'cmme06v8i01v9dla0glqiscck', // Krueger Swim Pool
      'cmme084yf029ldla01ra6qjif', // Brinkmann Fiberglass Pools
      'cmme09b7902pndla069563k3l', // Pool Co
      'cmme09hup02rzdla0suxrjpsh', // Aloha Pools & Spas
    ],
    // Move to general-contractors
    'general-contractors': [
      'cmme02du200cjdla04q3q429e', // Brison Swank Remodeling
      'cmme04uov0171dla07mogq53i', // Impact Home Remodeling
      'cmme052s9019hdla0vjhgeo4l', // Medina Exteriors & Remodeling
      'cmme06nug01t3dla0yqtftq1k', // Home HAB Renovations
      'cmme06t3a01urdla0hjz7w13n', // Apex General Contracting
    ],
    // Move to pest-control
    'pest-control': [
      'cmme0co9103vfdla0dps4qf9b', // Hammond And Lemmons Termite And Pest Control
    ],
  };

  // 3. Execute moves
  console.log('\n=== Moving businesses to correct verticals ===');
  for (const [vertical, ids] of Object.entries(moves)) {
    const result = await prisma.business.updateMany({
      where: { id: { in: ids } },
      data: { verticalSlug: vertical },
    });
    console.log(`  Moved ${result.count} to ${vertical}`);
  }

  // 4. Delete non-contractors
  console.log('\n=== Deleting non-contractor businesses ===');
  const deleteIds = [
    // Rentals (9)
    'cmme03mzd00sddla0xkflojlx', // Taylor True Value Rental
    'cmme05c5201cldla0mvcm4z31', // Grand Rental Station
    'cmme09ezt02r1dla07row01dz', // Home Rentals Corporation
    'cmme0aa8w032hdla08td2luv6', // Webber Rental & Supply
    'cmme0au7q038ddla0u6hxa128', // Pinch Point Rental
    'cmme0ccga03r1dla0fkolxrnt', // MacAllister Rentals
    'cmme0cf6s03sbdla0keog43hc', // American Rental Home Furnishings (Greensburg)
    'cmme0couv03vjdla0q5yi6d7n', // Grand Rental Station (Scottsburg)
    'cmme0crgu03wndla0uzppop3a', // American Rental Home Furnishings (Scottsburg)
    // Photography (2)
    'cmme0251p009fdla0m8w0po4c', // Lange Photographics
    'cmme08ag102b9dla0ttb962ak', // Sarah Trybula-ST-Photography
    // Property Management (2)
    'cmme04v330177dla0qorcogw9', // Drews property management LLC
    'cmme0brzc03jvdla04fzs0o1g', // Ervin Property Management
    // Towing (1)
    'cmme0abfn032vdla0vf3ozgcp', // A To Z Towing & Transportation
    // Auto (1)
    'cmme074n601yjdla0o2waxmx0', // L B Automotive/Fort Quick Lube
    // Storage (1)
    'cmme0bt4r03kbdla0lczgthb5', // Tims Storage Buildings
    // Real Estate (1)
    'cmme0avjg038ndla03ju9uuar', // Lundquist Appraisals & Real Estate
    // Bargain Outlet (1)
    'cmme0aptm037ddla036007cll', // Ollie's Bargain Outlet
    // Junk entries (2)
    'cmme091cz02lddla0vwxouxfj', // oh shit, he retired
    'cmme0b42603bbdla0oj6w0z31', // Rest Relief Retired
  ];

  const deleteResult = await prisma.business.deleteMany({
    where: { id: { in: deleteIds } },
  });
  console.log(`  Deleted ${deleteResult.count} non-contractor businesses`);

  // Keep "Patten Earthmoving" in landscapers (it's excavation/earthmoving related)

  // 5. Summary
  console.log('\n=== Summary ===');
  const verticals = await prisma.vertical.findMany({
    include: { _count: { select: { businesses: true } } },
    orderBy: { name: 'asc' },
  });
  for (const v of verticals) {
    console.log(`  ${v.name}: ${v._count.businesses} businesses`);
  }

  await prisma.$disconnect();
  console.log('\nDone!');
}

recategorize();
