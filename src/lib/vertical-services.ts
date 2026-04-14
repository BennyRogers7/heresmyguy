// Services offered by each vertical/trade type
// Used in claim forms to show relevant service checkboxes

export interface ServiceOption {
  name: string;
  slug: string;
}

export const VERTICAL_SERVICES: Record<string, ServiceOption[]> = {
  plumbers: [
    { name: "Emergency Plumbing", slug: "emergency-plumbing" },
    { name: "Drain Cleaning", slug: "drain-cleaning" },
    { name: "Water Heater Installation & Repair", slug: "water-heater" },
    { name: "Sewer Line Repair", slug: "sewer-line-repair" },
    { name: "Pipe Repair & Replacement", slug: "pipe-repair" },
    { name: "Bathroom Plumbing", slug: "bathroom-plumbing" },
    { name: "Kitchen Plumbing", slug: "kitchen-plumbing" },
    { name: "Water Softener Installation", slug: "water-softener" },
    { name: "Leak Detection & Repair", slug: "leak-detection" },
    { name: "Toilet Repair & Installation", slug: "toilet-repair" },
  ],
  electricians: [
    { name: "Electrical Repair", slug: "electrical-repair" },
    { name: "Panel Upgrades", slug: "panel-upgrades" },
    { name: "Lighting Installation", slug: "lighting-installation" },
    { name: "Wiring & Rewiring", slug: "wiring" },
    { name: "Outlet & Switch Installation", slug: "outlets-switches" },
    { name: "Generator Installation", slug: "generator-installation" },
    { name: "EV Charger Installation", slug: "ev-charger" },
    { name: "Ceiling Fan Installation", slug: "ceiling-fan" },
    { name: "Electrical Inspections", slug: "electrical-inspections" },
    { name: "Emergency Electrical Service", slug: "emergency-electrical" },
  ],
  landscapers: [
    { name: "Lawn Care & Maintenance", slug: "lawn-care" },
    { name: "Landscape Design", slug: "landscape-design" },
    { name: "Hardscaping", slug: "hardscaping" },
    { name: "Tree Trimming & Removal", slug: "tree-trimming" },
    { name: "Irrigation Systems", slug: "irrigation" },
    { name: "Mulching & Bed Maintenance", slug: "mulching" },
    { name: "Sod Installation", slug: "sod-installation" },
    { name: "Seasonal Cleanup", slug: "seasonal-cleanup" },
    { name: "Retaining Walls", slug: "retaining-walls" },
    { name: "Outdoor Lighting", slug: "outdoor-lighting" },
  ],
  roofers: [
    { name: "Roof Repair", slug: "roof-repair" },
    { name: "Roof Replacement", slug: "roof-replacement" },
    { name: "Roof Inspection", slug: "roof-inspection" },
    { name: "Gutter Installation", slug: "gutter-installation" },
    { name: "Storm Damage Repair", slug: "storm-damage" },
    { name: "Shingle Roofing", slug: "shingle-roofing" },
    { name: "Metal Roofing", slug: "metal-roofing" },
    { name: "Flat Roofing", slug: "flat-roofing" },
    { name: "Skylight Installation", slug: "skylight-installation" },
    { name: "Chimney Repair", slug: "chimney-repair" },
  ],
  hvac: [
    { name: "AC Repair", slug: "ac-repair" },
    { name: "AC Installation", slug: "ac-installation" },
    { name: "Furnace Repair", slug: "furnace-repair" },
    { name: "Furnace Installation", slug: "furnace-installation" },
    { name: "Duct Cleaning", slug: "duct-cleaning" },
    { name: "Thermostat Installation", slug: "thermostat-installation" },
    { name: "Heat Pump Services", slug: "heat-pump" },
    { name: "HVAC Maintenance", slug: "hvac-maintenance" },
    { name: "Indoor Air Quality", slug: "indoor-air-quality" },
    { name: "Emergency HVAC Service", slug: "emergency-hvac" },
  ],
  painters: [
    { name: "Interior Painting", slug: "interior-painting" },
    { name: "Exterior Painting", slug: "exterior-painting" },
    { name: "Cabinet Painting", slug: "cabinet-painting" },
    { name: "Deck Staining", slug: "deck-staining" },
    { name: "Commercial Painting", slug: "commercial-painting" },
    { name: "Wallpaper Removal", slug: "wallpaper-removal" },
    { name: "Drywall Repair", slug: "drywall-repair" },
    { name: "Pressure Washing", slug: "pressure-washing" },
    { name: "Fence Staining", slug: "fence-staining" },
    { name: "Color Consultation", slug: "color-consultation" },
  ],
  "general-contractors": [
    { name: "Home Remodeling", slug: "home-remodeling" },
    { name: "Kitchen Remodeling", slug: "kitchen-remodeling" },
    { name: "Bathroom Remodeling", slug: "bathroom-remodeling" },
    { name: "Basement Finishing", slug: "basement-finishing" },
    { name: "Room Additions", slug: "room-additions" },
    { name: "Deck Building", slug: "deck-building" },
    { name: "Siding Installation", slug: "siding-installation" },
    { name: "Window Replacement", slug: "window-replacement" },
    { name: "Door Installation", slug: "door-installation" },
    { name: "Permit Management", slug: "permit-management" },
  ],
  "pest-control": [
    { name: "Ant Control", slug: "ant-control" },
    { name: "Termite Treatment", slug: "termite-treatment" },
    { name: "Rodent Control", slug: "rodent-control" },
    { name: "Bed Bug Treatment", slug: "bed-bug-treatment" },
    { name: "Mosquito Control", slug: "mosquito-control" },
    { name: "Wasp & Bee Removal", slug: "wasp-bee-removal" },
    { name: "Wildlife Removal", slug: "wildlife-removal" },
    { name: "Cockroach Control", slug: "cockroach-control" },
    { name: "Preventive Pest Control", slug: "preventive-pest-control" },
    { name: "Commercial Pest Control", slug: "commercial-pest-control" },
  ],
  "pool-contractors": [
    { name: "Pool Installation", slug: "pool-installation" },
    { name: "Pool Repair", slug: "pool-repair" },
    { name: "Pool Cleaning", slug: "pool-cleaning" },
    { name: "Pool Opening & Closing", slug: "pool-opening-closing" },
    { name: "Pool Resurfacing", slug: "pool-resurfacing" },
    { name: "Pool Liner Replacement", slug: "pool-liner-replacement" },
    { name: "Pool Equipment Repair", slug: "pool-equipment-repair" },
    { name: "Hot Tub Services", slug: "hot-tub-services" },
    { name: "Pool Deck Installation", slug: "pool-deck" },
    { name: "Pool Automation", slug: "pool-automation" },
  ],
};

/**
 * Get services for a specific vertical
 * Returns empty array if vertical not found
 */
export function getServicesForVertical(verticalSlug: string): ServiceOption[] {
  return VERTICAL_SERVICES[verticalSlug] || [];
}

/**
 * Get all vertical slugs that have services defined
 */
export function getVerticalSlugs(): string[] {
  return Object.keys(VERTICAL_SERVICES);
}
