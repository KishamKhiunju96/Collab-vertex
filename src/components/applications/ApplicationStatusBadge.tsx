// src/components/applications/ApplicationStatusBadge.tsx
type Props = {
  status: "pending" | "approved" | "rejected";
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ApplicationStatusBadge({ status }: Props) {
  return (
    <span
      className={`px-2 py-1 rounded text-sm font-medium ${statusColors[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
