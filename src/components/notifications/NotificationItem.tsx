import { NotificationRead } from "@/types/notification";
import { Trash2 } from "lucide-react";

interface Props {
  notification: NotificationRead;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: Props) {
  return (
    <div
      className={`p-3 border-b ${notification.is_read ? "bg-gray-100" : "bg-white"} hover:bg-gray-50 transition`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-bold">{notification.title}</h4>
          <p className="text-sm text-gray-700">{notification.message}</p>
          <div className="flex gap-2 mt-2">
            {!notification.is_read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(notification.id)}
          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
          title="Delete notification"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
