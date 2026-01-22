export default function EventTable({ events }: { events: Event[] }) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.id}>
            <td>{event.title}</td>
            <td>{event.date}</td>
            <td>{/* edit | delete */}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
