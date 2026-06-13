import { NotificationContext } from "@/src/contexts/notificationContext";
import { useContext } from "react";

export function useNotifications() {
  return useContext(NotificationContext);
}
