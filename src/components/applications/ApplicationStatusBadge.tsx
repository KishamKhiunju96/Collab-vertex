// src/components/applications/ApplicationStatusBadge.tsx

type Props = {
  status: "pending" | "accepted" | "rejected";
};

const statusColors: Record<Props["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<Props["status"], string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function ApplicationStatusBadge({ status }: Props) {
  return (
    <span
      className={`px-2 py-1 rounded text-sm font-medium ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
