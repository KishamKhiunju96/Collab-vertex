export interface RoleCardProps {
  role: "Brand" | "Influencer";
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  accentColor: "purple" | "emerald";
  selected?: boolean;
  onClick?: () => void;
}
