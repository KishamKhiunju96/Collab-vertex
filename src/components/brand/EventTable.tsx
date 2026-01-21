"use client";

interface EventItem {
  id: string | number;
  title: string;
  date: string;
}

export default function EventTable({ events }: { events: EventItem[] }) {
  if (events.length === 0) return <p>No events yet.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.id}>
            <td>{event.title}</td>
            <td>{event.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
