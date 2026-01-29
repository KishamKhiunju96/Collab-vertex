import { LucideIcon } from "lucide-react";

export type BrandActivityType =
  | "message"
  | "collaboration"
  | "creator"
  | "deliverable"
  | "payment";

export interface BrandActivity {
  id: string;
  type: BrandActivityType;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  color: string;
}
