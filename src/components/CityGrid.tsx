import Link from "next/link";
import { City } from "@/lib/types";

interface CityGridProps {
  cities: City[];
}

export default function CityGrid({ cities }: CityGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cities.map((city) => (
        <Link
          key={city.slug}
          href={`/${city.slug}`}
          className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-[#e5a527] hover:shadow-lg transition-all duration-200 text-center group"
        >
          <h3 className="font-bold text-[#1a1a2e] group-hover:text-[#e85d04] transition-colors">{city.name}</h3>
          <p className="text-sm text-gray-500 font-medium">{city.count} plumbers</p>
        </Link>
      ))}
    </div>
  );
}
