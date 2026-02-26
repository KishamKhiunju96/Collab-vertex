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
      className={`p-4 border-b border-border-subtle ${notification.is_read ? "bg-background-muted" : "bg-white"} hover:bg-background-surface transition-all duration-200`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-start gap-2">
            {!notification.is_read && (
              <div className="w-2 h-2 bg-button-primary-DEFAULT rounded-full mt-1.5 shrink-0" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-text-primary">{notification.title}</h4>
              <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!notification.is_read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs text-button-tertiary-text hover:text-button-primary-hover font-semibold transition-colors"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(notification.id)}
          className="text-icon-default hover:text-text-error p-1.5 rounded-lg hover:bg-status-errorBg transition-all duration-200"
          title="Delete notification"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
