"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "./navConfig";

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

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
    {} as Record<string, NavItem[]>,
  );

  return (
    <>
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="sidebar-nav-group">
          {category !== "main" && (
            <h3 className="sidebar-nav-group-title">{category}</h3>
          )}

          {categoryItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon className="sidebar-nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );
}
