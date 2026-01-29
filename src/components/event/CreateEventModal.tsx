// "use client";

// import { useEffect, useState } from "react";
// import { eventService } from "@/api/services/eventService";
// import type { CreateEventPayload, EventStatus } from "@/api/types/event";

// interface CreateEventModalProps {
//   open: boolean;
//   brandId: string;
//   onClose: () => void;
//   onCreate: (event: any) => void;
// }

// export default function CreateEventModal({
//   open,
//   brandId,
//   onClose,
//   onCreate,
// }: CreateEventModalProps) {
//   const [title, setTitle] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   /* =======================
//      Reset on Close
//   ======================= */
//   useEffect(() => {
//     if (!open) {
//       setTitle("");
//       setStartDate("");
//       setError(null);
//       setLoading(false);
//     }
//   }, [open]);

//   if (!open) return null;

//   /* =======================
//      Submit
//   ======================= */
//   const handleSubmit = async () => {
//     if (!title.trim() || !startDate) {
//       setError("Event title and start date are required.");
//       return;
//     }

//     const payload: CreateEventPayload = {
//       title: title.trim(),
//       description: "",
//       objectives: "",
//       budget: 0,
//       startDate,
//       endDate: undefined,
//       deliverables: "",
//       targetAudience: "",
//       category: "",
//       location: "",
//       status: "active" as EventStatus,
//     };

//     try {
//       setLoading(true);
//       setError(null);

//       const createdEvent = await eventService.createEvent(
//         brandId,
//         payload,
//       );

//       onCreate(createdEvent);
//       onClose();
//     } catch (err) {
//       console.error("Failed to create event:", err);
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to create event. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =======================
//      UI
//   ======================= */
//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
//         <h2 className="text-lg font-semibold">
//           Create Event
//         </h2>

//         {error && (
//           <p className="text-sm text-red-600">
//             {error}
//           </p>
//         )}

//         {/* Title */}
//         <input
//           type="text"
//           placeholder="Event title"
//           className="border p-2 w-full rounded"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           disabled={loading}
//         />

//         {/* Start Date */}
//         <input
//           type="date"
//           className="border p-2 w-full rounded"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           disabled={loading}
//         />

//         {/* Actions */}
//         <div className="flex justify-end gap-2 pt-2">
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`px-4 py-2 rounded text-white ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-black hover:bg-gray-800"
//             }`}
//           >
//             {loading ? "Creating…" : "Create"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
