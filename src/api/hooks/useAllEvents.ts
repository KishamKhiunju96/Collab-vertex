// import { useEffect, useState } from "react";
// import { getAllEvents } from "../services/eventService";
// import type { Event } from "../services/eventService";

// export function useAllEvents() {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setLoading(true);
//     getAllEvents()
//       .then(setEvents)
//       .catch((err) => setError(err.message || "Failed to fetch events"))
//       .finally(() => setLoading(false));
//   }, []);

//   return { events, loading, error };
// }
