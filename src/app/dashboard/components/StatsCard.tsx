"use client";

import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white flex items-center gap-4">
      {icon && (
        <div className="p-3 rounded-full text-white ${accentColor}">{icon}</div>
      )}
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
