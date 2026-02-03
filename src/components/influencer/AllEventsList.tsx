// import React from "react";

// export default function AllEventsList() {
//   const { events, loading, error } = useAllEvents();

//   if (loading) return <div>Loading events...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   if (!events.length) return <div>No events found.</div>;

//   return (
//     <div className="bg-white rounded-lg shadow p-6 mt-6">
//       <h2 className="text-xl font-bold mb-4">All Brand Events</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Event Name</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Brand</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {events.map((event) => (
//               <tr key={event.id}>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.name}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.brand?.name || "-"}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.date}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.description}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
// function useAllEvents(): { events: any; loading: any; error: any; } {
//   throw new Error("Function not implemented.");
// }

