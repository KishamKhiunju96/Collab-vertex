import {
  MessageSquare,
  UserPlus,
  CheckCircle,
  DollarSign,
  Heart,
} from "lucide-react";
import { BrandActivity } from "@/types/brandActivity";

export const brandActivities: BrandActivity[] = [
  {
    id: "1",
    type: "message",
    icon: MessageSquare,
    title: "New Message",
    description: "dikudada asked about the Blueneon Event",
    time: "2 min ago",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "2",
    type: "collaboration",
    icon: Heart,
    title: "Collaboration Accepted",
    description: "Kisham accepted your collaboration request",
    time: "15 min ago",
    color: "bg-secondary/10 text-secondary",
  },
  {
    id: "3",
    type: "creator",
    icon: UserPlus,
    title: "New Creator Joined",
    description: "Sushmita joined your brand Event",
    time: "1 hour ago",
    color: "bg-accent/10 text-accent",
  },
  {
    id: "4",
    type: "deliverable",
    icon: CheckCircle,
    title: "Deliverables Completed",
    description: "Ble=ueneon event deliverables completed",
    time: "2 hours ago",
    color: "bg-green-500/10 text-green-600",
  },
  {
    id: "5",
    type: "payment",
    icon: DollarSign,
    title: "Payment Processed",
    description: "Rs:50,000 sent to Kisham Khiunju",
    time: "3 hours ago",
    color: "bg-yellow-500/10 text-yellow-600",
  },
];
