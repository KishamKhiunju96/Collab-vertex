"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "./navConfig";
import { useSidebar } from "./SidebarProvider";

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();
  const { close, isMobile } = useSidebar();

  const handleClick = () => {
    if (isMobile) {
      close();
    }
  };

  // Group items by category if they have one
  const groupedItems = items.reduce(
    (acc, item) => {
      const category = item.category || "main";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>
  );

  return (
    <nav className="space-y-4">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category}>
          {category !== "main" && (
            <h3 className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {category}
            </h3>
          )}

          <div className="space-y-0.5">
            {categoryItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClick}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}