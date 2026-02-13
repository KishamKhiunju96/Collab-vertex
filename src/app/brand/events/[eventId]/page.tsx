// src/app/brand/events/[eventId]/page.tsx
import ApplicationsList from "@/components/applications/ApplicationsList";

type PageProps = {
  params: { eventId: string };
};

export default function EventDetailPage({ params }: PageProps) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Event Applications</h1>
      <ApplicationsList eventId={params.eventId} />
    </div>
  );
}
