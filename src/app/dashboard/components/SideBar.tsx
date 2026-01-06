import { cn } from "@/lib/utils";
import Link from "next/link";

interface SideBarProps {
  active?: string;
}

export default function SideBar({ active }: SideBarProps) {
  const links = [
    { label: "Home", href: "/dashboard" },
    { label: "Analytics", href: "/dashboard/analytics" },
    { label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-64 bg-white  shadow-md h-screen p-6 flex flex-col gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition",
            active === link.label && "bg-white text-blue-500",
          )}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
