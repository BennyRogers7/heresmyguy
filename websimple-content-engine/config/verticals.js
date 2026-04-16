// Contractor verticals - rotate daily
export const verticals = [
  {
    id: 'roofers',
    name: 'Roofer',
    plural: 'Roofers',
    services: ['roof repair', 'roof replacement', 'roof inspection', 'gutter installation'],
    painPoints: ['storm damage leads', 'seasonal slowdowns', 'competing with big companies'],
    visualElements: ['shingles', 'ladders', 'rooftops', 'tools', 'safety gear'],
    colors: ['#8B4513', '#CD853F', '#2F4F4F'] // Brown, tan, dark slate
  },
  {
    id: 'plumbers',
    name: 'Plumber',
    plural: 'Plumbers',
    services: ['pipe repair', 'drain cleaning', 'water heater installation', 'emergency plumbing'],
    painPoints: ['emergency calls at bad times', 'price shoppers', 'getting found online'],
    visualElements: ['pipes', 'wrenches', 'sinks', 'water heaters', 'tools'],
    colors: ['#4169E1', '#1E90FF', '#708090'] // Royal blue, dodger blue, slate gray
  },
  {
    id: 'electricians',
    name: 'Electrician',
    plural: 'Electricians',
    services: ['electrical repair', 'panel upgrades', 'lighting installation', 'wiring'],
    painPoints: ['explaining complex work to customers', 'competing on price', 'showing expertise'],
    visualElements: ['wires', 'outlets', 'panels', 'tools', 'safety equipment'],
    colors: ['#FFD700', '#FFA500', '#333333'] // Gold, orange, dark gray
  },
  {
    id: 'hvac',
    name: 'HVAC Tech',
    plural: 'HVAC Technicians',
    services: ['AC repair', 'furnace installation', 'duct cleaning', 'maintenance'],
    painPoints: ['seasonal demand swings', 'emergency service calls', 'explaining repairs'],
    visualElements: ['AC units', 'furnaces', 'vents', 'thermostats', 'tools'],
    colors: ['#87CEEB', '#4682B4', '#DC143C'] // Sky blue, steel blue, crimson
  },
  {
    id: 'landscapers',
    name: 'Landscaper',
    plural: 'Landscapers',
    services: ['lawn care', 'hardscaping', 'tree trimming', 'landscape design'],
    painPoints: ['weather delays', 'seasonal income', 'standing out from competition'],
    visualElements: ['lawns', 'plants', 'mowers', 'gardens', 'outdoor spaces'],
    colors: ['#228B22', '#8FBC8F', '#8B4513'] // Forest green, dark sea green, saddle brown
  },
  {
    id: 'painters',
    name: 'Painter',
    plural: 'Painters',
    services: ['interior painting', 'exterior painting', 'commercial painting', 'deck staining'],
    painPoints: ['showing quality work', 'getting repeat customers', 'competing on more than price'],
    visualElements: ['paint brushes', 'rollers', 'color swatches', 'fresh walls', 'tape'],
    colors: ['#FF6347', '#9370DB', '#20B2AA'] // Tomato, medium purple, light sea green
  }
];

// Get vertical for a specific day (0 = Sunday)
export function getVerticalForDay(dayOfWeek) {
  // Rotate through verticals based on day
  const index = dayOfWeek % verticals.length;
  return verticals[index];
}

// Get vertical by ID
export function getVerticalById(id) {
  return verticals.find(v => v.id === id);
}

export default verticals;
