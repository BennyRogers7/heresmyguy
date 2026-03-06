import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: "light" | "dark";
}

export default function Breadcrumbs({ items, variant = "dark" }: BreadcrumbsProps) {
  const isLight = variant === "light";

  return (
    <nav
      className={`flex text-sm mb-4 ${isLight ? "text-gray-300" : "text-gray-500"}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center flex-wrap gap-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className={`hover:text-[#d4a853] ${isLight ? "text-gray-300" : ""}`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLight ? "text-white" : "text-gray-900"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
