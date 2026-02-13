import { useNotificationContext } from "@/context/NotificationContext";
import NotificationItem from "./NotificationItem";

export default function NotificationList() {
  const { notifications, markAsRead, deleteNotification } =
    useNotificationContext();
  console.log(notifications);
  return (
    <div className="w-96 max-h-[500px] overflow-y-auto shadow-lg border rounded-md">
      {notifications.length === 0 ? (
        <p className="p-4 text-gray-500">No notifications</p>
      ) : (
        notifications.map((n) => (
          <NotificationItem
            key={n.id}
            notification={n}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
          />
        ))
      )}
    </div>
  );
}
