import { readFileSync, writeFileSync } from "fs";
import path from "path";

interface PlumberMinimal {
  slug: string;
  name: string;
  city: string;
  rating: number | null;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function parseCSV(): PlumberMinimal[] {
  const csvPath = path.join(process.cwd(), "src/data/plumbers.csv");
  const content = readFileSync(csvPath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());
  const headers = lines[0].split(",").map((h) => h.trim());

  const plumbers: PlumberMinimal[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    const name = row.name || "";
    if (!name) continue;

    plumbers.push({
      slug: generateSlug(name),
      name,
      city: row.city || "",
      rating: row.rating ? parseFloat(row.rating) : null,
    });
  }

  return plumbers.sort((a, b) => a.name.localeCompare(b.name));
}

const plumbers = parseCSV();
const outputPath = path.join(process.cwd(), "public/admin-plumbers.json");
writeFileSync(outputPath, JSON.stringify(plumbers, null, 2));
console.log(`Generated ${plumbers.length} plumbers to ${outputPath}`);
