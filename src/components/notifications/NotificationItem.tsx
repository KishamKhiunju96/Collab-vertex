import { NotificationRead } from "@/types/notification";

interface Props {
  notification: NotificationRead;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: Props) {
  return (
    <div
      className={`p-3 border-b ${notification.is_read ? "bg-gray-100" : "bg-white"}`}
    >
      <h4 className="font-bold">{notification.title}</h4>
      <p>{notification.message}</p>
      <button
        onClick={() => onMarkAsRead(notification.id)}
        className="text-sm text-blue-500 mt-1"
      >
        Mark as read
      </button>
    </div>
  );
}
