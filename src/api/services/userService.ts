import api from "../axiosInstance";
import { chatService } from "./chatService";

export const userService = {
  me: async () => {
    const response = await api.get("/user/me");
    const user = response.data;
    
    // Mark all chat messages as delivered when user is active
    // Use sessionStorage to prevent duplicate calls in same session
    const deliveredMarkedKey = `chat_delivered_marked_${user.id}`;
    const alreadyMarked = sessionStorage.getItem(deliveredMarkedKey);
    
    if (!alreadyMarked) {
      try {
        await chatService.markAllDelivered();
        // Set flag in sessionStorage to prevent duplicate calls this session
        sessionStorage.setItem(deliveredMarkedKey, 'true');
        console.log('✅ All messages marked as delivered');
      } catch (error) {
        // Silently fail - don't break user data fetch
        console.warn("Could not mark messages as delivered:", error);
      }
    }
    
    return response;
  },
};
