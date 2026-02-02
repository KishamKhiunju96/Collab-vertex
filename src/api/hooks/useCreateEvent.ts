// "use client";

// import { usePostData } from "./usePostData";
// import { createEvent } from "@/api/services/eventService";
// import { CreateEventPayload, Event } from "@/api/types/event";

// export function useCreateEvent(brandId: string) {
//   const { postData, data, loading, error } = usePostData<
//     CreateEventPayload,
//     Event
//   >((payload) => createEvent(brandId, payload));

//   return {
//     createEvent: postData,
//     event: data,
//     loading,
//     error,
//   };
// }
